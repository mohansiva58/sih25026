import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const API = 'http://localhost:5000';

  const intelligentSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    
    try {
      const response = await axios.get(`${API}/api/intelligent-search?term=${searchTerm}&include_icd=true`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({ error: 'Search failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          🔬 Intelligent Medical Terminology Assistant
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          AI-powered ICD-11 + AYUSH integrated search with guided diagnostic assistance
        </p>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          🎯 Intelligent Search
        </h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter symptom or condition (e.g., cough, fever, breathing difficulty)"
            style={{
              flex: 1,
              padding: '14px 16px',
              border: '2px solid #10B981',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
            onKeyPress={(e) => e.key === 'Enter' && intelligentSearch()}
          />
          <button
            onClick={() => intelligentSearch()}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#10B981',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '120px'
            }}
          >
            {loading ? '🔍 Analyzing...' : '🔬 Search'}
          </button>
        </div>
      </div>

      {searchResults && !searchResults.error && searchResults.top_match && (
        <div style={{ backgroundColor: 'white', border: '2px solid #10B981', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>✅</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>
              Top Match
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                AYUSH ({searchResults.top_match.ayush_data.system})
              </h4>
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                {searchResults.top_match.ayush_data.NAMC_TERM_ENG}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {searchResults.top_match.ayush_data.DIACRITICAL_MARKS}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Code: {searchResults.top_match.ayush_data.NAMC_CODE}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                ICD-11 Mapping
              </h4>
              {searchResults.top_match.icd_mappings && searchResults.top_match.icd_mappings.length > 0 ? (
                searchResults.top_match.icd_mappings.slice(0, 2).map((icd, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                      {(icd.title && icd.title.replace(/<[^>]*>/g, '')) || icd.icdTitle || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Code: {icd.theCode || icd.code || 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                  No direct ICD-11 mapping available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {searchResults && searchResults.error && (
        <div style={{ backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
          <span style={{ color: '#d32f2f' }}>❌ {searchResults.error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>🎯 Intelligent Ranking</h3>
          <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
            Advanced AI scoring algorithm ranks conditions by relevance, considering exact matches, symptoms, and clinical context.
          </p>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>🤔 Guided Q&A</h3>
          <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
            Dynamic decision-tree questions help narrow down diagnoses when multiple high-confidence matches exist.
          </p>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>📋 Clinical Pathways</h3>
          <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
            Integrated treatment recommendations combining traditional AYUSH protocols with modern clinical guidelines.
          </p>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>🔗 Dual Coding</h3>
          <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
            Complete interoperability with both ICD-11 international standards and AYUSH traditional medicine codes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;