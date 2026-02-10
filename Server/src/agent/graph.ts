import { StateGraph, START, END, ConditionalEdgeRouter, Send } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "langchain";
import { tools } from "./tools";
import { State } from "./state";
import { rewrite } from "./nodes/rewrite";
import { gradeDocuments } from "./nodes/gradeDocuments";
import { generate } from "./nodes/generate";
import { generateQueryOrRespond } from "./nodes/generateQuery";
import { GraphState } from "./state";




// Create a ToolNode for the retriever
const toolNode = new ToolNode(tools);

// Helper function to determine if we should retrieve
const shouldRetrieve: ConditionalEdgeRouter<State> = (state) => {
  const lastMessage = state.messages.at(-1);
  if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
    return new Send('retrieve', {messages: state.messages})
  }
  return END;
}

// Define the graph
const builder = new StateGraph(GraphState)
  .addNode("generateQueryOrRespond", generateQueryOrRespond)
  .addNode("retrieve", toolNode)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("rewrite", rewrite)
  .addNode("generate", generate)
  // Add edges
  .addEdge(START, "generateQueryOrRespond")
  // Decide whether to retrieve
  .addConditionalEdges("generateQueryOrRespond", shouldRetrieve)
  .addEdge("retrieve", "gradeDocuments")
  .addEdge("generate", END)
  .addEdge("rewrite", "generateQueryOrRespond");

// Compile
export const graph = builder.compile();