# Social Media Content Analyzer 

A full-stack AI-powered application that analyzes social media posts in PDF or image format, extracts formatted text, and provides AI engagement improvements, hook scoring, optimized rewrites, and hashtag recommendations.

---

## 📝 Approach & Technical Architecture 

The **Social Media Content Analyzer** is built with a **Java Spring Boot 3 REST API** backend and a **React + Tailwind CSS** frontend to deliver seamless, production-quality document analysis. 

Users upload post drafts via an intuitive drag-and-drop zone supporting PDFs and images (PNG, JPG, WEBP). Upon upload, the backend identifies document types and routes them to specialized extraction engines:
- **PDF Parsing**: Uses **Apache PDFBox 3.0** with positional text stripping (`setSortByPosition(true)`) to extract text while maintaining spatial layout, line breaks, and paragraph structure.
- **Image OCR**: Integrates **Tess4J (Tesseract OCR)** with pre-configured English language traineddata for optical character recognition on image files and scanned documents.

The extracted text is passed to an **AI Engagement Engine** that evaluates hook impact (first 1-2 lines), calculates an overall engagement score (0-100), detects sentiment and mobile readability, generates actionable improvements, and offers **3 optimized post rewrites** (Viral, B2B Professional, Short & Punchy) alongside high-conversion CTAs and targeted hashtags.

The frontend features dynamic multi-stage loading states, tabbed dashboard visualization, 1-click text copying, and Markdown report exporting.

---

##  Key Features

-  **PDF Text Extraction**: Apache PDFBox parses multi-page PDFs while preserving spatial formatting.
-  **Image OCR Extraction**: Tess4J Tesseract OCR extracts text from image posts (PNG, JPG, WEBP, BMP).
-  **AI Engagement Scoring**: Evaluates line 1 scroll-stop hook power, readability, and audience sentiment.
-  **Optimized Post Rewrites**: Generates 3 style variations (Viral, B2B Professional, Punchy) with 1-click copy.
-  **Hashtag & CTA Optimizer**: Suggests platform-tailored hashtags and high-converting CTAs.
-  **Rich React Dashboard**: Metric cards, tabbed views, search filtering, and Markdown report export.
-  **Zero-Config Ready**: Operates out-of-the-box using an intelligent local engine, with support for free LLM API keys (Gemini, Groq, OpenRouter).

---

##  Technology Stack

- **Backend**: Java 17+, Spring Boot 3.2.3, Apache PDFBox 3.0.1, Tess4J 5.9.0, Maven.
- **Frontend**: React 18, Vite, Tailwind CSS v3/v4, Lucide React Icons.

---

##  Getting Started

### Prerequisites
- **Java Development Kit (JDK 17 or higher)**
- **Node.js (v18 or higher)** and `npm`

### 1. Running the Backend REST API
Navigate to the `backend` directory and execute:
```bash
cd backend
# Using Maven Wrapper (Windows)
.\mvnw.cmd spring-boot:run
```
*The Spring Boot REST API will start on `http://localhost:8080`.*

### 2. Running the Frontend Application
In a separate terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

##  REST API Documentation

### `POST /api/analyze`
Accepts multipart form uploads for PDF or Image documents.

#### Request Parameters:
- `file` (MultipartFile, required): PDF document (`.pdf`) or Image file (`.png`, `.jpg`, `.jpeg`, `.webp`).
- `platform` (String, optional): Target platform (`LinkedIn`, `Instagram`, `X/Twitter`, `TikTok`, `General`). Default: `LinkedIn`.

#### Response Example (JSON):
```json
{
  "fileName": "Post_Draft.pdf",
  "fileType": "PDF",
  "fileSize": "1.2 MB",
  "extractedText": "How we grew organic traffic by 300%...",
  "wordCount": 142,
  "characterCount": 890,
  "extractionMethod": "Apache PDFBox 3.0",
  "platform": "LinkedIn",
  "aiAnalysis": {
    "overallScore": 85,
    "readabilityGrade": "Optimal (Clear Thought Flow)",
    "sentiment": "Inspiring & Positive",
    "hookAnalysis": {
      "score": 88,
      "hookText": "How we grew organic traffic by 300%",
      "evaluation": "Strong curiosity hook with specific metrics.",
      "recommendation": "Maintain statistical triggers in opening line."
    },
    "keyStrengths": ["Compelling numerical hook", "Clean whitespace spacing"],
    "improvementAreas": ["Add explicit CTA at the end"],
    "optimizedRewrites": [...],
    "recommendedHashtags": ["#ContentStrategy", "#DigitalMarketing"],
    "callToActionSuggestions": ["Comment 'GROWTH' below for details!"],
    "bestPostingTimes": ["Tuesday & Thursday: 8:00 AM - 10:00 AM"]
  }
}
```

---

##  Repository Structure

```
Social_Media_content_analyser/
├── backend/                  # Java Spring Boot 3 REST API
│   ├── src/main/java/com/analyzer/
│   │   ├── SocialMediaAnalyzerApplication.java
│   │   ├── controller/ContentAnalysisController.java
│   │   ├── dto/AnalysisResponseDto.java
│   │   ├── service/PdfExtractionService.java
│   │   ├── service/ImageOcrService.java
│   │   └── service/AiEngagementService.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── tessdata/eng.traineddata
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/                 # React + Tailwind CSS Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   ├── AiSuggestionsTab.jsx
│   │   │   ├── PostRewritesTab.jsx
│   │   │   └── ExtractedTextViewer.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── README.md                 # Project documentation & 200-word write-up
└── .gitignore                # Submission clean rule configuration
```
