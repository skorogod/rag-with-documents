import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DocumentsState, Document } from '../../interfaces';

const initialState: DocumentsState = {
  documents: [],
  isLoading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addDocument, removeDocument, setDocuments, setLoading, setError } = documentsSlice.actions;
export const documentReducer = documentsSlice.reducer;