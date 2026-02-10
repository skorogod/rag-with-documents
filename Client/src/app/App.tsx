import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { loadChatHistory } from '../features/chat/chatThunks';
import { ChatWindow } from '../features/chat/ui/ChatWindow /ChatWindow';
import { DocumentList } from '../features/document/ui/DocumentList/DocumentList';
import { loadDocuments } from '../features/document/documentThunks';


const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadChatHistory());
    dispatch(loadDocuments());
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ maxHeight: '100vh', py: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        AI Агент с Базой Знаний
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
        height: 'calc(100vh - 100px)'
      }}>
        <Box sx={{ height: '100%' }}>
          <ChatWindow />
        </Box>
        
        <Box sx={{ height: '100%' }}>
          <DocumentList />
        </Box>
      </Box>
    </Container>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};