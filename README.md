# AI Resume Enhancer
Intelligent ATS‑Optimized Resume Enhancer built using React and Google Gemini API

## 🚀 Overview
Gemini AI Resume Enhancer is an open‑source web application that allows users to upload their resumes and instantly receive ATS‑optimized versions with AI‑driven improvements.
The app extracts, enhances, and regenerates resumes while preserving original formatting and structure.

## ✨ Features
- Upload PDF, DOCX, or TXT resume files
- AI‑enhanced improvements powered by Google Gemini API
- Provides interactive ATS (Applicant Tracking System) analysis and optimization suggestions
- Instant resume preview and one‑click download in the same format
- Clean UI built with React and TailwindCSS
- Secure file processing — no sensitive data stored

## 🧠 How It Works
1. User uploads a resume file
2. The app extracts text from the document (PDF/DOCX/TXT)
3. The content is sent securely to the Google Gemini API
4. The AI analyzes, scores, and enhances the resume for ATS performance
5. The enhanced resume can be previewed or downloaded in the same format

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS
- **AI Integration:** Google Gemini 2.5 Flash Model
- **PDF & DOCX Parsing:** pdfjs‑dist, mammoth.js
- **File Handling:** Blob + Base64 from client-side
- **Bundler:** Vite

## 📖 Usage

### Basic Workflow

The AI Resume Enhancer follows a simple three-step process to optimize your resume:

#### **1. Upload Your Resume**
- Click the upload button on the homepage
- Select your resume file (PDF, DOCX, or TXT format)
- Maximum file size: 10MB
- Supported formats maintain original structure during enhancement

#### **2. AI Analysis & Enhancement**
- The application extracts text content from your document
- Google Gemini AI analyzes your resume for ATS compatibility
- Receives optimization suggestions including:
  - Keyword optimization for job descriptions
  - Formatting improvements for ATS parsing
  - Skills highlighting and quantification of achievements
  - Action verb recommendations
  - Overall ATS score (0-100)

#### **3. Download Enhanced Resume**
- Preview the enhanced version in real-time
- Download in the same format as uploaded
- Compare original vs. enhanced versions side-by-side

### Common Use Cases

**Optimizing for a Specific Job Posting:**
Upload your current resume

Review AI suggestions focused on ATS keywords

Download the optimized version

Use for job applications requiring high ATS compatibility

text

**Quick Resume Health Check:**
Upload resume → Get instant ATS score

Review identified weaknesses

Implement suggested improvements

Re-upload to track score improvement

text

**Format Preservation:**
The app maintains your original formatting
PDF input → Enhanced PDF output
DOCX input → Enhanced DOCX output
TXT input → Enhanced TXT output

text

### Tips for Best Results

- Ensure your resume has clear section headers (Experience, Education, Skills)
- Include quantifiable achievements where possible
- Use standard fonts and formatting for optimal text extraction
- Keep file size under 10MB for faster processing
- Review AI suggestions before finalizing your resume

## 🔌 API Documentation

The application uses a client-side architecture with direct integration to Google Gemini API. Below are the key API interactions:

### Architecture Overview

User Browser → React App → Google Gemini API
↓
File Upload → Text Extraction → AI Processing → Enhanced Output text

### Core API Endpoints

#### **1. Google Gemini Content Generation**

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

**Method:** `POST`

**Purpose:** Analyzes and enhances resume content using AI

**Headers:**
{
"Content-Type": "application/json",
"x-goog-api-key": "YOUR_GEMINI_API_KEY"
}

text

**Request Body:**
{
"contents": [
{
"parts": [
{
"text": "Analyze this resume for ATS optimization and provide improvement suggestions:\n\n[RESUME_TEXT_CONTENT]"
}
]
}
],
"generationConfig": {
"temperature": 0.7,
"topK": 40,
"topP": 0.95,
"maxOutputTokens": 2048
}
}

text

**Example Request:**
const analyzeResume = async (resumeText, apiKey) => {
const response = await fetch(
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey},
{
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
contents: [{
parts: [{
text: Analyze and enhance this resume for ATS optimization:\n\n${resumeText}
}]
}],
generationConfig: {
temperature: 0.7,
maxOutputTokens: 2048
}
})
}
);

return await response.json();
};

text

**Response Structure:**
{
"candidates": [
{
"content": {
"parts": [
{
"text": "ATS Score: 75/100\n\nStrengths:\n- Clear section organization\n- Quantified achievements present\n\nImprovements Needed:\n1. Add more industry-specific keywords\n2. Use stronger action verbs\n3. Quantify more accomplishments\n\nEnhanced Resume:\n[AI-generated improved content]"
}
]
},
"finishReason": "STOP",
"safetyRatings": [...]
}
],
"usageMetadata": {
"promptTokenCount": 450,
"candidatesTokenCount": 820,
"totalTokenCount": 1270
}
}

text

