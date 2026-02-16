import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphNode } from "@langchain/langgraph";
import { State } from "../state";
import { chatModel, modelWithTools } from "../model";


export const generate: GraphNode<State> = async (state) => {
  const question = state.messages.at(0)?.content;
  const context = state.messages.at(-1)?.content;
  const prompt = ChatPromptTemplate.fromTemplate(
  `Вы — помощник для решения задач в формате «вопрос-ответ».
    Используйте предоставленные фрагменты контекста для ответа на вопрос.
    Если ответ неизвестен, просто скажите, что вы не знаете.
    Если в контексте нет информации для ответа на вопрос пользователя, скажи что нет информации.
    Используйте максимум три предложения и будьте кратки.
    Вопрос: {question}
    Контекст: {context}`
  );

  const ragChain = prompt.pipe(chatModel);

  const response = await ragChain.invoke({
    context,
    question,
  });

  console.log("RESPONSE", response)
  return {
    messages: [response],
  };
}