import React from 'react';
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  SmartToy as AssistantIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export {
  DeleteIcon,
  PersonIcon,
  AssistantIcon,
  SendIcon,
  AttachFileIcon,
  FileIcon,
  CheckCircleIcon,
  ErrorIcon,
  UploadIcon,
  RefreshIcon,
};

// Тип для иконок
export type IconType = 
  | 'delete'
  | 'person'
  | 'assistant'
  | 'send'
  | 'attach'
  | 'file'
  | 'check'
  | 'error'
  | 'upload'
  | 'refresh';

// Компонент иконки по типу
export const Icon: React.FC<{ name: IconType; color?: string; size?: number }> = ({ 
  name, 
  color, 
  size = 24 
}) => {
  const icons: Record<IconType, React.ReactNode> = {
    delete: <DeleteIcon style={{ color, fontSize: size }} />,
    person: <PersonIcon style={{ color, fontSize: size }} />,
    assistant: <AssistantIcon style={{ color, fontSize: size }} />,
    send: <SendIcon style={{ color, fontSize: size }} />,
    attach: <AttachFileIcon style={{ color, fontSize: size }} />,
    file: <FileIcon style={{ color, fontSize: size }} />,
    check: <CheckCircleIcon style={{ color, fontSize: size }} />,
    error: <ErrorIcon style={{ color, fontSize: size }} />,
    upload: <UploadIcon style={{ color, fontSize: size }} />,
    refresh: <RefreshIcon style={{ color, fontSize: size }} />,
  };

  return <>{icons[name]}</>;
};