import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings";
import { QDRANT_URL, VECTORE_COLLECTION } from "../../config";


export const vectoreStore = new QdrantVectorStore(embeddings, {
    url: QDRANT_URL,
    collectionName: VECTORE_COLLECTION
})

export const retriever = vectoreStore.asRetriever()