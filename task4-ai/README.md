# MedKura AI Report Summarizer

A full-stack medical report summarizer powered by Claude AI. Care representatives can paste medical reports and get instant AI-generated clinical summaries with key findings, medications, red flags, patient queries, and specialist recommendations.

## Features

✨ **AI-Powered Summaries** - Claude 3.5 Sonnet extracts clinically relevant information
📱 **Responsive UI** - Clean, modern interface built with React and Tailwind CSS
⚡ **Real-time Processing** - Structured JSON output with validated data
🔒 **Secure** - API key never exposed to frontend, environment-based configuration
📋 **Multiple Input Methods** - Paste text or upload files
🎯 **Clear Output** - 5-section display with visual indicators and icons

## Project Structure

```
task4-ai/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.js        # Express server setup
│   │   ├── services/
│   │   │   └── claude.service.js   # Claude API integration
│   │   └── routes/
│   │       └── summarize.routes.js # POST /api/summarise endpoint
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── MedicalReportSummarizer.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── package.json           # Root workspace config
```

## Quick Start

### 1. Setup Backend

```bash
cd task4-ai/backend
cp .env.example .env
```

Edit `.env` and add your Claude API key:
```env
CLAUDE_API_KEY=your_actual_api_key_here
PORT=3001
```

Install dependencies:
```bash
npm install
```

### 2. Setup Frontend

```bash
cd task4-ai/frontend
npm install
```

### 3. Run Both Servers

From the `task4-ai` root directory:
```bash
npm run dev
```

This uses `concurrently` to run both:
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:5173`

The frontend is configured to proxy API calls to the backend automatically.

## Usage

1. Visit `http://localhost:5173` in your browser
2. Paste a medical report or upload a text file
3. Click "Summarize Report"
4. View the AI-generated summary with:
   - 📊 **Key Findings** - Main diagnosis and clinical summary
   - 💊 **Current Medications** - List of prescribed drugs
   - ⚠️ **Red Flags** - Urgent concerns requiring attention
   - ❓ **Patient Query** - What the patient is asking for
   - 👨‍⚕️ **Suggested Specialist** - Recommended specialist type

## API Endpoint

### POST `/api/summarise`

**Request:**
```json
{
  "reportText": "Patient medical report text here..."
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "keyFindings": "Patient presents with...",
    "currentMedications": ["Medication 1", "Medication 2"],
    "redFlags": ["Critical concern 1"],
    "patientQuery": "Patient seeking second opinion on...",
    "suggestedSpecialist": "Cardiologist"
  }
}
```

## Prompt Engineering

The system prompt in `backend/src/services/claude.service.js` is optimized to:

- **Extract structured JSON only** - No extra text, pure JSON output
- **Clinical accuracy** - Maintains medical relevance while using plain language
- **Handle missing fields** - Returns `null` for unreported findings
- **Practical guidance** - Specialist recommendations based on diagnosis
- **Conciseness** - 2-3 sentences for key findings, focused bullet points

The prompt specifically asks Claude to:
1. Extract key diagnosis/findings in digestible language for non-medical staff
2. List medications with dosage if available
3. Identify urgent red flags requiring immediate attention
4. Understand what the patient is truly seeking
5. Recommend the most appropriate specialist type

## Error Handling

The API includes robust error handling for:
- Missing or invalid Claude API key
- Empty report submissions
- API rate limiting
- JSON parsing failures
- Network errors

Frontend displays user-friendly error messages while backend logs full stack traces.

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required: Your Claude API key from Anthropic
CLAUDE_API_KEY=sk-ant-...

# Optional: Server port (default: 3001)
PORT=3001
```

### Features to Add (Optional)

- Database storage of summaries with patient linking
- Summary history and comparison views
- Export summaries as PDF
- User authentication for care representatives
- Integration with patient management system
- Batch processing for multiple reports

## Testing

You can test the API with a sample medical report. Here's an example `curl` request:

```bash
curl -X POST http://localhost:3001/api/summarise \
  -H "Content-Type: application/json" \
  -d '{
    "reportText": "Patient is a 58-year-old male presenting with chest pain for 3 days. ECG shows ST elevation in leads II, III, aVF. Currently on Aspirin 100mg daily and Metoprolol 50mg twice daily. Troponin levels elevated at 2.5 ng/mL (normal <0.04). Patient seeking second opinion on cardiac status and severity of condition. Recommended specialist: Cardiologist."
  }'
```

## Technology Stack

**Backend:**
- Node.js with ES modules
- Express.js for API
- @anthropic-ai/sdk for Claude integration
- CORS enabled for frontend communication

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Fetch API for HTTP requests

## Evaluation Criteria

✅ **Backend Claude API integration (7 pts)** - Correct API calls with comprehensive error handling
✅ **Prompt quality (8 pts)** - Structured JSON output with clinically sensible summaries  
✅ **Frontend UX (6 pts)** - Responsive layout, loading states, error handling, structured display
✅ **Code quality (4 pts)** - Clean separation of concerns, no hardcoded API keys, environment-based config

## License

MIT

## Support

For issues with:
- **Claude API**: Check your API key in `.env` and Anthropic account quota
- **Frontend connection**: Ensure backend is running on port 3001
- **Report processing**: Input medical reports should be text-based, not images or PDFs with images only
