const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(mongoUri);
  // Keep startup output concise but explicit for ops visibility.
  console.log("MongoDB connected successfully.");
};

module.exports = connectDb;
