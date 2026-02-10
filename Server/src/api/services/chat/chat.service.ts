import { AssistantService } from './../../../agent/services/assistant.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../../../db/entities/chatMessage.entity';
import { IChatMessage, MessageMetadata } from '../../../interfaces/chatMessage.interface';
import { 
  IChatService, 
  SendMessageParams, 
  ChatHistoryWithPagination 
} from './IChatService';


export class ChatService implements IChatService {
  private static instance: ChatService;
  private chatRepository: Repository<ChatMessage>;

  private constructor(chatRepository: Repository<ChatMessage>) {
    this.chatRepository = chatRepository;
  }

  public static getInstance(chatRepository?: Repository<ChatMessage>): ChatService {
    if (!ChatService.instance && chatRepository) {
      ChatService.instance = new ChatService(chatRepository);
    }
    return ChatService.instance;
  }

  public static resetInstance(): void {
    ChatService.instance = null as any;
  }

  /**
   * Обрабатывает сообщение пользователя и возвращает ответ ассистента
   */
  public async sendMessage(params: SendMessageParams): Promise<IChatMessage> {
    const { message, document_ids = [], session_id } = params;
    
    const currentSessionId = session_id || uuidv4();
    
    // Сохраняем сообщение пользователя
    const userMessage = this.chatRepository.create({
      session_id: currentSessionId,
      content: message,
      sender: 'user',
      document_ids,
      message_metadata: {}
    });

    await this.chatRepository.save(userMessage);

    try {
      // Получаем ответ от ассистента
      const assistantResponse = await AssistantService.processMessage(message, currentSessionId);

      // Сохраняем ответ ассистента
      const assistantMessage = this.chatRepository.create({
        session_id: currentSessionId,
        content: assistantResponse.response,
        sender: 'assistant',
        document_ids,
        message_metadata: {
          tool_calls: assistantResponse.tool_calls || [],
          conversation_id: assistantResponse.conversation_id
        } as MessageMetadata
      });

      const savedMessage = await this.chatRepository.save(assistantMessage);
      console.log(savedMessage)
      return savedMessage;

    } catch (error) {
      console.error('Error processing message:', error);

      // Сохраняем сообщение об ошибке
      const errorMessage = this.chatRepository.create({
        session_id: currentSessionId,
        content: 'Извините, произошла ошибка.',
        sender: 'assistant',
        document_ids,
        message_metadata: { error: true } as MessageMetadata
      });

      const savedErrorMessage = await this.chatRepository.save(errorMessage);
      return savedErrorMessage;
    }
  }

  /**
   * Получает историю чата
   */
  public async getChatHistory(session_id?: string): Promise<IChatMessage[]> {
    const queryBuilder = this.chatRepository.createQueryBuilder('chat');
    
    if (session_id) {
      queryBuilder.where('chat.session_id = :session_id', { session_id });
    }
    
    queryBuilder.orderBy('chat.created_at', 'ASC');
    
    return await queryBuilder.getMany();
  }

  /**
   * Очищает историю чата
   */
  public async clearChat(session_id?: string): Promise<number> {
    const queryBuilder = this.chatRepository.createQueryBuilder('chat');
    
    if (session_id) {
      queryBuilder.where('chat.session_id = :session_id', { session_id });
    }
    
    const result = await queryBuilder.delete().execute();
    return result.affected || 0;
  }

  /**
   * Получает историю по сессии с пагинацией
   */
  public async getChatHistoryWithPagination(
    session_id: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<ChatHistoryWithPagination> {
    const [messages, total] = await this.chatRepository.findAndCount({
      where: { session_id },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Получает последние N сообщений из сессии
   */
  public async getRecentMessages(session_id: string, limit: number = 10): Promise<IChatMessage[]> {
    return await this.chatRepository.find({
      where: { session_id },
      order: { created_at: 'DESC' },
      take: limit
    });
  }

  /**
   * Получает историю по идентификаторам документов
   */
  public async getHistoryByDocumentIds(document_ids: string[]): Promise<IChatMessage[]> {
    if (!document_ids.length) {
      return [];
    }

    return await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.document_ids && ARRAY[:...document_ids]', { document_ids })
      .orderBy('chat.created_at', 'ASC')
      .getMany();
  }

  /**
   * Получает сообщение по ID
   */
  public async getMessageById(id: string): Promise<IChatMessage | null> {
    return await this.chatRepository.findOne({ where: { id } });
  }

  /**
   * Обновляет сообщение
   */
  public async updateMessage(
    id: string, 
    updates: Partial<IChatMessage>
  ): Promise<IChatMessage | null> {
    await this.chatRepository.update(id, updates);
    return await this.getMessageById(id);
  }

  /**
   * Удаляет сообщение по ID
   */
  public async deleteMessage(id: string): Promise<boolean> {
    const result = await this.chatRepository.delete(id);
    return (result.affected || 0) > 0;
  }
}
