import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatToUser } from "../controllers/chat-controllers.js";

//protected API-only the authenticated and authorized users can do the chat further
const chatRoutes = Router();
chatRoutes.post("/new",validate(chatCompletionValidator),verifyToken,generateChatCompletion);
chatRoutes.get("/all-chats",verifyToken,sendChatToUser);
chatRoutes.delete("/delete",verifyToken,deleteChats);

export default chatRoutes;