const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  symptoms: { type: [String], required: true },

  keyQuestions: { type: [String] }, // follow-up clarifying questions

  precautions: { type: [String], required: true },

  cure: { type: String, required: true }, // descriptive cure text

  severity: {
    level: { type: String, enum: ["low", "medium", "high"], default: "low" },
    description_en: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Disease", diseaseSchema);
