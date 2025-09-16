const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Load env variables
dotenv.config();

// Import routes
const homeRoutes = require("./routes/homeRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use("/api", homeRoutes);

const authRoutes = require("./routes/authRoutes");

// Routes
app.use("/api/auth", authRoutes);

const chatbotRoutes = require("./routes/chatbotRoutes");

app.use("/api/chatbot", chatbotRoutes);


app.get("/", (req, res) => {
  res.send("MediConnect API is running 🚑");
});

// MongoDB Connection + Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT || 8080, () => {
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 8080}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB Connection Failed", err.message);
});