**Error Responses:**
{
"error": {
"code": 400,
"message": "API key not valid",
"status": "INVALID_ARGUMENT"
}
}

text

---

#### **2. File Upload & Text Extraction**

**Client-Side Processing:** File handling is performed entirely in the browser using JavaScript APIs.

**Supported Operations:**

**PDF Text Extraction:**
import * as pdfjsLib from 'pdfjs-dist';

const extractPDFText = async (file) => {
const arrayBuffer = await file.arrayBuffer();
const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
let fullText = '';

for (let i = 1; i <= pdf.numPages; i++) {
const page = await pdf.getPage(i);
const textContent = await page.getTextContent();
const pageText = textContent.items.map(item => item.str).join(' ');
fullText += pageText + '\n';
}

return fullText;
};

text

**DOCX Text Extraction:**
import mammoth from 'mammoth';

const extractDOCXText = async (file) => {
const arrayBuffer = await file.arrayBuffer();
const result = await mammoth.extractRawText({ arrayBuffer });
return result.value;
};

text

**TXT File Handling:**
const extractTXTText = async (file) => {
return await file.text();
};

text

**Input Parameters:**
- `file`: File object from HTML input element
- Accepted types: `.pdf`, `.docx`, `.txt`
- Max size: 10MB (10,485,760 bytes)

**Output:**
- Returns extracted text as string
- Preserves line breaks and basic structure
- Removes images and complex formatting

---

#### **3. File Download & Generation**

**PDF Generation:**
import { jsPDF } from 'jspdf';

const generatePDF = (enhancedText, filename) => {
const doc = new jsPDF();
const splitText = doc.splitTextToSize(enhancedText, 180);
doc.text(splitText, 10, 10);
doc.save(filename || 'enhanced-resume.pdf');
};

text

**DOCX Generation:**
import { Document, Packer, Paragraph } from 'docx';

const generateDOCX = async (enhancedText, filename) => {
const doc = new Document({
sections: [{
properties: {},
children: enhancedText.split('\n').map(line =>
new Paragraph({ text: line })
)
}]
});

const blob = await Packer.toBlob(doc);
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename || 'enhanced-resume.docx';
a.click();
};

text

---

### API Configuration

#### Environment Variables

Create a `.env` file in the project root:

VITE_GEMINI_API_KEY=your_gemini_api_key_here

text

#### Obtaining API Keys

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env` file as `VITE_GEMINI_API_KEY`

**Security Best Practices:**
- Never commit `.env` file to version control
- Add `.env` to `.gitignore`
- For production, use environment variables through deployment platform
- Rotate API keys regularly
- Monitor API usage quotas

---

### Rate Limits & Quotas

**Google Gemini API (Free Tier):**
- 60 requests per minute
- 1,500 requests per day
- 32,000 tokens per request

**Handling Rate Limits:**
const handleRateLimit = async (apiCall, retries = 3) => {
try {
return await apiCall();
} catch (error) {
if (error.status === 429 && retries > 0) {
await new Promise(resolve => setTimeout(resolve, 2000));
return handleRateLimit(apiCall, retries - 1);
}
throw error;
}
};

text

---

### Example: Complete Resume Enhancement Flow

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const ResumeEnhancer = () => {
const [file, setFile] = useState(null);
const [enhancedText, setEnhancedText] = useState('');
const [loading, setLoading] = useState(false);
const [atsScore, setAtsScore] = useState(null);

// Step 1: Handle file upload
const handleFileUpload = (e) => {
const uploadedFile = e.target.files;
if (uploadedFile && uploadedFile.size <= 10485760) {
setFile(uploadedFile);
} else {
alert('File size must be less than 10MB');
}
};

// Step 2: Extract text from file
const extractText = async () => {
if (!file) return '';

text
const fileType = file.name.split('.').pop().toLowerCase();

if (fileType === 'pdf') {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

// Handle DOCX and TXT similarly...
return await file.text();
};

// Step 3: Send to Gemini API for enhancement
const enhanceResume = async () => {
setLoading(true);

text
try {
  const resumeText = await extractText();
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this resume for ATS optimization. Provide an ATS score (0-100) and enhanced version:\n\n${resumeText}`
          }]
        }]
      })
    }
  );

  const data = await response.json();
  const aiResponse = data.candidates.content.parts.text;
  
  // Extract ATS score from response
  const scoreMatch = aiResponse.match(/ATS Score: (\d+)/);
  if (scoreMatch) {
    setAtsScore(parseInt(scoreMatch));[11]
  }
  
  setEnhancedText(aiResponse);
} catch (error) {
  console.error('Enhancement failed:', error);
  alert('Failed to enhance resume. Please try again.');
} finally {
  setLoading(false);
}
};

