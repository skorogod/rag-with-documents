import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import type { ChatMessage as ChatMessageType } from '../../../../interfaces';
import { Avatar } from '../../../../shared/ui/Avatar/Avatar';
import { Card } from '../../../../shared/ui/Card/Card';
import { Chip } from '../../../../shared/ui/Chip/Chip';
import { PersonIcon, AssistantIcon } from '../../../../shared/ui/Icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '85%',
          gap: 1,
        }}
      >
        {/* Аватар */}
        <Avatar
          size="medium"
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            flexShrink: 0,
          }}
        >
          {isUser ? <PersonIcon /> : <AssistantIcon />}
        </Avatar>

        {/* Сообщение */}
        <Card
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.light' : 'grey.50',
            borderColor: isUser ? 'primary.main' : 'grey.300',
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 12,
              [isUser ? 'right' : 'left']: '-8px',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '8px 0 8px 8px',
              borderColor: `transparent transparent transparent ${
                isUser ? 'primary.main' : 'grey.300'
              }`,
              transform: isUser ? 'rotate(180deg)' : 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 12,
              [isUser ? 'right' : 'left']: '-6px',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '8px 0 8px 8px',
              borderColor: `transparent transparent transparent ${
                isUser ? 'primary.light' : 'grey.50'
              }`,
              transform: isUser ? 'rotate(180deg)' : 'none',
            },
          }}
        >
          {/* Текст сообщения */}
          <Typography
            variant="body1"
            sx={{
              color: isUser ? 'primary.contrastText' : 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Typography>

          {/* Прикрепленные документы */}
          {message.documents && message.documents.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 0.5,
                  color: isUser ? 'primary.contrastText' : 'text.secondary',
                  opacity: 0.8,
                }}
              >
                Прикрепленные документы:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {message.documents.map((docId) => (
                  <Chip
                    key={docId}
                    label={`Док. ${docId.slice(0, 8)}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: isUser ? 'primary.contrastText' : 'grey.400',
                      color: isUser ? 'primary.contrastText' : 'text.primary',
                      backgroundColor: isUser 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.04)',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Время */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              textAlign: 'right',
              color: isUser ? 'primary.contrastText' : 'text.secondary',
              opacity: 0.7,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

ChatMessage.displayName = 'ChatMessage';