export interface IAssistant {
    new(): IAssistant,
    processMessage: ({message, sessionId}: {message: string, sessionId: string}) => Promise<void>
}