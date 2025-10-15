import axios from "axios";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

// Set PDF.js worker
// Import worker using Vite's ?url syntax
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker using the imported URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// ==================== FILE PARSING ====================

async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let pageText = "";
      
      textContent.items.forEach((item) => {
        // Add line break if Y position changed significantly
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += "\n";
        }
        pageText += item.str + " ";
        lastY = item.transform[5];
      });
      
      text += pageText.trim() + "\n\n";
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
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
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
 * Extract text from file and return both text and format
 */
export async function extractText(file) {
  const name = file.name.toLowerCase();
  const type = file.type;
  
  let text = "";
  let format = "";
  
  try {
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      text = await parsePDF(file);
      format = "pdf";
    } else if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword" ||
      name.endsWith(".docx") ||
      name.endsWith(".doc")
    ) {
      text = await parseDOCX(file);
      format = "docx";
    } else if (type === "text/plain" || name.endsWith(".txt")) {
      text = await parseTXT(file);
      format = "txt";
    } else {
      text = await parseTXT(file);
      format = "txt";
    }
    
    return { text, format };
  } catch (e) {
    console.error("File parse error:", e);
    throw e;
  }
}

// ==================== FILE GENERATION ====================

/**
 * Generate PDF from enhanced text
 */
function generatePDF(enhancedText, uploaderName) {
  const doc = new jsPDF();
  
  // Parse the enhanced text to extract sections
  const lines = enhancedText.split('\n');
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  
  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(uploaderName || "Resume", margin, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) {
      y += 5;
      return;
    }
    
    // Check if line is a heading (all caps or contains ATS/SCORE)
    const isHeading = line === line.toUpperCase() || 
                      line.includes('ATS') || 
                      line.includes('SCORE') ||
                      line.endsWith(':');
    
    if (isHeading) {
      y += 5;
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
    } else {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
    }
    
    // Split long lines
    const splitText = doc.splitTextToSize(line, maxWidth);
    splitText.forEach(textLine => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(textLine, margin, y);
      y += isHeading ? 8 : 6;
    });
  });
  
  return doc.output('arraybuffer');
}

/**
 * Generate DOCX from enhanced text
 */
async function generateDOCX(enhancedText, uploaderName) {
  const lines = enhancedText.split('\n');
  const children = [];
  
  // Add title
  children.push(
    new Paragraph({
      text: uploaderName || "Enhanced Resume",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) {
      children.push(new Paragraph({ text: "" }));
      return;
    }
    
    const isHeading = line === line.toUpperCase() || 
                      line.includes('ATS') || 
                      line.includes('SCORE') ||
                      line.endsWith(':');
    
    if (isHeading) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 24
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );
    } else {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22
            })
          ],
          spacing: { after: 100 }
        })
      );
    }
  });
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });
  
  return await Packer.toBuffer(doc);
}

/**
 * Generate TXT from enhanced text
 */
function generateTXT(enhancedText) {
  return new TextEncoder().encode(enhancedText);
}

// ==================== GEMINI AI ENHANCEMENT ====================

/**
 * Enhance resume with Gemini AI and return base64 of the enhanced file
 */
export async function enhanceResumeWithGemini(resumeText, format, uploaderName) {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text is empty");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze and enhance the following resume to maximize ATS compatibility and improve its professional impact.

INSTRUCTIONS:
1. Provide an ATS Score (0-100) at the top
2. Enhance keywords relevant to the candidate's field
3. Improve formatting for ATS readability
4. Strengthen action verbs and quantifiable achievements
5. Maintain the original structure but improve clarity
6. Keep the same sections (Experience, Education, Skills, etc.)

OUTPUT FORMAT:
Start with "ATS SCORE: [score]/100" followed by a brief explanation.
Then provide the complete enhanced resume text with all original sections improved.

ORIGINAL RESUME:
${resumeText}

ENHANCED RESUME:`;

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(endpoint, {
      contents: [{ parts: [{ text: prompt }] }],
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const enhancedText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!enhancedText) {
      throw new Error("No response from Gemini AI");
    }
    
    // Generate file in original format
    let fileBuffer;
    
    switch (format) {
      case "pdf":
        fileBuffer = generatePDF(enhancedText, uploaderName);
        break;
      case "docx":
        fileBuffer = await generateDOCX(enhancedText, uploaderName);
        break;
      case "txt":
        fileBuffer = generateTXT(enhancedText);
        break;
      default:
        fileBuffer = generateTXT(enhancedText);
    }
    
    // Convert to base64
    const base64 = btoa(
      new Uint8Array(fileBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    return {
      enhancedText,
      base64,
      format
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "AI enhancement failed");
  }
}