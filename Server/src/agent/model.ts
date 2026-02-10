import { ChatOllama } from "@langchain/ollama";
import { tools } from "./tools";

export const chatModel = new ChatOllama({
    model: "llama3.2:3b-instruct-q4_K_M",
    temperature: 0,
})

export const modelWithTools = chatModel.bindTools(tools)