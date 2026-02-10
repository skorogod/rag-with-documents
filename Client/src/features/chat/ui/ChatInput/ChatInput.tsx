import React, { useState, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../../app/store/hooks';
import { uploadDocument } from '../../../document/documentThunks';
import { sendMessage } from '../../chatThunks';
import { Input } from '../../../../shared/ui/Input/Input';
import { Button } from '../../../../shared/ui/buttons/Button/Button';
import { IconButton } from '../../../../shared/ui/buttons/IconButton/IconButton';
import { Chip } from '../../../../shared/ui/Chip/Chip';

interface ChatInputProps {
  selectedDocuments: string[];
  onDocumentsChange: (documents: string[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  selectedDocuments, 
  onDocumentsChange 
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    for (const file of files) {
      try {
        const result = await dispatch(uploadDocument(file)).unwrap();
      } catch (error) {
        console.error('Failed to upload document:', error);
      }
    }
    if (message.trim().length) {
      dispatch(sendMessage({
        message: message.trim(),
        documentIds: [...selectedDocuments],
      }));
    }

    setMessage('');
    setFiles([]);
    onDocumentsChange([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      {(files.length > 0 || selectedDocuments.length > 0) && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {selectedDocuments.map(docId => (
            <Chip
              key={docId}
              label={`Док. ${docId.slice(0, 8)}`}
              onDelete={() => 
                onDocumentsChange(selectedDocuments.filter(id => id !== docId))
              }
            />
          ))}
          {files.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              onDelete={() => removeFile(index)}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          sx={{ flexShrink: 0 }}
        >
          <AttachFileIcon />
        </IconButton>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          style={{ display: 'none' }}
        />

        <Input
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!message.trim() && files.length === 0}
          startIcon={<SendIcon />}
          sx={{ flexShrink: 0, height: '56px' }}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
};

ChatInput.displayName = 'ChatInput';