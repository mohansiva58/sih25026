
// backend/server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const ayurdata = require('./data/ayurveda.json');
const siddhadata = require('./data/siddha.json');
const unanidata = require('./data/unani.json');

const app = express();
app.use(cors());

// --- Helper Functions for /disease endpoint ---
function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/\s+/g, '');
}

/**
 * Searches an array of objects for items matching a given term.
 * @param {string} term The disease term to search for.
 * @param {Array<Object>} data The dataset to search within.
 * @returns {Array<string>} An array of matching NAMC_CODE values.
 */
function searchInData(term, data) {
  const normalizedTerm = normalize(term);
  return data
    .filter(item => {
      // Check multiple fields for matches
      const termToSearch = item.NAMC_term || item.NAMC_TERM || item['Name English'] || '';
      const termDiacritical = item.NAMC_term_diacritical || '';
      const termDevanagari = item.NAMC_term_DEVANAGARI || '';
      const englishName = item['Name English'] || '';
      
      return normalize(termToSearch).includes(normalizedTerm) ||
             normalize(termDiacritical).includes(normalizedTerm) ||
             normalize(englishName).includes(normalizedTerm) ||
             termToSearch.toLowerCase().includes(term.toLowerCase()) ||
             englishName.toLowerCase().includes(term.toLowerCase());
    })
    .map(item => ({
      code: item.NAMC_CODE,
      term: item.NAMC_term || item.NAMC_TERM,
      english: item['Name English'],
      diacritical: item.NAMC_term_diacritical,
      devanagari: item.NAMC_term_DEVANAGARI
    }));
}

// --- API Route for /disease ---
app.get('/disease', (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: "The 'term' query parameter is required" });
  }

  const ayurCodes = searchInData(term, ayurdata);
  const siddhaCodes = searchInData(term, siddhadata);
  const unaniCodes = searchInData(term, unanidata);

  res.json({
    ayurveda: ayurCodes,
    siddha: siddhaCodes,
    unani: unaniCodes
  });
});

// NAMASTE terminology service compatible endpoint
app.get('/terminology/search', (req, res) => {
  const { query, includeIcd } = req.query;
  if (!query) {
    return res.status(400).json({ error: "The 'query' parameter is required" });
  }

  const ayurResults = searchInData(query, ayurdata);
  const siddhaResults = searchInData(query, siddhadata);
  const unaniResults = searchInData(query, unanidata);

  const results = [
    ...ayurResults.map(r => ({
      system: 'Ayurveda',
      code: r.code,
      term: r.term,
      english: r.english,
      display: r.english || r.term,
      source: 'http://namaste.gov.in/CodeSystem'
    })),
    ...siddhaResults.map(r => ({
      system: 'Siddha', 
      code: r.code,
      term: r.term,
      english: r.english,
      display: r.english || r.term,
      source: 'http://namaste.gov.in/CodeSystem'
    })),
    ...unaniResults.map(r => ({
      system: 'Unani',
      code: r.code, 
      term: r.term,
      english: r.english,
      display: r.english || r.term,
      source: 'http://namaste.gov.in/CodeSystem'
    }))
  ];

  res.json({
    query,
    includeIcd: includeIcd === 'true',
    results,
    total: results.length
  });
});

// Check for required environment variables
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  console.error("FATAL ERROR: CLIENT_ID and CLIENT_SECRET must be provided in .env file.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const WHO_BASE = "https://id.who.int/icd/release/11/2024-01/mms";
const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
const MANUAL_TOKEN = process.env.MANUAL_TOKEN || ""; // optional
const SANDBOX = process.env.SANDBOX === "1" || false;

// Simple in-memory cache (url -> { data, expiry })
const cache = new Map();
function setCache(key, value, ttl = 5 * 60 * 1000) { // default 5 minutes
  cache.set(key, { data: value, expiry: Date.now() + ttl });
}
function getCache(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expiry) { cache.delete(key); return null; }
  return e.data;
}

// Token management: either manual or request using client credentials
let cachedToken = null;
let tokenExpiry = 0;

async function fetchToken() {
  if (MANUAL_TOKEN) return MANUAL_TOKEN.replace(/^Bearer\s*/i, "").trim();
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("No MANUAL_TOKEN or CLIENT_ID+CLIENT_SECRET provided in .env");
  }

  const url = "https://icdaccessmanagement.who.int/connect/token";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("scope", "icdapi_access");

  try {
    const res = await axios.post(url, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    cachedToken = res.data.access_token;
    tokenExpiry = Date.now() + (res.data.expires_in || 3600) * 1000 - 20000; // small safety margin
    return cachedToken;
  } catch (err) {
    console.error("Error fetching token:", err.response?.data || err.message);
    throw new Error("Failed to fetch authentication token from WHO API.");
  }
}

