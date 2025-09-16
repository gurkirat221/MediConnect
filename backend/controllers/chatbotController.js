// Get single conversation by ID
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

