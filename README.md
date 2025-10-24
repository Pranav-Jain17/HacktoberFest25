AI Resume Enhancer
Intelligent ATS‑Optimized Resume Enhancer built using React and Google Gemini API

🚀 Overview
Gemini AI Resume Enhancer is an open‑source web application that allows users to upload their resumes and instantly receive ATS‑optimized versions with AI‑driven improvements.
The app extracts, enhances, and regenerates resumes while preserving original formatting and structure.

✨ Features
Upload PDF, DOCX, or TXT resume files.

AI‑enhanced improvements powered by Google Gemini API.

Provides interactive ATS (Applicant Tracking System) analysis and optimization suggestions.

Instant resume preview and one‑click download in the same format.

Clean UI built with React and TailwindCSS.

Secure file processing — no sensitive data stored.

🧠 How It Works
User uploads a resume file.

The app extracts text from the document (PDF/DOCX/TXT).

The content is sent securely to the Google Gemini API.

The AI analyzes, scores, and enhances the resume for ATS performance.

The enhanced resume can be previewed or downloaded in the same format.

🛠️ Tech Stack
Frontend: React, TailwindCSS

AI Integration: Google Gemini 2.5 Flash Model

PDF & DOCX Parsing: pdfjs‑dist, mammoth.js

File Handling: Blob + Base64 from client-side

Bundler: Vite

⚙️ Setup and Installation
Prerequisites
Node.js (v18+)

npm or yarn package manager

Installation Steps
bash
# 1. Clone the repository
git clone https://github.com/<your-username>/gemini-resume-enhancer.git

# 2. Navigate to project directory
cd gemini-resume-enhancer

# 3. Install dependencies
npm install

💻 Running Locally
bash
# Start development server
npm run dev
The app will run at:
http://localhost:5173

🌐 Deployment
You can deploy the project on:

Vercel

Netlify

Render

Make sure you configure your environment variables (VITE_GEMINI_KEY) through the deployment settings (not in code).

🚀 Usage
To use the Gemini AI Resume Enhancer, follow these steps:

1. Upload Your Resume:
   - Drag and drop your resume file (PDF, DOCX, or TXT) into the upload area.
   - Alternatively, click the "Upload a file" button to select your resume from your local machine.

2. Get AI-Powered Feedback:
   - Once uploaded, the application will automatically extract the text and send it to the Gemini AI for analysis.
   - The AI will provide an ATS (Applicant Tracking System) score, key improvements, and an enhanced version of your resume.

3. Review and Download:
   - The enhanced resume will be displayed in the preview area, showing the original and improved versions side-by-side.
   - Click the "Download" button to save the enhanced resume in the same format as the original file.

🔌 API Documentation
The core logic for file parsing, AI enhancement, and file generation is handled by the gemini.js hook. Below is a summary of the key functions and their usage.

### extractText(file)
Extracts text from a given file and returns the text content and format.

- Parameters:
  - file (File): The file object to parse (PDF, DOCX, or TXT).
- Returns:
  - Promise<Object>: A promise that resolves to an object containing:
    - text (string): The extracted text content.
    - format (string): The file format (pdf, docx, or txt).

### enhanceResumeWithGemini(resumeText, format, uploaderName)
Enhances the resume text using the Gemini AI and returns the display text, enhanced resume, and a base64-encoded file.

- Parameters:
  - resumeText (string): The text content of the resume.
  - format (string): The file format (pdf, docx, or txt).
  - uploaderName (string): The name of the user uploading the file.
- Returns:
  - Promise<Object>: A promise that resolves to an object containing:
    - displayText (string): The full response from the AI, including the ATS analysis and scores.
    - enhancedResumeOnly (string): The clean, enhanced resume text without any analysis.
    - base64 (string): The base64-encoded enhanced resume file.
    - format (string): The file format.

### Example Request
  javascript
import { enhanceResumeWithGemini } from './hooks/gemini';

const resumeText = "Your resume content here...";
const format = "pdf";
const uploaderName = "Vinay";

enhanceResumeWithGemini(resumeText, format, uploaderName)
  .then(response => {
    console.log("AI Response:", response.displayText);
    // Use the base64 data to create a downloadable link
    const link = document.createElement('a');
    link.href = data:application/pdf;base64,${response.base64};
    link.download = enhanced-resume.${format};
    link.click();
  })
  .catch(error => {
    console.error("Error enhancing resume:", error);
  });


### Example Response
json
{
  "displayText": "=== ATS ANALYSIS ===\nOriginal ATS Score: 75/100\nEnhanced ATS Score: 95/100\nKey Improvements: [...]\n\n###RESUME_START###\n[Enhanced resume content...]",
  "enhancedResumeOnly": "[Enhanced resume content...]",
  "base64": "JVBERi0xLjMKJ[...]truncated",
  "format": "pdf"
}


🧑‍💻 Contributing
Contributions are welcome!
If you find a bug or have ideas for new features, open an issue or submit a pull request.

Steps:

Fork this repository

Create a new branch (git checkout -b feature/new-feature)

Make your changes and commit (git commit -m "Added new feature")

Push to your branch (git push origin feature/new-feature)

Open a Pull Request on GitHub

🛡️ License
This project is licensed under the MIT License.

📬 Contact
Developed and maintained by Frontend Team[BRL]


