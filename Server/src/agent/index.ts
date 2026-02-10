import { createAgent, SystemMessage } from "langchain";
import { retrieve } from "./tools/retrieve";
import { chatModel } from "./model";

const tools = [retrieve]

const systemPrompt = new SystemMessage(
    "You have access to a tool that retrieves context from a blog post. " +
    "Use the tool to help answer user queries."
)

export const agent = createAgent({model: chatModel, tools, systemPrompt})