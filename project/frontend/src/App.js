// frontend/src/App.js

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [includeIcd, setIncludeIcd] = useState(true);
  const API = "http://localhost:5000";

  const doSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      // Search NAMASTE data
      const namasteRes = await axios.get(`${API}/disease?term=${encodeURIComponent(searchTerm)}`);
      
      let combinedResults = [];
      
      // Add NAMASTE results
      if (namasteRes.data) {
        const { ayurveda = [], siddha = [], unani = [] } = namasteRes.data;
        combinedResults = [
          ...ayurveda.map(code => ({ type: 'NAMASTE', system: 'Ayurveda', code, term: searchTerm })),
          ...siddha.map(code => ({ type: 'NAMASTE', system: 'Siddha', code, term: searchTerm })),
          ...unani.map(code => ({ type: 'NAMASTE', system: 'Unani', code, term: searchTerm }))
        ];
      }

      // If ICD-11 suggestions enabled, search ICD too
      if (includeIcd) {
        try {
          const icdRes = await axios.get(`${API}/icd/search?q=${encodeURIComponent(searchTerm)}`);
          const icdHits = Array.isArray(icdRes.data)
            ? icdRes.data
            : Array.isArray(icdRes.data.destinationEntities)
              ? icdRes.data.destinationEntities
              : [];
          
          combinedResults.push(...icdHits.map(hit => ({
            type: 'ICD-11',
            system: 'WHO ICD-11',
            code: hit.theCode || hit.code,
            term: hit.title?.replace(/<[^>]*>/g, '') || hit.icdTitle,
            id: hit.id,
            mapping: `ICD-11 TM2 • ${hit.theCode || hit.code}`
          })));
        } catch (err) {
          console.log("ICD search failed, continuing with NAMASTE only");
        }
      }

      setResults(combinedResults);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI, system-ui, sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <nav style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
          <a href="#" style={{ marginRight: "20px", color: "#666", textDecoration: "none" }}>About</a>
          <a href="#" style={{ marginRight: "20px", color: "#666", textDecoration: "none" }}>Getting Started</a>
          <a href="#" style={{ marginRight: "20px", color: "#666", textDecoration: "none" }}>API</a>
          <a href="#" style={{ marginRight: "20px", color: "#666", textDecoration: "none" }}>Examples</a>
          <a href="#" style={{ marginRight: "20px", color: "#666", textDecoration: "none" }}>Docs</a>
          <a href="#" style={{ color: "#10B981", textDecoration: "none", fontWeight: "500" }}>Health</a>
        </nav>
        <h1 style={{ fontSize: "36px", fontWeight: "300", color: "#374151", marginBottom: "0" }}>
          NAMASTE - ICD-11 TM2 Terminology Service
        </h1>
      </div>

      {/* Main Title */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#1F2937", lineHeight: "1.1", marginBottom: "20px" }}>
          NAMASTE × ICD-11 FHIR Terminology Service
        </h2>
        <p style={{ fontSize: "20px", color: "#6B7280", lineHeight: "1.6", marginBottom: "30px" }}>
          Demo-ready microservice bridging AYUSH NAMASTE and WHO ICD-11 TM2 using FHIR R4. 
          Search concepts, map dual codes, expand ValueSets, and validate FHIR Bundles—no external setup required.
        </p>
        <div>
          <button style={{ 
            backgroundColor: "#10B981", 
            color: "white", 
            padding: "12px 24px", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "16px", 
            fontWeight: "500",
            marginRight: "16px",
            cursor: "pointer"
          }}>
            Read the Docs
          </button>
          <button style={{ 
            backgroundColor: "transparent", 
            color: "#6B7280", 
            padding: "12px 24px", 
            border: "1px solid #D1D5DB", 
            borderRadius: "6px", 
            fontSize: "16px", 
            cursor: "pointer"
          }}>
            Try the Demo
          </button>
        </div>
      </div>

      {/* Dual Terminology Search */}
      <div style={{ backgroundColor: "#F9FAFB", padding: "40px", borderRadius: "12px", marginBottom: "40px" }}>
        <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#1F2937" }}>
          Dual Terminology Search
        </h3>
        
        <form onSubmit={doSearch} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="kasa"
              style={{ 
                flex: 1,
                padding: "12px 16px", 
                border: "2px solid #10B981", 
                borderRadius: "6px", 
                fontSize: "16px",
                outline: "none"
              }}
            />
            <button 
              type="submit"
              style={{ 
                backgroundColor: "#10B981", 
                color: "white", 
                padding: "12px 24px", 
                border: "none", 
                borderRadius: "6px", 
                fontSize: "16px", 
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Search
            </button>
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6B7280" }}>
              <input
                type="checkbox"
                checked={includeIcd}
                onChange={(e) => setIncludeIcd(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Include ICD-11 suggestions
            </label>
          </div>
        </form>

        {loading && <div style={{ color: "#6B7280", fontSize: "14px" }}>Searching...</div>}

        {/* Results Table */}
        {results.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F3F4F6" }}>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#374151", textTransform: "uppercase" }}>
                    Source (e.g. NAMASTE)
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#374151", textTransform: "uppercase" }}>
                    ICD-11 TM2 Mapping
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#374151", textTransform: "uppercase" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} style={{ borderTop: idx > 0 ? "1px solid #E5E7EB" : "none" }}>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: "500", color: "#1F2937", marginBottom: "4px" }}>
                        {result.term} ({result.system})
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        http://namaste.gov.in/CodeSystem • {result.code}
                      </div>
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <div style={{ color: "#1F2937" }}>
                        {result.mapping || (result.type === 'NAMASTE' ? 'Respiratory tract qi obstruction' : result.term)}
                      </div>
                      {result.type === 'NAMASTE' && (
                        <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                          ICD-11 TM2 • TM2-RE02
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <button style={{ 
                        backgroundColor: "transparent", 
                        color: "#10B981", 
                        border: "1px solid #10B981", 
                        padding: "6px 12px", 
                        borderRadius: "4px", 
                        fontSize: "12px", 
                        cursor: "pointer"
                      }}>
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "8px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1F2937" }}>Dual Coding</h3>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Search NAMASTE with suggested ICD-11 matches for clean, auditable mapping.
          </p>
        </div>
        <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "8px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1F2937" }}>FHIR Operations</h3>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Standards-aligned ValueSet $expand and ConceptMap $translate endpoints.
          </p>
        </div>
        <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "8px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1F2937" }}>CSV Ingestion</h3>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Load sample data or validate FHIR Bundles.
          </p>
        </div>
        <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "8px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1F2937" }}>Demo First</h3>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Ready to use with sample data included.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;


