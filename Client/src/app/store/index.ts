import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {chatReducer} from "../../features/chat/chatSlice"
import { documentReducer } from "../../features/document/documentSlice";


const reducer = combineReducers({
    chat: chatReducer,
    documents: documentReducer,
})

export const store = configureStore({
    reducer,
})

export type AppDispatch = typeof store.dispatch;
export  type RootState = ReturnType<typeof store.getState>

