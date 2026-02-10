export interface MessageMetadata {
  tool_calls?: any[];
  conversation_id?: string;
  error?: boolean;
  [key: string]: any;
}

export interface IChatMessage {
  id: string;
  session_id: string;
  content: string;
  sender: 'user' | 'assistant';
  document_ids: string[];
  message_metadata?: MessageMetadata;
  created_at: Date;
  updated_at?: Date;
}