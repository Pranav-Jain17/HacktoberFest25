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

Folder Structure

src/
├── components/
│   ├── EnhancementViewer.jsx
│   ├── DownloadButton.jsx
│   └── ...
├── hooks/
│   └── gemini.js
├── utils/
│   └── resumeTemplate.js
├── App.jsx
├── main.jsx
.env
.gitignore
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

