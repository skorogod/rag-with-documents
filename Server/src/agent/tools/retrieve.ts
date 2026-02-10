import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { retriever } from "../rag/vectoreStore";
import { Document } from "@langchain/core/documents";

export const retrieve = tool(
  async (input: unknown) => {
    console.log('🔧 Тип входа:', typeof input);
    console.log('🔧 Значение входа:', JSON.stringify(input, null, 2));
    
    // Универсальная обработка входа
    let query: string;
    
    if (typeof input === 'string') {
      // Случай 1: пришла строка напрямую
      query = input;
      
    } else if (Array.isArray(input)) {
      // Случай 2: пришёл массив (частая проблема!)
      // Пример: args: ["мой запрос"] или args: [{ query: "..." }]
      const firstItem = input[0];
      
      if (typeof firstItem === 'string') {
        query = firstItem;
      } else if (firstItem && typeof firstItem === 'object' && 'query' in firstItem) {
        query = (firstItem as { query: string }).query;
      } else {
        query = JSON.stringify(firstItem);
      }
      
    } else if (input && typeof input === 'object') {
      // Случай 3: пришёл объект
      if ('query' in input) {
        query = (input as { query: string }).query;
      } else if ('input' in input) {
        query = (input as { input: string }).input;
      } else {
        query = JSON.stringify(input);
      }
      
    } else {
      // Случай 4: что-то неожиданное
      query = String(input);
    }
    
    console.log('✅ Извлечённый запрос:', query);
    
    try {
      const documents: Document[] = await retriever.invoke(query);
      
      if (documents.length === 0) {
        return "Не найдено релевантных документов по запросу.";
      }
      
      return documents
        .map((doc, i) => 
          `Документ ${i + 1}:\nСодержание: ${doc.pageContent}\nМетаданные: ${JSON.stringify(doc.metadata)}`
        )
        .join("\n\n---\n\n");
        
    } catch (error) {
      console.error("❌ Ошибка ретривера:", error);
      return `Ошибка при поиске: ${error instanceof Error ? error.message : 'неизвестная ошибка'}`;
    }
  },
  {
    name: "retrieve_blog_posts",
    description: "Найди и верни информацию о внутренних процессах компании. Используй конкретный поисковый запрос.",
    // Универсальная схема, принимающая любой формат
    schema: z.union([
      z.string().describe("Поисковый запрос"),
      z.object({ query: z.string().describe("Поисковый запрос") }),
      z.array(z.union([
        z.string(),
        z.object({ query: z.string() })
      ])).describe("Массив с запросом")
    ])
  }
);