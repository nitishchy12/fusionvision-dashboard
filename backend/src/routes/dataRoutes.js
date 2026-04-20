const express = require("express");
const multer = require("multer");
const {
  uploadData,
  getAllData,
  getDataByType,
  getSummary,
  seedDemoData,
} = require("../controllers/dataController");

const router = express.Router();

const memoryStorage = multer.memoryStorage();

const uploadInMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post("/upload", uploadInMemory.single("file"), uploadData);

router.get("/all", getAllData);
router.get("/type/:type", getDataByType);
router.get("/summary", getSummary);
router.post("/demo-seed", seedDemoData);

module.exports = router;
