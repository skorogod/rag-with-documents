import { ChatOllama } from "@langchain/ollama";
import { tools } from "./tools";
import { CHAT_MODEL, OLLAMA_URL } from "../config";

export const chatModel = new ChatOllama({
    baseUrl: OLLAMA_URL,
    model: CHAT_MODEL,
    temperature: 0,
})

export const modelWithTools = chatModel.bindTools(tools)