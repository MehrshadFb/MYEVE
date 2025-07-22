require("dotenv").config();
const { app, syncDatabase } = require("./app");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // ✅ Sync DB first
    await syncDatabase(false); // Set to true if you want to reset tables on each start

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};


startServer();
