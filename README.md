# NAMASTE - ICD-11 TM2 Terminology Service

An intelligent medical terminology service bridging AYUSH NAMASTE and WHO ICD-11 TM2 using FHIR R4 standards.

## 🚀 Features

- **Dual Terminology Search**: Search both AYUSH NAMASTE and WHO ICD-11 databases simultaneously
- **Intelligent Ranking**: Advanced scoring algorithm to rank the most relevant conditions
- **Professional UI**: Clean, modern interface matching professional medical terminology services
- **FHIR R4 Compliant**: Standards-aligned endpoints for interoperability
- **Real-time Search**: Fast, responsive search with live results
- **Cross-system Mapping**: Map between ICD-11 and AYUSH terminology systems

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │   WHO ICD-11 API │
│   (Port 3000)   │◄──►│   (Port 5000)   │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  AYUSH NAMASTE  │
                       │   JSON Data     │
                       └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Axios, Modern ES6+
- **Backend**: Node.js, Express.js, CORS
- **APIs**: WHO ICD-11 Sandbox API, AYUSH NAMASTE Dataset
- **Standards**: FHIR R4, JSON, REST APIs

## 📦 Installation

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohansiva58/sih25026.git
   cd sih25026
   ```

2. **Backend Setup**
   ```bash
   cd project/backend
   npm install
   
   # Configure environment variables
   # .env file is included for demo purposes
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Running the Application

### Start Backend Server
```bash
cd project/backend
node server.js
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd project/frontend
npm start
```
Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### AYUSH NAMASTE Search
```
GET /disease?term={searchTerm}
```
Search across Ayurveda, Siddha, and Unani databases.

### ICD-11 Search
```
GET /icd/search?q={query}
```
Search WHO ICD-11 database with authentication.

### Combined Search
Frontend automatically combines results from both APIs for comprehensive medical terminology search.

## 💾 Data Structure

### AYUSH Data Format
```json
{
  "NAMC_CODE": "AY001",
  "NAMC_TERM": "कास",
  "NAMC_TERM_ENG": "Cough",
  "DIACRITICAL_MARKS": "Kāsa"
}
```

### ICD-11 Response Format
```json
{
  "destinationEntities": [
    {
      "theCode": "MD12",
      "title": "Cough",
      "id": "http://id.who.int/icd/...",
      "matchingPV": "Cough"
    }
  ]
}
```

## 🎯 Usage Examples

1. **Search for "cough"**
   - Returns AYUSH: Kāsa from Ayurveda/Siddha/Unani
   - Returns ICD-11: Multiple cough-related conditions
   - Displays mapped results side-by-side

2. **Filter Options**
   - Include/exclude ICD-11 suggestions
   - System-specific searches (Ayurveda only, etc.)

## 🏥 Medical Systems Covered

- **Ayurveda**: Traditional Indian medicine system
- **Siddha**: South Indian traditional medicine
- **Unani**: Greco-Arabic traditional medicine
- **ICD-11**: WHO International Classification of Diseases

## 🔮 Future Enhancements

- **Intelligent Ranking**: AI-powered relevance scoring
- **Guided Q&A Flow**: Decision-tree style diagnostic questions
- **Clinical Pathways**: Integrated treatment recommendations
- **Advanced Filters**: Age, gender, duration-specific searches
- **MongoDB Integration**: Scalable data storage
- **FHIR Bundle Validation**: Complete FHIR R4 compliance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of Smart India Hackathon 2025 submission.

## 👥 Team

SIH25026 Team - Building the future of medical terminology services.

## 🙏 Acknowledgments

- WHO ICD-11 API for international disease classification
- AYUSH NAMASTE dataset for traditional medicine terminology
- FHIR R4 standards for healthcare interoperability

---
**Built with ❤️ for Smart India Hackathon 2025**