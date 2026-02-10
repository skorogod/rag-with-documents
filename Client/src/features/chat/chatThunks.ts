import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChatService } from '../../api/ChatService';
import type { SendMessagePayload, ChatMessage } from '../../interfaces/index'
import { addMessage, setLoading, setError } from './chatSlice';

const chatService = ChatService.getInstance();

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: payload.message,
        sender: 'user',
        timestamp: new Date(),
        documents: payload.documentIds,
      };
      dispatch(addMessage(userMessage));
      
      const response = await chatService.sendMessage(payload);
      dispatch(addMessage(response));
      
      return response;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to send message'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  'chat/loadHistory',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const messages = await chatService.getChatHistory();
      return messages;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to load chat history'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const clearChat = createAsyncThunk(
  "chat/clearChat",
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const res = await chatService.clearChat()
      return res
    } catch (error) {
      console.error("clear chat error", error)
      rejectWithValue(false)
    }
  }
)