// Step 4: Download enhanced resume
const downloadResume = () => {
const blob = new Blob([enhancedText], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'enhanced-resume.txt';
a.click();
URL.revokeObjectURL(url);
};

return (
<div className="resume-enhancer">
<input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />

text
  <button 
    onClick={enhanceResume} 
    disabled={!file || loading}
  >
    {loading ? 'Enhancing...' : 'Enhance Resume'}
  </button>

  {atsScore && (
    <div className="ats-score">
      ATS Score: {atsScore}/100
    </div>
  )}

  {enhancedText && (
    <>
      <div className="preview">
        <pre>{enhancedText}</pre>
      </div>
      <button onClick={downloadResume}>
        Download Enhanced Resume
      </button>
    </>
  )}
</div>
);
};

export default ResumeEnhancer;

text

---

## 🧪 API Testing with Sample Data

### Test Resume Sample

John Doe
Software Engineer

EXPERIENCE
ABC Company | Software Developer | 2020-2023

Worked on various projects

Helped improve code quality

Participated in team meetings

SKILLS
JavaScript, React, Python

text

### Expected Enhanced Output

ATS Score: 65/100

Improvements:

Quantify achievements with metrics

Use stronger action verbs

Add technical keywords

Enhanced Version:

John Doe
Senior Software Engineer | Full-Stack Developer

PROFESSIONAL EXPERIENCE
ABC Company | Software Developer | January 2020 - March 2023

Architected and deployed 15+ scalable web applications using React.js and Node.js, reducing load time by 40%

Spearheaded code review initiatives, improving code quality metrics by 35% and reducing bug count by 50%

Led cross-functional team of 5 developers in agile ceremonies, delivering projects 20% ahead of schedule

TECHNICAL SKILLS
Frontend: JavaScript (ES6+), React.js, Redux, TypeScript
Backend: Python, Node.js, Express.js
Tools: Git, Docker, Jenkins, AWS

text

### Testing Steps

**1. Test File Upload:**
Upload a test resume file
Verify file size validation (max 10MB)
Verify file type validation (.pdf, .docx, .txt)
text

**2. Test API Response:**
Check browser console for API request/response
Verify ATS score extraction
Confirm enhanced text generation
text

**3. Test Download Functionality:**
Download enhanced resume
Verify file format matches original
Check content preservation
text

### Unit Test Example

import { describe, it, expect, vi } from 'vitest';
import { analyzeResume } from './resumeService';

describe('Resume Enhancement API', () => {
it('should successfully analyze resume text', async () => {
const mockResponse = {
candidates: [{
content: {
parts: [{ text: 'ATS Score: 80/100\n\nEnhanced resume content...' }]
}
}]
};

text
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponse)
  })
);

const result = await analyzeResume('Sample resume text');
expect(result.candidates.content.parts.text).toContain('ATS Score');
});

it('should handle API errors gracefully', async () => {
global.fetch = vi.fn(() =>
Promise.reject(new Error('API Error'))
);

text
await expect(analyzeResume('Sample text')).rejects.toThrow('API Error');
});
});

text

---

## 📝 Additional API Notes

### API Response Time
- **Average:** 3-5 seconds for standard resume (1-2 pages)
- **Complex resumes (3+ pages):** 8-12 seconds
- Network dependent

### Error Handling

const errorMessages = {
400: 'Invalid API key or request format',
401: 'API key authentication failed',
403: 'API access forbidden',
429: 'Rate limit exceeded - please wait',
500: 'Gemini API server error'
};

const handleAPIError = (error) => {
const message = errorMessages[error.status] || 'Unknown error occurred';
console.error(API Error: ${message}, error);
return message;
};

text

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn package manager
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation Steps

1. Clone the repository
git clone https://github.com/<your-username>/gemini-resume-enhancer.git

2. Navigate to project directory
cd gemini-resume-enhancer

3. Install dependencies
npm install

4. Create environment file
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env

5. Add .env to .gitignore (if not already present)
echo ".env" >> .gitignore

text

## 💻 Running Locally

Start development server
npm run dev

text

The app will run at: `http://localhost:5173`

## 🌐 Deployment

You can deploy the project on:
- **Vercel**
- **Netlify**
- **Render**

**Important:** Configure your environment variables (`VITE_GEMINI_API_KEY`) through the deployment platform settings, not in code.

### Deployment Steps (Vercel Example)

1. Install Vercel CLI
npm i -g vercel

2. Deploy
vercel

3. Add environment variable
vercel env add VITE_GEMINI_API_KEY

text

## 🧑‍💻 Contributing

Contributions are welcome! If you find a bug or have ideas for new features, open an issue or submit a pull request.

### Steps:

1. Fork this repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make your changes and commit (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature/new-feature`)
5. Open a Pull Request on GitHub

### Contribution Guidelines

- Ensure all API examples are tested and functional
- Update documentation if adding new features
- Follow existing code style and conventions
- Add unit tests for new functionality
- Update README with any new API endpoints or usage patterns

## 🛡️ License

This project is licensed under the MIT License.

## 📬 Contact

Developed and maintained by Frontend Team [BRL]

For questions or support, please open an issue on GitHub.

---

## 📚 Resources

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
