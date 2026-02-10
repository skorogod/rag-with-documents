import React, { useEffect } from 'react';
import { Box, Typography, List, Divider } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../app/store/hooks';
import { loadDocuments } from '../../documentThunks';
import { DocumentItem } from '../DocumentItem/DocumentItem';
import { Card } from '../../../../shared/ui/Card/Card';
import { Button } from '../../../../shared/ui/buttons/Button/Button';
import { Progress } from '../../../../shared/ui/Progress/Progress';

export const DocumentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { documents, isLoading, error } = useAppSelector((state) => state.documents);

  useEffect(() => {
    dispatch(loadDocuments());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(loadDocuments());
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок */}
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
          Загруженные документы
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Обновить
        </Button>
      </Box>

      {/* Список документов */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {isLoading && documents.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Progress variant="circular" />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Загрузка документов...
            </Typography>
          </Box>
        ) : error ? (
          <Card
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
            }}
          >
            <Typography variant="body2">
              Ошибка загрузки: {error}
            </Typography>
          </Card>
        ) : documents.length === 0 ? (
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
            <Typography variant="body2">
              Нет загруженных документов
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {documents.map((document, index) => (
              <React.Fragment key={document.id}>
                {index > 0 && <Divider component="li" />}
                <DocumentItem document={document} />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      <Divider />

      {/* Статистика */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Всего документов: {documents.length}
        </Typography>
      </Box>
    </Card>
  );
};

DocumentList.displayName = 'DocumentList';