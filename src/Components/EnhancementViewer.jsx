import { useEffect, useState } from "react";
import { extractText, enhanceResumeWithGemini } from "../hooks/gemini";
import { useTranslation } from "react-i18next";

// Cleans markdown-style and GPT separator symbols for UI display
function cleanResumeText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    // Remove separator and marker lines
    .replace(/^[=\-#\s]+$/gm, "")
    // Remove hashes from headings (e.g., ### EXPERIENCE)
    .replace(/^#+\s?/gm, "")
    // Remove '===' and similar lines
    .replace(/^={2,}\s?/gm, "")
    // Remove bullets and asterisks at line starts
    .replace(/^\s*[\*\-\+]\s?/gm, "")
    // Remove Markdown emphasis (bold/italics)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    // Remove hash/equals at line start
    .replace(/^[=#]+\s*(.*)$/gm, "$1")
    // Remove trailing equals lines
    .replace(/^\s*=\s*$/gm, "")
    // Clean up remaining stray markdown
    .split('\n')
    .map(line =>
      line
        .replace(/^#+\s*/, '')
        .replace(/^=+\s*/, '')
        .replace(/\s*=+\s*$/, '')
        .trim()
    )
    .filter(line => line.trim().length > 0)
    .join('\n')
    .trim();
}

export default function EnhancementViewer({ 
  resumeFile, 
  setEnhancedText, 
  setBase64FileContent, 
  setFileFormat 
}) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t, i18n } = useTranslation(); 

  useEffect(() => {
    if (!resumeFile) return;

    (async () => {
      setLoading(true);
      setError("");
      setResult("");

      try {
        // Extract text and format from file
        const { text: resumeText, format } = await extractText(resumeFile);
        
        if (!resumeText || resumeText.trim() === "") {
          throw new Error(t("errors.noText"));
        }

        const uploaderName = resumeFile.name.replace(/\.[^/.]+$/, "") || "Resume";
         const language = i18n.language || 'en'; 
        // Get enhanced resume with base64
        const enhanced = await enhanceResumeWithGemini(resumeText, format, uploaderName, language);

        // Clean the display text for UI (remove markdown/asterisks/hashes/etc)
        const cleanDisplay = cleanResumeText(enhanced.displayText);

        setResult(cleanDisplay);
        setEnhancedText(cleanDisplay);
        
        // Set base64 (which contains only the resume, no scores)
        setBase64FileContent(enhanced.base64);
        setFileFormat(enhanced.format);
        
      } catch (e) {
        console.error("Enhancement error:", e);
        setError(e.message || t("errors.generic"));
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeFile, setEnhancedText, setBase64FileContent, setFileFormat, t]);

  // Helper to render formatted text
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();
      
      // Highlight ATS scores with special styling
      if (trimmedLine.includes('Score:') || trimmedLine.toLowerCase().includes('ats analysis')) {
        return (
          <p key={idx} className="font-bold text-blue-900 my-2 text-lg">
            {trimmedLine}
          </p>
        );
      }
      // Section headers with markers (now removed, fallback for all-caps)
      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 0 && trimmedLine.length < 50) {
        return (
          <p key={idx} className="font-bold text-blue-800 mt-4 mb-2">
            {trimmedLine}
          </p>
        );
      }
      // Explanation or regular text
      if (trimmedLine.startsWith('Explanation:')) {
        return (
          <p key={idx} className="text-gray-800 italic my-2 bg-blue-100 p-3 rounded">
            {trimmedLine}
          </p>
        );
      }
      // Empty lines
      if (!trimmedLine) {
        return <br key={idx} />;
      }
      // Regular text
      return (
        <p key={idx} className="my-1 text-gray-800">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="w-full mt-10 mb-6 p-7 md:p-10 rounded-2xl shadow-xl bg-blue-100 border border-blue-300">
      {loading && (
        <div className="text-center py-8">
          <p className="animate-pulse text-xl text-blue-400 mb-2">
            {t("enhancing.title")}
          </p>
          <p className="text-sm text-blue-300">
            {t("enhancing.subtitle")}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">{t("errors.title")}</p>
          <p className="text-red-500 break-words">{error}</p>
        </div>
      )}

      {!loading && result && !error && (
        <>
          <h3 className="font-bold text-2xl text-blue-700 mb-6 flex items-center gap-2">
            {t("enhanced.heading")}
          </h3>
          <div className="bg-white text-blue-800 p-6 rounded-xl max-h-[600px] overflow-auto border border-blue-100 shadow-inner">
            {renderFormattedText(result)}
          </div>
        </>
      )}
    </div>
  );
}
