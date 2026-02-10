export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  documents?: string[];
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'processed' | 'error';
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface DocumentsState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessagePayload {
  message: string;
  documentIds?: string[];
}

export interface UploadDocumentPayload {
  file: File;
}