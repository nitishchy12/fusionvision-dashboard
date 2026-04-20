require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`FusionVision backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
