import { BaseService } from './BaseService';
import type { SendMessagePayload, ChatMessage } from '../interfaces';

export class ChatService extends BaseService {
  private static readonly BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api'
  static instance: ChatService;
  private constructor() {
    super(`${ChatService.BASE_URL}/chat`);
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    return this.post<ChatMessage>('/message', payload);
  }

  public async getChatHistory(): Promise<ChatMessage[]> {
    return this.get<ChatMessage[]>('/history');
  }

  public async clearChat(): Promise<boolean> {
    return this.delete<boolean>('/clear');
  }
}