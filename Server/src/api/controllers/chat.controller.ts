import { Request, Response } from 'express';
import { ChatMessage } from '../../db/entities/chatMessage.entity';
import { IChatService } from '../services/chat/IChatService';
import { SendMessageParams } from '../../interfaces/chat,interface';
import { ChatService } from '../services/chat/chat.service';
import { AppDataSource } from '../../db/datasource';

export class ChatController {
    public static instance: ChatController;
    private chatService: IChatService;

    private constructor() {
        this.chatService = ChatService.getInstance(AppDataSource.getRepository(ChatMessage))
        ChatController.instance = this;
    }

    static getInstance() {
        return ChatController.instance || new ChatController();
    }

    /**
     * Отправка сообщения
     */
    public async sendMessage(req: Request, res: Response): Promise<void> {
        try {
        const { message, document_ids, session_id } = req.body;

        if (!message || typeof message !== 'string') {
            res.status(400).json({
            success: false,
            error: 'Message is required and must be a string'
            });
            return;
        }

        const params: SendMessageParams = {
            message,
            document_ids: document_ids || [],
            session_id
        };

        const result = await this.chatService.sendMessage(params);

        res.status(200).json({
            ...result,
            timestamp: result.created_at
        });

        } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }

    /**
     * Получение истории чата
     */
    public async getChatHistory(req: Request, res: Response): Promise<void> {
        try {
        const { session_id } = req.query;

        const messages = await this.chatService.getChatHistory(
            session_id as string | undefined
        );

        res.status(200).json(messages.map(msg => ({...msg, timestamp: msg.created_at})));

        } catch (error) {
        console.error('Error in getChatHistory:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
        }
    }

    /**
     * Очистка истории чата
     */
    public async clearChat(req: Request, res: Response): Promise<void> {
        try {
        const { session_id } = req.query;

        const deletedCount = await this.chatService.clearChat(
            session_id as string | undefined
        );

        res.status(200).json({
            success: true,
            deleted_count: deletedCount,
            message: `Deleted ${deletedCount} messages`
        });

        } catch (error) {
        console.error('Error in clearChat:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
        }
    }

    /**
     * Получение истории с пагинацией
     */
    public async getChatHistoryPaginated(req: Request, res: Response): Promise<void> {
        try {
        const { session_id } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        if (!session_id || typeof session_id !== 'string') {
            res.status(400).json({
            success: false,
            error: 'Session ID is required'
            });
            return;
        }

        const result = await this.chatService.getChatHistoryWithPagination(
            session_id,
            page,
            limit
        );

        res.status(200).json({
            success: true,
            data: result
        });

        } catch (error) {
        console.error('Error in getChatHistoryPaginated:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
        }
    }

    /**
     * Получение истории по документам
     */
    public async getHistoryByDocuments(req: Request, res: Response): Promise<void> {
        try {
        const { document_ids } = req.query;

        if (!document_ids || typeof document_ids !== 'string') {
            res.status(400).json({
            success: false,
            error: 'Document IDs are required'
            });
            return;
        }

        const ids = document_ids.split(',').map(id => id.trim()).filter(id => id);
        
        const messages = await this.chatService.getHistoryByDocumentIds(ids);

        res.status(200).json({
            success: true,
            data: messages,
            count: messages.length
        });

        } catch (error) {
        console.error('Error in getHistoryByDocuments:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
        }
    }
}

export const chatController = ChatController.getInstance();