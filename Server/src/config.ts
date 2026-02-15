import {config} from 'dotenv'
config();

export const CHAT_MODEL = process.env.CHAT_MODEL;
export const EMBEDDINGS_MODEL = process.env.EMBEDDINGS_MODEL
export const OLLAMA_URL = process.env.OLLAMA_URL;

export const QDRANT_URL = process.env.QDRANT_URL;
export const VECTORE_COLLECTION = process.env.VECTORE_COLLECTION;

export const SERVER_PORT = process.env.SERVER_PORT;

export  const TOP_K = process.env.TOP_K ? +process.env.TOP_K : 5;
