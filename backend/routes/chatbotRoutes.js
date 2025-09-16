const express = require("express");
const router = express.Router();
const {
  getResponse,
  getHistory,
  getConversationById
} = require("../controllers/chatbotController");

// ✅ Import protect middleware from authController
const { protect } = require("../controllers/authController");

// POST /api/chatbot → send/continue conversation
router.post("/", protect, getResponse);

// GET /api/chatbot/history → fetch all past conversations
router.get("/history", protect, getHistory);

// GET /api/chatbot/:id → fetch one conversation by ID
router.get("/:id", protect, getConversationById);

module.exports = router;
