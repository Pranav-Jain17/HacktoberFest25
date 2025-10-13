import axios from "axios";

/**
 * Extracts text from resume file.
 * Replace this stub with robust PDF/DOCX parser in production.
 */
export async function extractText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject("File reading failed");
    reader.readAsText(file);
  });
}

/**
 * Calls Gemini AI API to enhance resume content for ATS optimization.
 */
export async function enhanceResumeWithGemini(resumeFile) {
  const resumeText = await extractText(resumeFile);

  const prompt = `
  Please enhance this resume for maximum ATS score. Add an ATS score section and improve keywords, formatting, and clarity. Output the full improved resume text with score details.

  Resume content:
  ${resumeText}
  `;

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(endpoint, {
      contents: [{ 
        parts: [{ text: prompt }] 
      }],
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw error;
  }
}