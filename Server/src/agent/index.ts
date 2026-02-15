import { createAgent, SystemMessage } from "langchain";
import { retrieve } from "./tools/retrieve";
import { chatModel } from "./model";

const tools = [retrieve]

const systemPrompt = new SystemMessage(`
    Ты - ассистент, помогающий с поиском в базе знаний компании.

    ДЛЯ ПОИСКА ИСПОЛЬЗУЙ ИНСТРУМЕНТ retrieve_company_prorcess_info:
    - Если пользователь спрашивает про конкретный год (например, "правила за 2024"), передай параметр year
    - Если пользователь не указывает дату, передай только query

    ВАЖНО: Всегда анализируй запрос на наличие указаний по дате и используй соответствующие параметры!
`)

export const agent = createAgent({model: chatModel, tools, systemPrompt})