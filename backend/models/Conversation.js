const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "bot"], required: true },
        message: { type: String, required: true },
        disease: { type: String }, // optional, in case bot asks q about a disease
        confirmedSymptoms: [String],
        deniedSymptoms: [String]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
