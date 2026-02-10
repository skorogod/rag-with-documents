import React from 'react';
import { ListItem, ListItemText, ListItemIcon, Box, Typography } from '@mui/material';
import { useAppDispatch } from '../../../../app/store/hooks';
import { deleteDocument } from '../../documentThunks';
import type { Document } from '../../../../interfaces';
import { IconButton } from '../../../../shared/ui/buttons/IconButton/IconButton';
import { Chip } from '../../../../shared/ui/Chip/Chip';
import { Progress } from '../../../../shared/ui/Progress/Progress';
import { 
  FileIcon, 
  CheckCircleIcon, 
  ErrorIcon, 
  UploadIcon, 
  DeleteIcon 
} from '../../../../shared/ui/Icons';

interface DocumentItemProps {
  document: Document;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (window.confirm(`Удалить документ "${document.name}"?`)) {
      dispatch(deleteDocument(document.id));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'processed':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'uploading':
        return <UploadIcon color="primary" />;
      default:
        return <FileIcon />;
    }
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'processed':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <ListItem
      sx={{
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemIcon>
        {document.status === 'uploading' ? (
          <Progress variant="circular" size={24} />
        ) : (
          getStatusIcon()
        )}
      </ListItemIcon>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {document.name}
            </Typography>
            <Chip
              label={document.status === 'uploading' ? 'Загрузка' : document.status}
              size="small"
              color={getStatusColor() as any}
            />
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(document.size)} • {document.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(document.uploadDate).toLocaleDateString()}
            </Typography>
          </Box>
        }
      />

      <IconButton
        size="small"
        color="error"
        onClick={handleDelete}
        disabled={document.status === 'uploading'}
        sx={{ ml: 1 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );
};

DocumentItem.displayName = 'DocumentItem';