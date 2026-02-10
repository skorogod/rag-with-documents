import { IChatMessage } from "../../../interfaces/chatMessage.interface";

export interface SendMessageParams {
  message: string;
  document_ids?: string[];
  session_id?: string;
}

export interface ChatHistoryWithPagination {
  messages: IChatMessage[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IChatService {
  sendMessage(params: SendMessageParams): Promise<IChatMessage>;
  getChatHistory(session_id?: string): Promise<IChatMessage[]>;
  clearChat(session_id?: string): Promise<number>;
  getChatHistoryWithPagination(
    session_id: string, 
    page: number, 
    limit: number
  ): Promise<ChatHistoryWithPagination>;
  getRecentMessages(session_id: string, limit: number): Promise<IChatMessage[]>;
  getHistoryByDocumentIds(document_ids: string[]): Promise<IChatMessage[]>;
}