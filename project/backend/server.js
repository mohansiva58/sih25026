
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
const enhancedAyushData = require('./data/enhanced_ayush.json');

const app = express();
app.use(cors());
app.use(express.json()); // Add JSON parsing middleware

// --- Helper Functions for /disease endpoint ---
function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/\s+/g, '');
}

// --- Enhanced Intelligent Search Functions ---

// Scoring algorithm for relevance ranking
function calculateRelevanceScore(searchTerm, item, filters = {}) {
  let score = 0;
  const normalizedTerm = normalize(searchTerm);
  
  // Exact keyword match (highest score)
  if (normalize(item.NAMC_TERM_ENG) === normalizedTerm) {
    score += 100;
  }
  
  // Partial matches in English term
  if (normalize(item.NAMC_TERM_ENG).includes(normalizedTerm)) {
    score += 80;
  }
  
  // Diacritical marks match
  if (item.DIACRITICAL_MARKS && normalize(item.DIACRITICAL_MARKS).includes(normalizedTerm)) {
    score += 75;
  }
  
  // Primary symptoms match
  if (item.primary_symptoms) {
    const matchingSymptoms = item.primary_symptoms.filter(symptom => 
      normalize(symptom).includes(normalizedTerm) || normalizedTerm.includes(normalize(symptom))
    );
    score += matchingSymptoms.length * 60;
  }
  
  // Associated symptoms match (medium score)
  if (item.associated_symptoms) {
    const matchingAssociated = item.associated_symptoms.filter(symptom => 
      normalize(symptom).includes(normalizedTerm) || normalizedTerm.includes(normalize(symptom))
    );
    score += matchingAssociated.length * 40;
  }
  
  // Category match
  if (item.category && normalize(item.category).includes(normalizedTerm)) {
    score += 30;
  }
  
  // Apply filters
  if (filters.age_group && item.age_groups && !item.age_groups.includes('all') && !item.age_groups.includes(filters.age_group)) {
    score *= 0.5; // Reduce score if age group doesn't match
  }
  
  if (filters.gender && item.gender !== 'all' && item.gender !== filters.gender) {
    score *= 0.7; // Reduce score if gender doesn't match
  }
  
  if (filters.duration) {
    if ((filters.duration === 'acute' && !item.duration?.acute) || 
        (filters.duration === 'chronic' && !item.duration?.chronic)) {
      score *= 0.6; // Reduce score if duration doesn't match
    }
  }
  
  return Math.round(score);
}

// Enhanced search with intelligent ranking
function intelligentAyushSearch(searchTerm, filters = {}) {
  const results = [];
  
  enhancedAyushData.forEach(item => {
    const score = calculateRelevanceScore(searchTerm, item, filters);
    if (score > 20) { // Minimum relevance threshold
      results.push({
        ...item,
        relevance_score: score,
        confidence: Math.min(score / 100, 1.0) // Convert to confidence percentage
      });
    }
  });
  
  // Sort by relevance score descending
  return results.sort((a, b) => b.relevance_score - a.relevance_score);
}

// Map AYUSH results with ICD-11 data
async function mapWithIcdData(ayushResults, icdResults) {
  const mappedResults = [];
  
  for (const ayushItem of ayushResults) {
    const mappedItem = {
      ayush_data: ayushItem,
      icd_mappings: [],
      combined_confidence: ayushItem.confidence
    };
    
    // Check for pre-defined mappings
    if (ayushItem.icd_mappings) {
      for (const mapping of ayushItem.icd_mappings) {
        const icdMatch = icdResults.find(icd => 
          (icd.theCode && icd.theCode === mapping.code) || 
          (icd.code && icd.code === mapping.code)
        );
        
        if (icdMatch) {
          mappedItem.icd_mappings.push({
            ...icdMatch,
            confidence: mapping.confidence,
            mapping_type: 'pre_defined'
          });
          // Boost combined confidence for pre-defined mappings
          mappedItem.combined_confidence = Math.min(
            mappedItem.combined_confidence + (mapping.confidence * 0.1), 
            1.0
          );
        }
      }
    }
    
    // Look for semantic matches in ICD results
    if (mappedItem.icd_mappings.length === 0) {
      const semanticMatches = findSemanticIcdMatches(ayushItem, icdResults);
      mappedItem.icd_mappings.push(...semanticMatches);
    }
    
    mappedResults.push(mappedItem);
  }
  
  return mappedResults.sort((a, b) => b.combined_confidence - a.combined_confidence);
}

