import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentsService } from '../../api/DocumentsService';
import type { Document } from '../../interfaces';
import { addDocument, removeDocument, setDocuments, setLoading, setError } from './documentSlice';

const documentsService = DocumentsService.getInstance();

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (file: File, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const tempDocument: Document = {
        id: `temp-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'uploading',
      };
      dispatch(addDocument(tempDocument));
      
      const uploadedDocument = await documentsService.uploadDocument(file);
      
      dispatch(removeDocument(tempDocument.id));
      dispatch(addDocument(uploadedDocument));
      
      return uploadedDocument;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to upload document'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const loadDocuments = createAsyncThunk(
  'documents/load',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const documents = await documentsService.getDocuments();
      dispatch(setDocuments(documents));
      return documents;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to load documents'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (documentId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      await documentsService.deleteDocument(documentId);
      dispatch(removeDocument(documentId));
      return documentId;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to delete document'));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);