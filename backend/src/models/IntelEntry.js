const mongoose = require("mongoose");

const INTEL_TYPES = ["OSINT", "HUMINT", "IMINT"];

const intelEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: INTEL_TYPES,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    locationName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = {
  IntelEntry: mongoose.model("IntelEntry", intelEntrySchema),
  INTEL_TYPES,
};
