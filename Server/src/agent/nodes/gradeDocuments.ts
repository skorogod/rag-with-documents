import { config } from 'dotenv';
import * as z from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphNode, Command } from "@langchain/langgraph";
import { State } from "../state";
import { chatModel } from "../model";

const prompt = ChatPromptTemplate.fromTemplate(
  `Вы — оценивающий, определяющий релевантность полученных документов вопросу пользователя.
  Вот полученные документы:
  \n ------- \n
  {context}
  \n ------- \n
  Вот вопрос пользователя: {question}
  Если содержание документов релевантно вопросу пользователя, оцените их как релевантные.
  Дайте бинарную оценку 'да' или 'нет', чтобы указать, релевантны ли документы вопросу.
  Да: Документы релевантны вопросу.
  Нет: Документы не релевантны вопросу.`,
);

const gradeDocumentsSchema = z.object({
  binaryScore: z.string().describe("Relevance score 'да' or 'нет'"),  
})

export const gradeDocuments: GraphNode<State> = async (state, config) => {
    const model = chatModel.withStructuredOutput(gradeDocumentsSchema)
    
    const score = await prompt.pipe(model).invoke({
        question: state.messages.at(0)?.content,
        context: state.messages.at(-1)?.content,
    });

    console.log("SCORE", score)

    if (score.binaryScore.toLowerCase() === "да") {
        // Используем Command для указания следующего узла
        return new Command({
            goto: "generate" // имя следующего узла
        });
    }
    
    return new Command({
        goto: "rewrite"
    });
}