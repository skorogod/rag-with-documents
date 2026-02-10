import { GraphState } from './../state';

import { graph } from "../graph";
import { AIMessage, HumanMessage } from "langchain";


type Key = "generateQueryOrRespond" | "generate" 

export class AssistantService {
    public static async processMessage(message: string, sessionId: string) {
        const inputs = {
            messages: [
                new HumanMessage(message)
            ]
        };
        let response = ''
        for await (const output of await graph.stream(inputs)) {
            for (const [key, value] of Object.entries(output)) {
                const k = key as Key
                const messages = output[k]?.messages
                if (messages) {
                    const lastMsg = messages[messages.length - 1]
                    if (lastMsg) {
                        console.log(`Output from node: '${key}'`);
                        console.log({
                            type: lastMsg._getType(),
                            content: lastMsg.content,
                            tool_calls: lastMsg.type === 'ai' ? (lastMsg as AIMessage).tool_calls : null,
                        });
                    }
                    console.log("---\n");
                    response = lastMsg.content.toString()
                    // if (k === 'generate') {
                    //     return {
                    //         response: lastMsg.content.toString(),
                    //         tool_calls: [],
                    //         conversation_id: "1"
                    //     };
                    // }
                }
            }
        }
        return {
            response: response,
            tool_calls: [],
            conversation_id: "1"
        };
    }
}