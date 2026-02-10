import { MessagesValue, StateSchema } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "langchain";
import { messagesStateReducer } from "@langchain/langgraph";

// 1. Корректно определяем состояние через аннотации
export const GraphState = Annotation.Root({
  messages: Annotation<Array<BaseMessage | AIMessage>>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});

// 2. Выводим тип состояния
export type State = typeof GraphState.State;