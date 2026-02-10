import { DataSource, Repository } from 'typeorm';
import { ChatMessage } from './entities/chatMessage.entity';
import { AppDataSource } from './datasource';



export const initializeDatabase = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connection established');
  }
  return AppDataSource;
};

export const getChatRepository = (): Promise<Repository<ChatMessage>> => {
  return initializeDatabase().then(dataSource => 
    dataSource.getRepository(ChatMessage)
  );
};