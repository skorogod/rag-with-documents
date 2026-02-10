import { AIMessage } from '@langchain/core/messages';
import { GraphNode } from "@langchain/langgraph";
import { modelWithTools } from "../model";
import { State } from "../state";

export const generateQueryOrRespond: GraphNode<State> = async (state) => {
  console.log("STATE MESSAGES", state.messages)
  const response = await modelWithTools.invoke(state.messages);
  console.log("RESP F", response)
  
  return {
    messages: [new AIMessage(response)],
  };
}