import { BaseService } from './BaseService';
import type { Document } from '../interfaces';

export class DocumentsService extends BaseService {
    private static readonly BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';
    static instance: DocumentsService
    private constructor() {
    super(`${DocumentsService.BASE_URL}/documents`);
    }

    public static getInstance(): DocumentsService {
        if (!DocumentsService.instance) {
            DocumentsService.instance = new DocumentsService();
        }
        return DocumentsService.instance;
        }

        public async uploadDocument(file: File): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);

        return this.post<Document>('/upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    }

    public async getDocuments(): Promise<Document[]> {
    return this.get<Document[]>('/');
    }

    public async deleteDocument(documentId: string): Promise<void> {
    return this.delete<void>(`/${documentId}`);
    }
}