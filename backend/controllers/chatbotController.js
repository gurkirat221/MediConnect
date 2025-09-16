// Get single conversation by ID
// controllers/chatbotController.js
const Conversation = require("../models/Conversation");
const chatbotService = require("../services/chatbotService");

// =========================
// POST /api/chatbot → get response from AI
// =========================
exports.getResponse = async (req, res) => {
  try {
    const { message, conversation = [], location } = req.body;
    const userId = req.user.id;

    // Call chatbot service
    const response = await chatbotService.getAIResponse(message, conversation, location);

    // Save/update conversation in DB
    let convo = await Conversation.findOne({ user: userId });
    if (!convo) {
      convo = new Conversation({
        user: userId,
        messages: [{ role: "user", message }]
      });
    }

    convo.messages.push({ role: "user", message });
    if (response.result !== "error") {
      convo.messages.push({ role: "bot", message: response.reply || response.question || "" });
    }

    await convo.save();

    res.json({ success: true, response });
  } catch (err) {
    console.error("❌ Chatbot Response Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// GET /api/chatbot/history → all user conversations
// =========================
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Conversation.find({ user: userId }).lean();

    res.json({ success: true, history });
  } catch (err) {
    console.error("❌ Fetch History Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// GET /api/chatbot/:id → single conversation by ID
// =========================
exports.getConversationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({
      _id: id,
      user: userId
    }).lean();

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    res.json({ success: true, conversation });
  } catch (err) {
    console.error("❌ Fetch Conversation Error:", err);
    res.status(500).json({ error: err.message });
  }
};
