import axios from "axios";

// For demo/parsing, replace this with pdfjs-dist/mammoth for real usage.
export async function extractText(file) {
  return new Promise((resolve, reject) => {
    const isDoc =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx");
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (isPdf || isDoc) {
      const reader = new FileReader();
      reader.onload = e =>
        resolve("*** RESUME CONTENT FROM FILE GOES HERE ***\nThis is a sample ATS optimization content output.");
      reader.onerror = e => reject();
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject();
      reader.readAsText(file);
    }
  });
}

export async function enhanceResumeWithGemini(resumeFile) {
  const resumeText = await extractText(resumeFile);
  const prompt =
    `Enhance this resume for the best ATS score, optimizing keywords, skills, and formatting. Keep structure, remove personal data, and output as improved resume text.\n\n${resumeText}`;
  const endpt = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`;
  const res = await axios.post(endpt, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No AI output. Try again.";
}
