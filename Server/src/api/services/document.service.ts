import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import AdmZip from 'adm-zip';
import { splitter } from '../../agent/rag/splitter';
import { retriever, vectoreStore } from '../../agent/rag/vectoreStore';
import { Document } from '../../db/entities/document.entity';
import { Document as LangChainDocument } from 'langchain';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../db/datasource';

export interface IDocumentsService {
  parseDocument(filePath: string): Promise<string>;
  getFileInfo(filePath: string): { size: number; extension: string; mimeType: string };
  getTextStats(text: string): {
    characters: number;
    words: number;
    lines: number;
    sentences: number;
  };
}

export class DocumentsService implements IDocumentsService {
  private static instance: DocumentsService;
  private repository: Repository<Document>

  private constructor(repository: Repository<Document>) {
    this.repository = repository
  }

  public static getInstance(): DocumentsService {
    if (!DocumentsService.instance) {
      DocumentsService.instance = new DocumentsService(AppDataSource.getRepository(Document));
    }
    return DocumentsService.instance;
  }

  async create(document: Omit<Document, "id" | "uploaded_at">) {
    const doc = this.repository.create(document)
    await this.repository.save(doc)
    return doc;
  }

  async find() {
    return this.repository.find();
  }

  /**
   * Парсит текст из файлов .doc, .docx, .txt, .md
   */
  public async parseDocument(filePath: string): Promise<string> {
    const extension = path.extname(filePath).toLowerCase();
    
    switch (extension) {
      case '.docx':
        return await this.parseDocx(filePath);
      case '.doc':
        return await this.parseLegacyDoc(filePath);
      case '.txt':
        return await this.parseTextFile(filePath);
      case '.md':
        return await this.parseMarkdownFile(filePath);
      default:
        throw new Error(`Unsupported file format: ${extension}. Supported: .doc, .docx, .txt, .md`);
    }
  }

  /**
   * Парсинг .docx файлов
   */
  private async parseDocx(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    } catch {
      return await this.extractTextFromDocx(filePath);
    }
  }

  /**
   * Альтернативный метод извлечения текста из .docx
   */
  private async extractTextFromDocx(filePath: string): Promise<string> {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    
    for (const entry of zipEntries) {
      if (entry.entryName === 'word/document.xml') {
        const content = entry.getData().toString('utf8');
        return this.extractTextFromXml(content);
      }
    }
    
    throw new Error('Could not find document.xml in .docx file');
  }

  /**
   * Парсинг старых .doc файлов
   */
  private async parseLegacyDoc(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('binary');
    
    let extractedText = '';
    const lines = content.split('\n');
    
    for (const line of lines) {
      const cleanLine = line.replace(/[^\x20-\x7E\x0A\x0D]/g, ' ').trim();
      if (cleanLine.length > 1) {
        extractedText += cleanLine + '\n';
      }
    }
    
    if (!extractedText.trim()) {
      throw new Error('Could not extract text from .doc file');
    }
    
    return extractedText.trim();
  }

  /**
   * Парсинг текстовых файлов .txt
   */
  private async parseTextFile(filePath: string): Promise<string> {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.substring(1);
    }
    
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  }

  /**
   * Парсинг Markdown файлов .md
   */
  private async parseMarkdownFile(filePath: string): Promise<string> {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.substring(1);
    }
    
    return this.simplifyMarkdown(content).trim();
  }

  /**
   * Упрощение markdown разметки
   */
  private simplifyMarkdown(markdown: string): string {
    let text = markdown;
    
    text = text.replace(/^#+\s+/gm, '');
    text = text.replace(/\*\*\*?|\_\_(.*?)\_\_|\*\*(.*?)\*\*|\*(.*?)\*|\_(.*?)\_/g, '$1$2$3$4');
    text = text.replace(/~~(.*?)~~/g, '$1');
    text = text.replace(/`([^`]+)`/g, '$1');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
    text = text.replace(/^\>\s+/gm, '');
    text = text.replace(/^[\s]*[\*\-\+] /gm, '');
    text = text.replace(/^[\s]*\d+\. /gm, '');
    text = text.replace(/^[\-\*_]{3,}\s*$/gm, '');
    text = text.replace(/<[^>]*>/g, '');
    text = text.replace(/\s+/g, ' ');
    
    return text;
  }

  /**
   * Извлечение текста из XML
   */
  private extractTextFromXml(xmlContent: string): string {
    return xmlContent
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&[a-z]+;/g, '')
      .trim();
  }

  /**
   * Получение информации о файле
   */
  public getFileInfo(filePath: string): { size: number; extension: string; mimeType: string } {
    const stats = fs.statSync(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    let mimeType = 'application/octet-stream';
    switch (extension) {
      case '.docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.doc':
        mimeType = 'application/msword';
        break;
      case '.txt':
        mimeType = 'text/plain';
        break;
      case '.md':
        mimeType = 'text/markdown';
        break;
    }
    
    return {
      size: stats.size,
      extension,
      mimeType
    };
  }

  /**
   * Получение статистики по тексту
   */
  public getTextStats(text: string): {
    characters: number;
    words: number;
    lines: number;
    sentences: number;
  } {
    const characters = text.length;
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const lines = text.split('\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    return {
      characters,
      words,
      lines,
      sentences
    };
  }

  async addToVectoreStore(text: string, fileName: string) {
    try {
        const allSplits = await splitter.splitText(text)
        const documents: LangChainDocument[] = []
        const res = fileName.match((/_(\d+)\.md$/))
        let year: number | null = null;
        if (res) {
          year = Number(res[1])
        } else {
          year = 2026
        }
        allSplits.forEach((chunk) => {
            documents.push({
                pageContent: chunk,
                metadata: {
                    fileName,
                    year
                }
            })
        })
        await vectoreStore.addDocuments(documents);
        return true;
    } catch (error) {
        console.error(error)
        return false
    }
  }

  async findInVectoreStore(query: string) {
    return await retriever.invoke(query)
  }
}