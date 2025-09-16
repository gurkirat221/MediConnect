// controllers/homeController.js

exports.getHome = (req, res) => {
  res.json({
    message: "Welcome to Code4Cure API 🚀",
    status: "success",
    availableRoutes: {
      home: "/api/",
      chatbot: "/api/chat",
      conversations: "/api/conversations",
    },
  });
};
