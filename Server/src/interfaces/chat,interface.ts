import { IChatMessage } from "./chatMessage.interface";

export interface SendMessageParams {
  message: string;
  document_ids?: string[];
  session_id?: string;
}

export interface AssistantResponse {
  response: string;
  tool_calls?: any[];
  conversation_id?: string;
}

export interface ChatServiceInterface {
  sendMessage(params: SendMessageParams): Promise<IChatMessage>;
  getChatHistory(session_id?: string): Promise<IChatMessage[]>;
  clearChat(session_id?: string): Promise<number>;
}