import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { retriever, vectoreStore } from "../rag/vectoreStore";
import { Document } from "@langchain/core/documents";
import { EMBEDDINGS_MODEL, TOP_K } from "../../config";

// Расширяем схему для поддержки фильтрации по дате
const RetrieveSchema = z.object({
  query: z.string().describe("Поисковый запрос"),
  year: z.number().nullable().optional().describe("Год для фильтрации (например, 2024)"),
});

export const retrieve = tool(
  async (input: z.infer<typeof RetrieveSchema>) => {
    console.log('🔧 Входные данные:', JSON.stringify(input, null, 2));
    
    try {
      // Создаем фильтр для Qdrant
      const filter: any = {
        must: [] // Qdrant использует must для AND условий
      };
      
      // Добавляем фильтр по году, если указан
      if (input.year) {
        filter.must.push({
          key: "metadata.year",
          match: {
            value: input.year
          }
        });
      }
      
      
      console.log('🔍 Применяемый фильтр:', filter.must.length > 0 ? JSON.stringify(filter) : 'без фильтра');
      
      // Вызываем ретривер с фильтром через configurable
      const documents = await vectoreStore.similaritySearchWithScore(input.query, TOP_K, filter)
      
      if (documents.length === 0) {
        // Формируем информативное сообщение об отсутствии результатов
        let dateMessage = '';
        if (input.year) {
          dateMessage = ` за ${input.year} год`;
        }
        
        return `Не найдено релевантных документов${dateMessage} по запросу "${input.query}".`;
      }
      
      console.log("EMBEDDINGS_MODEL:", EMBEDDINGS_MODEL)
      console.log("QUERY: ", input.query)
      console.log("DOCUMENTS", documents.forEach(doc => {
        console.log(`Document: ${doc[0].metadata.fileName}\nyear: ${doc[0].metadata.year}\nscore: ${doc[1]}\n\n`)
      }))

      // Фильтруем результаты на клиентской стороне для большей точности
      let filteredDocuments = documents;
      
      if (input.year) {
        filteredDocuments = filteredDocuments.filter(doc => {
          const docYear = doc[0].metadata.year;
          return docYear === input.year;
        });
      }
      
      
      if (filteredDocuments.length === 0) {
        return `Найдены документы по теме, но ни один не соответствует указанному периоду.`;
      }
      
      return filteredDocuments
        .map((doc, i) => {
          const date = doc[0].metadata.year 
            ? new Date(String(doc[0].metadata.year)).toLocaleDateString('ru-RU')
            : 'дата неизвестна';
          
          return `Документ ${i + 1} (${date}):\n${doc[0].pageContent}\n${doc[0].metadata.source ? `\nИсточник: ${doc[0].metadata.source}` : ''}`;
        })
        .join("\n\n---\n\n");
        
    } catch (error) {
      console.error("❌ Ошибка ретривера:", error);
      return `Ошибка при поиске: ${error instanceof Error ? error.message : 'неизвестная ошибка'}`;
    }
  },
  {
    name: "retrieve_company_process_info",
    description: `Поиск информации в базе знаний компании. Можно фильтровать по году.
                  Примеры использования:
                  - Для поиска за конкретный год: { "query": "правила безопасности", "year": 2024 }`,
    schema: RetrieveSchema
  }
);