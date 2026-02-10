import { type ChatMessage } from './../../interfaces/index';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatState } from "../../interfaces";
import { clearChat, loadChatHistory } from './chatThunks';


const initialState: ChatState = {
    messages: [],
    isLoading: false,
    error: null
}


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        },
        clearChat: (state) => {
            state.messages = [],
            state.error = null
        }
    },
    extraReducers(builder) {
        builder.addCase(loadChatHistory.fulfilled, (state, action) => {
            state.messages = action.payload;
        })
        builder.addCase(clearChat.fulfilled, (state, action) => {
            state.messages = []
        })
    },
})

export const {addMessage, setLoading, setError } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;