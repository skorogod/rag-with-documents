import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';

export interface MessageMetadata {
  tool_calls?: any[];
  conversation_id?: string;
  error?: boolean;
}

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  session_id!: string;

  @Column('text')
  content!: string;

  @Column()
  sender!: 'user' | 'assistant';

  @Column('json', { default: '[]' })
  document_ids!: string[];

  @Column('json', { nullable: true })
  message_metadata?: MessageMetadata;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}