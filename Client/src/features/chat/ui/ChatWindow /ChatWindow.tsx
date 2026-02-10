import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../app/store/hooks';
import { ChatInput } from '../ChatInput/ChatInput';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { Card } from '../../../../shared/ui/Card/Card';
import { Button } from '../../../../shared/ui/buttons/Button/Button';
import { clearChat } from '../../chatThunks';

export const ChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, isLoading, error } = useAppSelector((state) => state.chat);
  const { documents } = useAppSelector((state) => state.documents);
  
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm('Вы уверены, что хотите очистить историю чата?')) {
      dispatch(clearChat());
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      {/* Заголовок чата */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Чат с AI агентом
        </Typography>
        
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleClearChat}
          disabled={messages.length === 0 || isLoading}
        >
          Очистить чат
        </Button>
      </Box>

      {/* Сообщения */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 && !isLoading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Начните диалог с AI агентом
            </Typography>
            <Typography variant="body2" align="center">
              Отправьте сообщение или загрузите документы для получения информации
            </Typography>
          </Box>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && messages.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              AI агент думает...
            </Typography>
          </Box>
        )}

        {error && (
          <Card
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
              mt: 2,
            }}
          >
            <Typography variant="body2">
              Ошибка: {error}
            </Typography>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Ввод сообщения */}
      <ChatInput
        selectedDocuments={selectedDocuments}
        onDocumentsChange={setSelectedDocuments}
      />
    </Card>
  );
};

ChatWindow.displayName = 'ChatWindow';