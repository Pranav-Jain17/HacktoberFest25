import axios from "axios";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Use local worker file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// PDF parsing function
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

// DOCX parsing function
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

// TXT parsing function
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
 * Extracts text from resume file (PDF, DOCX, DOC, TXT)
 */
export async function extractText(file) {
  const name = file.name.toLowerCase();
  const type = file.type;
  
  console.log("File info:", { name, type, size: file.size });
  
  try {
    // Handle PDF
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      console.log("Parsing as PDF...");
      return await parsePDF(file);
    }
    
    // Handle DOCX and DOC
    if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword" ||
      name.endsWith(".docx") ||
      name.endsWith(".doc")
    ) {
      console.log("Parsing as DOCX/DOC...");
      return await parseDOCX(file);
    }
    
    // Handle TXT
    if (type === "text/plain" || name.endsWith(".txt")) {
      console.log("Parsing as TXT...");
      return await parseTXT(file);
    }
    
    // Fallback: try to read as text
    console.log("Unknown format, attempting text read...");
    return await parseTXT(file);
    
  } catch (e) {
    console.error("File parse error:", e);
    throw e;
  }
}

/**
 * Calls Gemini AI API to enhance resume content for ATS optimization.
 */
export async function enhanceResumeWithGemini(resumeFile) {
  const resumeText = await extractText(resumeFile);
  
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Could not extract text from file. Please ensure the file contains readable text.");
  }

  console.log("Extracted text length:", resumeText.length);

  const prompt = `
Please enhance this resume for maximum ATS score. Add an ATS score section and improve keywords, formatting, and clarity. Output the full improved resume text with score details.

Resume content:
${resumeText}
`;

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

    const result = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      throw new Error("No response from Gemini AI");
    }
    
    return result;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "AI enhancement failed");
  }
}