const Papa = require("papaparse");
const XLSX = require("xlsx");

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const normalizeType = (value, fallback = "OSINT") => {
  const normalized = String(value || fallback).toUpperCase();
  if (["OSINT", "HUMINT", "IMINT"].includes(normalized)) return normalized;
  return fallback;
};

const normalizeEntry = (rawEntry, fallbackType = "OSINT") => {
  const lat = parseNumber(rawEntry.lat ?? rawEntry.latitude);
  const lng = parseNumber(rawEntry.lng ?? rawEntry.lon ?? rawEntry.longitude);

  return {
    type: normalizeType(rawEntry.type, fallbackType),
    lat,
    lng,
    description: String(rawEntry.description || rawEntry.summary || "").trim(),
    locationName: String(
      rawEntry.locationName || rawEntry.location || rawEntry.place || "",
    ).trim(),
    imageUrl: String(rawEntry.imageUrl || rawEntry.image || "").trim(),
    timestamp: rawEntry.timestamp ? new Date(rawEntry.timestamp) : new Date(),
  };
};

const parseJsonBuffer = (buffer) => {
  const raw = JSON.parse(buffer.toString("utf8"));
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.entries)) return raw.entries;
  return [raw];
};

const parseCsvBuffer = (buffer) => {
  const csvText = buffer.toString("utf8");
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`);
  }

  return result.data;
};

const parseExcelBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
};

module.exports = {
  normalizeEntry,
  parseJsonBuffer,
  parseCsvBuffer,
  parseExcelBuffer,
};
