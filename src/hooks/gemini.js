import axios from "axios";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

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
 * Generate PDF from enhanced resume text (no scores)
 */
function generatePDF(enhancedResumeText, uploaderName) {
  const doc = new jsPDF();
  
  const lines = enhancedResumeText.split('\n');
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  
  // Header with uploader name
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
    
    // Check if line is a heading (all caps or ends with colon)
    const isHeading = line === line.toUpperCase() || line.endsWith(':');
    
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
 * Generate DOCX from enhanced resume text (no scores)
 */
async function generateDOCX(enhancedResumeText, uploaderName) {
  const lines = enhancedResumeText.split('\n');
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
    
    const isHeading = line === line.toUpperCase() || line.endsWith(':');
    
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
 * Generate TXT from enhanced resume text (no scores)
 */
function generateTXT(enhancedResumeText) {
  return new TextEncoder().encode(enhancedResumeText);
}

// ==================== GEMINI AI ENHANCEMENT ====================

/**
 * Enhance resume with Gemini AI and return separate display and download content
 */


export async function enhanceResumeWithGemini(resumeText, format, uploaderName, language) {
  
  const languageInstructions = {
    en: "Respond in English.",
    fr: "Réponds en français.",
    es: "Responde en español.",
  };
  
  const langInstruction = languageInstructions[language] || languageInstructions.en;

  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text is empty");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze and enhance the following resume.
${langInstruction}
CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:
1. First provide ATS analysis with scores
2. Then add the marker: ###RESUME_START###
3. After the marker, provide ONLY the clean enhanced resume (no scores, no analysis, no explanations)

OUTPUT FORMAT:
=== ATS ANALYSIS ===
Original ATS Score: [X]/100
Enhanced ATS Score: [Y]/100
Key Improvements: [list what was improved]

###RESUME_START###
[ONLY the enhanced resume content here - ready to send to employers]

ORIGINAL RESUME:
${resumeText}`;

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(endpoint, {
      contents: [{ parts: [{ text: prompt }] }],
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fullResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!fullResponse) {
      throw new Error("No response from Gemini AI");
    }
    
    console.log("=== FULL AI RESPONSE ===");
    console.log(fullResponse);
    console.log("======================");
    
    // Split using the marker
    let enhancedResumeOnly = fullResponse;
    
    if (fullResponse.includes("###RESUME_START###")) {
      const parts = fullResponse.split("###RESUME_START###");
      enhancedResumeOnly = parts[1].trim();
      console.log("✅ Found ###RESUME_START### marker");
    } else if (fullResponse.includes("=== ENHANCED RESUME ===")) {
      const parts = fullResponse.split("=== ENHANCED RESUME ===");
      enhancedResumeOnly = parts[1].trim();
      console.log("✅ Found === ENHANCED RESUME === marker");
    } else {
      console.log("⚠️ No marker found, using fallback parsing");
      // Fallback: try to remove everything before the actual resume content
      const lines = fullResponse.split('\n');
      let startIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        // Find where actual resume content starts (after analysis)
        if (line.includes('experience') || 
            line.includes('education') || 
            line.includes('skills') ||
            line.includes('summary') ||
            line.includes('professional') ||
            line.includes('objective')) {
          startIndex = i;
          console.log(`✅ Found resume content start at line ${i}: ${lines[i]}`);
          break;
        }
      }
      
      if (startIndex > 0) {
        enhancedResumeOnly = lines.slice(startIndex).join('\n').trim();
      }
    }
    
    // Remove any remaining analysis markers and score lines
  // Remove any unnecessary symbols and clean the enhanced resume text
enhancedResumeOnly = enhancedResumeOnly
  // Remove separators, hashtags, equals signs
  .replace(/^[=\-#\s]+$/gm, '')
  .replace(/^#+\s?/gm, '')
  .replace(/^={2,}\s?/gm, '')
  // Remove ATS metadata or extra instructions
  .replace(/Original ATS Score:.*/gi, '')
  .replace(/Enhanced ATS Score:.*/gi, '')
  .replace(/Key Improvements:.*/gi, '')
  .replace(/Explanation:.*/gi, '')
  .replace(/ATS ANALYSIS/gi, '')
  // Clean asterisks (Markdown bullets)
  .replace(/^\s*\*\s?/gm, '')
  // Remove Markdown-style emphasis
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  // Strip trailing markers between lines
  .replace(/^[=#]+\s*(.*)$/gm, '$1')
  .replace(/^\s*=\s*$/gm, '')
  // Final text cleanup
  .split('\n')
  .map(line =>
    line
      .replace(/^#+\s*/, '')
      .replace(/^=+\s*/, '')
      .replace(/\s*=+\s*$/, '')
      .trim()
  )
  .filter(line => {
    const lower = line.toLowerCase();
    return (
      line.trim().length > 0 &&
      !lower.includes('ats score') &&
      !lower.includes('key improvement') &&
      !lower.includes('explanation:')
    );
  })
  .join('\n')
  .trim();

    
    console.log("=== CLEAN RESUME ONLY (for PDF) ===");
    console.log(enhancedResumeOnly);
    console.log("===================================");
    
    // Generate file with ONLY the enhanced resume (no scores)
    let fileBuffer;
    
    switch (format) {
      case "pdf":
        fileBuffer = generatePDF(enhancedResumeOnly, uploaderName);
        break;
      case "docx":
        fileBuffer = await generateDOCX(enhancedResumeOnly, uploaderName);
        break;
      case "txt":
        fileBuffer = generateTXT(enhancedResumeOnly);
        break;
      default:
        fileBuffer = generateTXT(enhancedResumeOnly);
    }
    
    // Convert to base64
    const base64 = btoa(
      new Uint8Array(fileBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    return {
      displayText: fullResponse,              // Full text with scores for UI
      enhancedResumeOnly: enhancedResumeOnly, // Just resume for download
      base64,                                  // File with only resume
      format
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "AI enhancement failed");
  }
}