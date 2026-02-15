import { OllamaEmbeddings } from "@langchain/ollama";
import { EMBEDDINGS_MODEL, OLLAMA_URL } from "../../config";

export const embeddings = new OllamaEmbeddings({
    model: EMBEDDINGS_MODEL,
    baseUrl: OLLAMA_URL,
    dimensions: 768,
    requestOptions: {
        use_mmap: true,
        num_thread: 6,
        num_gpu: 1,
    }
})