import { Router } from "express";
import { documentController } from "../controllers/document.controller";

export const documentRouter = Router();


documentRouter.get('/', (req, res) => documentController.getList(req, res))

// Маршруты
documentRouter.post('/upload', 
  documentController.uploadMiddleware(),
  (req, res) => documentController.uploadDocument(req, res)
);

documentRouter.post('/upload-multiple',
  documentController.uploadMultipleMiddleware(),
  (req, res) => documentController.uploadMultipleDocuments(req, res)
);


documentRouter.post("/getSimilar", (req, res) => documentController.getSimilar(req, res))