require("dotenv").config();
const { app, syncDatabase } = require("./app");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Initialize database and create tables
    await syncDatabase(false); // Set to true if you want to reset tables on each start

    // Start the server
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

app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
    }
  });

startServer();
