import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { Request, Response } from "express";

export const chatRouter = Router();


chatRouter.post("/message", (req: Request, res: Response) => chatController.sendMessage(req, res));

chatRouter.get("/history", (req, res) => chatController.getChatHistory(req, res));

chatRouter.delete("/clear", (req, res) => chatController.clearChat(req, res));