// Find semantic matches between AYUSH and ICD
function findSemanticIcdMatches(ayushItem, icdResults) {
  const matches = [];
  const ayushTerms = [
    ayushItem.NAMC_TERM_ENG?.toLowerCase(),
    ...ayushItem.primary_symptoms || [],
    ayushItem.category?.toLowerCase()
  ].filter(Boolean);
  
  for (const icdItem of icdResults) {
    const icdTitle = (icdItem.title || icdItem.icdTitle || '').toLowerCase().replace(/<[^>]*>/g, '');
    
    for (const ayushTerm of ayushTerms) {
      if (icdTitle.includes(ayushTerm) || ayushTerm.includes(icdTitle.split(' ')[0])) {
        matches.push({
          ...icdItem,
          confidence: 0.7, // Moderate confidence for semantic matches
          mapping_type: 'semantic'
        });
        break;
      }
    }
  }
  
  return matches.slice(0, 3); // Limit semantic matches
}

// Generate guided questions based on search results
function generateGuidedQuestions(mappedResults, previousAnswers = {}) {
  const questions = [];
  const topResults = mappedResults.slice(0, 3);
  
  // Collect all unique questions from top results
  const questionMap = new Map();
  
  topResults.forEach(result => {
    if (result.ayush_data.clinical_questions) {
      result.ayush_data.clinical_questions.forEach(q => {
        if (!previousAnswers[q.id] && !questionMap.has(q.id)) {
          questionMap.set(q.id, {
            ...q,
            relevance_sources: [result.ayush_data.NAMC_CODE]
          });
        } else if (!previousAnswers[q.id] && questionMap.has(q.id)) {
          questionMap.get(q.id).relevance_sources.push(result.ayush_data.NAMC_CODE);
        }
      });
    }
  });
  
  // Sort questions by relevance (how many top results they appear in)
  const sortedQuestions = Array.from(questionMap.values())
    .sort((a, b) => b.relevance_sources.length - a.relevance_sources.length);
  
  return sortedQuestions.slice(0, 2); // Return max 2 questions at a time
}

// Refine search based on Q&A answers
function refineSearchWithAnswers(initialResults, answers) {
  return initialResults.map(result => {
    let adjustedConfidence = result.combined_confidence;
    let scoreAdjustment = 0;
    
    if (result.ayush_data.clinical_questions) {
      result.ayush_data.clinical_questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer && question.scoring && question.scoring[userAnswer]) {
          const scoring = question.scoring[userAnswer];
          
          // Apply scoring adjustments
          Object.keys(scoring).forEach(key => {
            const scoreValue = scoring[key];
            
            // Check if this condition matches the AYUSH item characteristics
            if (key === 'acute' && result.ayush_data.duration?.acute) {
              scoreAdjustment += scoreValue * 0.1;
            } else if (key === 'chronic' && result.ayush_data.duration?.chronic) {
              scoreAdjustment += scoreValue * 0.1;
            } else if (result.ayush_data.dosha_involvement?.includes(key)) {
              scoreAdjustment += scoreValue * 0.15;
            } else if (result.ayush_data.humor_involvement?.includes(key)) {
              scoreAdjustment += scoreValue * 0.15;
            }
            // Add more scoring logic as needed
          });
        }
      });
    }
    
    return {
      ...result,
      combined_confidence: Math.min(Math.max(adjustedConfidence + scoreAdjustment, 0), 1.0),
      score_adjustment: scoreAdjustment
    };
  }).sort((a, b) => b.combined_confidence - a.combined_confidence);
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

// --- ENHANCED INTELLIGENT SEARCH API ENDPOINTS ---

