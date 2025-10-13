import axios from "axios";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Use local worker file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
    });

    const pdf = await loadingTask.promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      text += pageText + "\n";
    }

    return text.trim();
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function parseDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

async function parseTXT(file) {
  try {
    const text = await file.text();
    return text.trim();
  } catch (error) {
    console.error("TXT parsing error:", error);
    throw new Error(`TXT parsing failed: ${error.message}`);
  }
}

/**
 * Extracts text and format from resume file (PDF, DOCX, DOC, TXT)
 */
export async function extractText(file) {
  const name = file.name.toLowerCase();
  const type = file.type;

  console.log("File info:", { name, type, size: file.size });

  try {
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      const text = await parsePDF(file);
      return { text, format: "pdf" };
    }

    if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword" ||
      name.endsWith(".docx") ||
      name.endsWith(".doc")
    ) {
      const text = await parseDOCX(file);
      return { text, format: "docx" };
    }

    if (type === "text/plain" || name.endsWith(".txt")) {
      const text = await parseTXT(file);
      return { text, format: "txt" };
    }

    // Fallback: treat as text
    const text = await parseTXT(file);
    return { text, format: "txt" };
  } catch (e) {
    console.error("File parse error:", e);
    throw e;
  }
}

/**
 * Calls Gemini AI API to enhance resume content for ATS optimization.
 * The prompt asks AI to return enhanced resume in the same format as original.
 */
export async function enhanceResumeWithGemini(resumeText, format, uploaderName = "Anonymous") {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Could not extract text from file. Please ensure the file contains readable text.");
  }

  console.log("Extracted text length:", resumeText.length);

  const prompt = `
Please enhance this resume for maximum ATS score. Return the full enhanced resume content in the same file format (${format.toUpperCase()}) and layout with formatting preserved.

Include the following metadata lines at the very beginning of your response exactly as shown (replace placeholders):

Uploader Name: ${uploaderName}
Original ATS Score: [score out of 100]
Optimized ATS Score: [score out of 100]

After that, output the full improved resume text with score details.

Resume content:
${resumeText}
`;

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      throw new Error("No response from Gemini AI");
    }

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "AI enhancement failed");
  }
}
