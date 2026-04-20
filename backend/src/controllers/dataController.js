const path = require("path");
const fs = require("fs");
const { IntelEntry, INTEL_TYPES } = require("../models/IntelEntry");
const {
  normalizeEntry,
  parseJsonBuffer,
  parseCsvBuffer,
  parseExcelBuffer,
} = require("../utils/parsers");

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const isValidCoordinates = (lat, lng) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

const validateEntry = (entry) => {
  if (!isValidCoordinates(entry.lat, entry.lng)) {
    return "Invalid or missing latitude/longitude.";
  }
  if (!entry.description) {
    return "Description is required.";
  }
  if (!INTEL_TYPES.includes(entry.type)) {
    return "Invalid intelligence type.";
  }
  if (Number.isNaN(new Date(entry.timestamp).valueOf())) {
    return "Invalid timestamp.";
  }
  return null;
};

const uploadData = async (req, res) => {
  try {
    const { body } = req;
    const hasManualPayload = body && (body.lat || body.lng || body.description);
    const uploadedFile = req.file;

    if (!hasManualPayload && !uploadedFile) {
      return res.status(400).json({ message: "No input provided for upload." });
    }

    if (uploadedFile) {
      const fileName = uploadedFile.originalname.toLowerCase();
      const ext = path.extname(fileName);
      const mimeType = uploadedFile.mimetype;

      if (mimeType.startsWith("image/")) {
        const safeOriginalName = uploadedFile.originalname.replace(/\s+/g, "_");
        const savedFileName = `${Date.now()}-${safeOriginalName}`;
        const savedPath = path.join(uploadDir, savedFileName);
        fs.writeFileSync(savedPath, uploadedFile.buffer);

        const imageEntry = normalizeEntry(
          {
            type: "IMINT",
            lat: body.lat,
            lng: body.lng,
            description:
              body.description || `Image intelligence from ${uploadedFile.originalname}`,
            locationName: body.locationName || body.location,
            imageUrl: `/uploads/${savedFileName}`,
            timestamp: body.timestamp,
          },
          "IMINT",
        );

        const validationError = validateEntry(imageEntry);
        if (validationError) {
          return res.status(400).json({
            message: "Validation failed for image upload.",
            errors: [{ index: 0, error: validationError }],
          });
        }

        const insertedImage = await IntelEntry.create(imageEntry);
        return res.status(201).json({
          message: "Data uploaded successfully.",
          count: 1,
          records: [insertedImage],
        });
      }

      let entries = [];
      if (ext === ".json" || mimeType === "application/json") {
        entries = parseJsonBuffer(uploadedFile.buffer).map((item) =>
          normalizeEntry(item, "OSINT"),
        );
      } else if (ext === ".csv" || mimeType.includes("csv")) {
        entries = parseCsvBuffer(uploadedFile.buffer).map((item) =>
          normalizeEntry(item, "OSINT"),
        );
      } else if ([".xlsx", ".xls"].includes(ext)) {
        entries = parseExcelBuffer(uploadedFile.buffer).map((item) =>
          normalizeEntry(item, "OSINT"),
        );
      } else {
        return res.status(400).json({
          message: "Unsupported file type. Use JSON, CSV, Excel, JPG, or JPEG.",
        });
      }

      const validationErrors = entries
        .map((entry, index) => ({ index, error: validateEntry(entry) }))
        .filter((result) => result.error);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: "Validation failed for one or more records.",
          errors: validationErrors,
        });
      }

      const inserted = await IntelEntry.insertMany(entries, { ordered: true });
      return res.status(201).json({
        message: "Data uploaded successfully.",
        count: inserted.length,
        records: inserted,
      });
    }

    if (hasManualPayload) {
      const manualType = body.type ? body.type.toUpperCase() : "HUMINT";
      const manualEntry = normalizeEntry(
        {
          ...body,
          type: manualType,
        },
        "HUMINT",
      );
      const validationError = validateEntry(manualEntry);
      if (validationError) {
        return res.status(400).json({
          message: "Validation failed for manual entry.",
          errors: [{ index: 0, error: validationError }],
        });
      }

      const insertedManual = await IntelEntry.create(manualEntry);
      return res.status(201).json({
        message: "Data uploaded successfully.",
        count: 1,
        records: [insertedManual],
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed.",
      error: error.message,
    });
  }
};

const getAllData = async (_req, res) => {
  try {
    const data = await IntelEntry.find().sort({ timestamp: -1 });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch data." });
  }
};

const getDataByType = async (req, res) => {
  try {
    const type = String(req.params.type || "").toUpperCase();
    if (!INTEL_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid type filter." });
    }

    const data = await IntelEntry.find({ type }).sort({ timestamp: -1 });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch filtered data." });
  }
};

const getSummary = async (_req, res) => {
  try {
    const [summary, latestEntries] = await Promise.all([
      IntelEntry.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
      IntelEntry.find().sort({ timestamp: -1 }).limit(5),
    ]);

    const counts = { OSINT: 0, HUMINT: 0, IMINT: 0 };
    let total = 0;
    summary.forEach((item) => {
      counts[item._id] = item.count;
      total += item.count;
    });

    return res.json({
      total,
      byType: counts,
      latestEntries,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch summary." });
  }
};

const seedDemoData = async (_req, res) => {
  try {
    const now = Date.now();
    const demoEntries = [
      {
        type: "OSINT",
        lat: 28.5672,
        lng: 77.2101,
        locationName: "Sector 18",
        description: "Social signal spike around transport corridor.",
        timestamp: new Date(now - 1000 * 60 * 40),
      },
      {
        type: "HUMINT",
        lat: 28.5355,
        lng: 77.391,
        locationName: "Noida Checkpoint",
        description: "Field source reports unusual night movement.",
        timestamp: new Date(now - 1000 * 60 * 25),
      },
      {
        type: "IMINT",
        lat: 28.4595,
        lng: 77.0266,
        locationName: "Gurugram Perimeter",
        description: "Imagery indicates stationary heavy vehicle cluster.",
        timestamp: new Date(now - 1000 * 60 * 10),
      },
    ];

    const inserted = await IntelEntry.insertMany(demoEntries);
    return res.status(201).json({
      message: "Demo data inserted successfully.",
      count: inserted.length,
      records: inserted,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to seed demo data.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadData,
  getAllData,
  getDataByType,
  getSummary,
  seedDemoData,
};