// Enhanced intelligent search endpoint
app.get("/api/intelligent-search", async (req, res) => {
  try {
    const { 
      term, 
      age_group, 
      gender, 
      duration, 
      include_icd = 'true',
      previous_answers 
    } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: "Search term is required" });
    }
    
    const filters = {
      age_group: age_group || null,
      gender: gender || null,
      duration: duration || null
    };
    
    // Parse previous answers if provided
    const answers = previous_answers ? JSON.parse(previous_answers) : {};
    
    // Step 1: Intelligent AYUSH search
    let ayushResults = intelligentAyushSearch(term, filters);
    
    // Step 2: Get ICD-11 results if requested
    let icdResults = [];
    if (include_icd === 'true') {
      try {
        const token = await getIcdToken();
        const icdResponse = await axios.get(
          `https://id.who.int/icd/release/11/2024-01/mms/search?q=${encodeURIComponent(term)}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "Accept-Language": "en"
            }
          }
        );
        
        icdResults = Array.isArray(icdResponse.data) 
          ? icdResponse.data 
          : (icdResponse.data.destinationEntities || []);
      } catch (icdError) {
        console.log("ICD search failed, continuing with AYUSH only:", icdError.message);
      }
    }
    
    // Step 3: Map AYUSH with ICD results
    let mappedResults = await mapWithIcdData(ayushResults, icdResults);
    
    // Step 4: Refine results based on previous answers
    if (Object.keys(answers).length > 0) {
      mappedResults = refineSearchWithAnswers(mappedResults, answers);
    }
    
    // Step 5: Generate next guided questions
    const guidedQuestions = generateGuidedQuestions(mappedResults, answers);
    
    // Step 6: Prepare response
    const response = {
      search_term: term,
      filters_applied: filters,
      total_results: mappedResults.length,
      top_match: mappedResults[0] || null,
      other_matches: mappedResults.slice(1, 6), // Top 5 other matches
      guided_questions: guidedQuestions,
      has_high_confidence_match: mappedResults.length > 0 && mappedResults[0].combined_confidence > 0.8,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
    
  } catch (error) {
    console.error("Intelligent search error:", error);
    res.status(500).json({ error: "Search failed", details: error.message });
  }
});

// Guided Q&A endpoint
app.post("/api/guided-questions", async (req, res) => {
  try {
    const { search_term, answers } = req.body;
    
    if (!search_term || !answers) {
      return res.status(400).json({ error: "Search term and answers are required" });
    }
    
    // Re-run intelligent search with answers
    const ayushResults = intelligentAyushSearch(search_term);
    const refinedResults = refineSearchWithAnswers(
      ayushResults.map(item => ({ ayush_data: item, combined_confidence: item.confidence })), 
      answers
    );
    
    // Generate next questions
    const nextQuestions = generateGuidedQuestions(refinedResults, answers);
    
    res.json({
      refined_results: refinedResults.slice(0, 3),
      next_questions: nextQuestions,
      answers_processed: Object.keys(answers).length,
      confidence_improved: refinedResults.length > 0 && refinedResults[0].combined_confidence > 0.85
    });
    
  } catch (error) {
    console.error("Guided Q&A error:", error);
    res.status(500).json({ error: "Q&A processing failed", details: error.message });
  }
});

// Clinical pathway recommendations endpoint
app.get("/api/clinical-pathway/:namc_code", async (req, res) => {
  try {
    const { namc_code } = req.params;
    
    const ayushItem = enhancedAyushData.find(item => item.NAMC_CODE === namc_code);
    
    if (!ayushItem) {
      return res.status(404).json({ error: "AYUSH condition not found" });
    }
    
    const clinicalPathway = {
      condition: {
        namc_code: ayushItem.NAMC_CODE,
        name: ayushItem.NAMC_TERM_ENG,
        system: ayushItem.system,
        category: ayushItem.category
      },
      icd_mappings: ayushItem.icd_mappings || [],
      treatment_pathway: ayushItem.treatment_pathway || {},
      dual_coding_recommendations: {
        primary_icd: ayushItem.icd_mappings?.[0]?.code || null,
        primary_ayush: ayushItem.NAMC_CODE,
        interoperability_notes: [
          "Use both codes for comprehensive medical records",
          "ICD-11 for international classification",
          "AYUSH code for traditional treatment protocols"
        ]
      },
      clinical_guidelines: {
        diagnostic_criteria: ayushItem.primary_symptoms || [],
        differential_diagnosis: ayushItem.associated_symptoms || [],
        severity_indicators: ayushItem.severity || "mild_to_moderate",
        duration_guidelines: ayushItem.duration || {}
      },
      integrated_care_plan: {
        modern_medicine: "Consult with allopathic physician for severe cases",
        traditional_medicine: ayushItem.treatment_pathway,
        lifestyle_medicine: ayushItem.treatment_pathway?.lifestyle_recommendations || [],
        follow_up: "Monitor symptoms for 7-14 days, reassess if no improvement"
      }
    };
    
    res.json(clinicalPathway);
    
  } catch (error) {
    console.error("Clinical pathway error:", error);
    res.status(500).json({ error: "Failed to generate clinical pathway", details: error.message });
  }
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
