import express from "express";
import { SERVER_PORT } from "./config";
import multer from "multer";
import { documentRouter } from "./api/routers/document.router";
import { chatRouter } from "./api/routers/chat.router";
import { AppDataSource } from "./db/datasource";

const app = express();
const port = SERVER_PORT || 3000;


// Middleware
app.use(express.json());

app.use("/api/documents", documentRouter)
app.use("/api/chat", chatRouter)

// Обработка ошибок multer
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
});


app.listen(port, async () => {
  AppDataSource.initialize()
  console.log(`Server is running on port ${port}`);
  console.log(`Upload endpoint: POST http://localhost:${port}/api/documents/upload`);
  // const res = await AssistantService.processMessage('Общие положения и корпоративные ценности', "1")
});