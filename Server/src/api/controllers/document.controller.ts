import { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentsService } from '../services/document.service';

export class DocumentsController {
  private static instance: DocumentsController;
  private documentsService: DocumentsService;
  private upload: multer.Multer;

  private constructor() {
    this.documentsService = DocumentsService.getInstance();
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeFilename = path.parse(file.originalname).name
          .replace(/[^a-zA-Z0-9\-_]/g, '_')
          .substring(0, 100);
        cb(null, `${safeFilename}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      const allowedExtensions = ['.doc', '.docx', '.txt', '.md'];
      const allowedMimeTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'application/octet-stream'
      ];
      
      const ext = path.extname(file.originalname).toLowerCase();
      
      const isValidExtension = allowedExtensions.includes(ext);
      const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
      
      if (isValidExtension || isValidMimeType) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`));
      }
    };

    this.upload = multer({ 
      storage, 
      fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
      }
    });
  }

  public static getInstance(): DocumentsController {
    if (!DocumentsController.instance) {
      DocumentsController.instance = new DocumentsController();
    }
    return DocumentsController.instance;
  }

  async getList(req: Request, res: Response) {
    try {
      const documents = await this.documentsService.find()
      return res.json(documents.map(doc => ({
        ...doc,
        uploadDate: doc.uploaded_at
      }))).status(200)
    } catch (error) {
      console.error("get documents list error", error)
      return res.json({error}).status(500)
    }
  }

  public uploadMiddleware() {
    return this.upload.single('file');
  }

  public uploadMultipleMiddleware() {
    return this.upload.array('files', 10);
  }

  public async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ 
          success: false, 
          message: 'No file uploaded' 
        });
        return;
      }

      const filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8') 

      const filePath = req.file.path;
      const text = await this.documentsService.parseDocument(filePath);
      const fileInfo = this.documentsService.getFileInfo(filePath);
      await this.documentsService.addToVectoreStore(text, filename)
      const doc = await this.documentsService.create({name: filename, size: req.file.size, extension: fileInfo.extension, status: "processed"})
      
      this.cleanupFile(filePath);

      res.status(200).json({
        status: "processed",
        name: filename,
        type: fileInfo.extension,
        size: req.file.size,
        uploadDate: doc.uploaded_at
      });

    } catch (error) {
      if (req.file) {
        this.cleanupFile(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to parse document',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  public async uploadMultipleDocuments(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ 
          success: false, 
          message: 'No files uploaded' 
        });
        return;
      }

      const files = req.files as Express.Multer.File[];
      const results = [];
      const fileTypes: {[key: string]: number} = {};

      for (const file of files) {
        const extension = path.extname(file.originalname).toLowerCase();
        fileTypes[extension] = (fileTypes[extension] || 0) + 1;
        
        try {
          const text = await this.documentsService.parseDocument(file.path);
          const stats = this.documentsService.getTextStats(text);
          
          results.push({
            filename: file.originalname,
            fileType: extension,
            fileSize: file.size,
            stats,
            success: true,
            preview: text.substring(0, 150) + (text.length > 150 ? '...' : '')
          });

          this.cleanupFile(file.path);

        } catch {
          results.push({
            filename: file.originalname,
            fileType: extension,
            fileSize: file.size,
            stats: { characters: 0, words: 0, lines: 0, sentences: 0 },
            success: false,
            error: 'Failed to parse file'
          });

          this.cleanupFile(file.path);
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      const totalStats = results
        .filter(r => r.success)
        .reduce((acc, curr) => ({
          characters: acc.characters + (curr.stats?.characters || 0),
          words: acc.words + (curr.stats?.words || 0),
          lines: acc.lines + (curr.stats?.lines || 0),
          sentences: acc.sentences + (curr.stats?.sentences || 0)
        }), { characters: 0, words: 0, lines: 0, sentences: 0 });

      res.status(200).json({
        success: true,
        data: {
          summary: {
            totalFiles: files.length,
            successful,
            failed,
            fileTypes,
            totalStats
          },
          results
        }
      });

    } catch (error) {
      if (req.files && Array.isArray(req.files)) {
        (req.files as Express.Multer.File[]).forEach(file => {
          this.cleanupFile(file.path);
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to process documents',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  private cleanupFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Игнорируем ошибки удаления
    }
  }

  public healthCheck(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      service: 'documents-service',
      version: '1.0.0',
      supportedFormats: ['.doc', '.docx', '.txt', '.md']
    });
  }

  public getSupportedFormats(req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      formats: [
        { extension: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', support: 'full' },
        { extension: '.doc', mimeType: 'application/msword', support: 'limited' },
        { extension: '.txt', mimeType: 'text/plain', support: 'full' },
        { extension: '.md', mimeType: 'text/markdown', support: 'full' }
      ]
    });
  }

  async getSimilar(req: Request, res: Response) {
    const query = req.body.query;
    const similar = await this.documentsService.findInVectoreStore(query)
    return res.json({
        similar
    })
  }
}


export const documentController = DocumentsController.getInstance();