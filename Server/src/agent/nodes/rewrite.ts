import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphNode } from "@langchain/langgraph";
import { State } from "../state";
import { chatModel } from "../model";

const rewritePrompt = ChatPromptTemplate.fromTemplate(
  `Проанализируйте входные данные и попытайтесь определить скрытый смысл / семантическое намерение.

    Вот исходный вопрос:
    \n ------- \n
    {question}
    \n ------- \n

    Сформулируйте улучшенный вопрос:`,
);

export const rewrite: GraphNode<State> = async (state) => {
  const question = state.messages.at(0)?.content;

  const response = await rewritePrompt.pipe(chatModel).invoke({ question });

  console.log("RESP REWR", response)

  return {
    messages: [response],
  };
}