// Safe fetch wrapper to call WHO endpoints (uses token)
async function safeFetch(url) {
  // use cache first
  const c = getCache(url);
  if (c) return c;

  try {
    const token = await fetchToken();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "API-Version": "v2",
        Accept: "application/json",
        "Accept-Language": "en",
      },
      timeout: 15000,
    });
    setCache(url, res.data, 5 * 60 * 1000);
    return res.data;
  } catch (err) {
    console.error("safeFetch error for", url, err.response?.status, err.response?.data || err.message);
    return { error: err.message, status: err.response?.status, apiData: err.response?.data };
  }
}

// Helper: fetch title for a WHO node URL (safe)
async function getNodeTitle(url) {
  const d = await safeFetch(url);
  const title = d?.title?.["@value"] || null;
  return title || url;
}

/* ===== ROUTES ===== */

// 1) Top-level chapters: return [{id, title}]
app.get("/icd", async (req, res) => {
  if (SANDBOX) {
    // return a small mock for demos (so you can still show UI offline)
    const mock = await fs.readFile(path.join(__dirname, "ayush.json"), "utf8").catch(()=>null);
    if (mock) {
      return res.json({ title: "ICD (SANDBOX MOCK)", releaseDate: null, children: [] });
    }
  }

  const data = await safeFetch(WHO_BASE);
  if (!data || data.error) return res.status(500).json({ error: "Failed to fetch ICD release", details: data });

  const children = Array.isArray(data.child) ? data.child : [];
  // optionally resolve title of each child (this will do N calls but N ~ 30 chapters => ok)
  const list = await Promise.all(children.map(async (url) => {
    const t = await getNodeTitle(url);
    return { id: url, title: t };
  }));

  res.json({ title: data.title?.["@value"] || "ICD Release", releaseDate: data.releaseDate || null, children: list });
});

// 2) Node details: id is the WHO URL (encodeURIComponent when calling)
app.get("/icd/node", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id parameter" });

  // If sandbox and id refers to mock, you can return mock data here if desired
  const data = await safeFetch(id);
  if (!data || data.error) return res.status(500).json({ error: "Failed to fetch ICD node", details: data });

  // For each child, return { id, title } to make it easy for frontend
  const children = Array.isArray(data.child) ? await Promise.all(data.child.map(async (c) => {
    const t = await getNodeTitle(c);
    return { id: c, title: t };
  })) : [];

  res.json({
    id,
    code: data.code || null,
    title: data.title?.["@value"] || null,
    definition: data.definition?.["@value"] || null,
    synonyms: data.synonym || null,
    children
  });
});

// 3) Search WHO ICD (uses WHO search endpoint)
// Search diseases
// backend/server.js (replace /icd/search)
app.get("/icd/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query param" });

    // Fetch ICD results
    const url = "https://id.who.int/icd/release/11/2024-01/mms/search";
    const token = await fetchToken();
    const icdRes = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "API-Version": "v2",
        Accept: "application/json",
        "Accept-Language": "en",
      },
      params: { q, useFlexisearch: true, includeKeyword: true, flatResults: true },
    });

    const icdHits = icdRes.data?.destinationEntities || [];

    // Fetch AYUSH matches from local ayush.json
    const filePath = path.join(__dirname, "ayush.json");
    const raw = await fs.readFile(filePath, "utf8").catch(() => null);
    const ayushList = raw ? JSON.parse(raw) : [];

    // Merge results
    const merged = icdHits.map(hit => {
      const ayush = ayushList.find(
        a => a.icdTitle.toLowerCase() === hit.title.toLowerCase()
      );
      return {
        id: hit.id,
        title: hit.title,
        code: hit.theCode,
        definition: hit.definition,
        ayush: ayush ? ayush.ayushCodes : [],
      };
    });

    res.json(merged);
  } catch (err) {
    console.error("Search error:", err.message);
    res.json([]);
  }
});



// 4) AYUSH local search (mock) - searches ayush.json for keywords
app.get("/ayush/search", async (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.status(400).json({ error: "Missing query 'q' parameter" });

  // read local ayush.json
  const filePath = path.join(__dirname, "ayush.json");
  const raw = await fs.readFile(filePath, "utf8").catch(()=>null);
  if (!raw) return res.json([]);

  const list = JSON.parse(raw);
  const results = list.filter(item =>
    (item.icdTitle || "").toLowerCase().includes(q) ||
    (item.icdKeywords || []).some(k => k.toLowerCase().includes(q))
  ).map(it => ({ icdTitle: it.icdTitle, ayushCodes: it.ayushCodes }));
  res.json(results);
});

// 5) Simple endpoint: return full mock (for sandbox demos)
app.get("/icd/mock", async (req, res) => {
  const filePath = path.join(__dirname, "ayush.json");
  const raw = await fs.readFile(filePath, "utf8").catch(()=>null);
  if (!raw) return res.json({ error: "No mock file" });
  res.json(JSON.parse(raw));
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT} (SANDBOX=${SANDBOX})`));
