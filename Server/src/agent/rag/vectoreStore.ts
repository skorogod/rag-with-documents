import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings";
import { QDRANT_URL, VECTORE_COLLECTION } from "../../config";
import { TOP_K } from "../../config";


export const vectoreStore = new QdrantVectorStore(embeddings, {
    url: QDRANT_URL,
    collectionName: VECTORE_COLLECTION,
    collectionConfig: {
        hnsw_config: {
            m: 16,
            ef_construct: 100
        },
        vectors: {
            size: 768,
            distance: "Cosine",
        }
    }
})

export const retriever = vectoreStore.asRetriever({
    k: TOP_K,
})