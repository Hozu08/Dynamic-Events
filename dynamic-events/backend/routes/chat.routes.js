import express from "express";
import { chatRateLimiter } from "../middleware/rateLimiter.js";
import { handleChat, handleTest } from "../controllers/chat.controller.js";

const router = express.Router();

// Endpoint de prueba
router.get("/test", handleTest);

// Endpoint de chat con rate limiting
router.post("/chat", chatRateLimiter, handleChat);

export default router;

