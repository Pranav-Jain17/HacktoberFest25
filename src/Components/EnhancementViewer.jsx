import { useEffect, useState } from "react";
import { extractText, enhanceResumeWithGemini } from "../hooks/gemini";
import { useTranslation } from "react-i18next";

// Cleans markdown-style and GPT separator symbols for UI display
function cleanResumeText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/^[=\-#\s]+$/gm, "")
    .replace(/^#+\s?/gm, "")
    .replace(/^={2,}\s?/gm, "")
    .replace(/^\s*[\*\-\+]\s?/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^[=#]+\s*(.*)$/gm, "$1")
    .replace(/^\s*=\s*$/gm, "")
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

// Extract ATS scores from text
function extractATSScores(text) {
  const scores = {
    original: null,
    enhanced: null,
    improvements: []
  };

  const originalMatch = text.match(/Original\s+ATS\s+Score:\s*(\d+)(?:\/100)?/i);
  const enhancedMatch = text.match(/Enhanced\s+ATS\s+Score:\s*(\d+)(?:\/100)?/i);
  
  if (originalMatch) scores.original = parseInt(originalMatch[1]);
  if (enhancedMatch) scores.enhanced = parseInt(enhancedMatch[1]);

  const improvementsMatch = text.match(/Key Improvements?:([\s\S]*?)(?=###|$)/i);
  if (improvementsMatch) {
    scores.improvements = improvementsMatch[1]
      .split('\n')
      .map(line => line.replace(/^[\s\-\*]+/, '').trim())
      .filter(line => line.length > 0);
  }

  return scores;
}

// Progress bar component for ATS score
function ATSScoreBar({ score, label }) {
  if (score === null || score === undefined) return null;
  
  const percentage = Math.min(Math.max(score, 0), 100);
  const color = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-lg font-bold text-blue-900">{percentage}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function EnhancementViewer({ 
  resumeFile, 
  setEnhancedText, 
  setBase64FileContent, 
  setFileFormat,
  errorData,
  setErrorData,
  isButtonDisabled,
  setIsButtonDisabled,
  setResetTimer
}) {
  const [originalText, setOriginalText] = useState(""); // NEW: Store original resume
  const [enhancedResult, setEnhancedResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [atsScores, setAtsScores] = useState(null);
  const [viewMode, setViewMode] = useState("enhanced"); // NEW: "original" or "enhanced"

  const { t, i18n } = useTranslation();

  // NEW: Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if Ctrl (or Cmd on Mac) is pressed
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setViewMode("enhanced");
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          setViewMode("original");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (!resumeFile) return;

    (async () => {
      setLoading(true);
      setError("");
      setEnhancedResult("");
      setOriginalText("");
      setAtsScores(null);

      try {
        const { text: resumeText, format } = await extractText(resumeFile);
        
        if (!resumeText || resumeText.trim() === "") {
          throw new Error(t("errors.noText"));
        }

        // Store original text
        setOriginalText(resumeText);

        const uploaderName = resumeFile.name.replace(/\.[^/.]+$/, "") || "Resume";
        const language = i18n.language || 'en';
        
        const enhanced = await enhanceResumeWithGemini(resumeText, format, uploaderName, language);

        const scores = extractATSScores(enhanced.displayText);
        setAtsScores(scores);

        const cleanDisplay = cleanResumeText(enhanced.displayText);

        setEnhancedResult(cleanDisplay);
        setEnhancedText(cleanDisplay);
        setBase64FileContent(enhanced.base64);
        setFileFormat(enhanced.format);
        
      } catch (e) {
        console.error("Enhancement error:", e);
        setError(e.message || t("errors.generic"));
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeFile, setEnhancedText, setBase64FileContent, setFileFormat, t, i18n.language]);

  // Helper to render formatted text
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('score:') || 
          trimmedLine.toLowerCase().includes('ats analysis') ||
          trimmedLine.toLowerCase().includes('key improvement')) {
        return null;
      }

      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 0 && trimmedLine.length < 50) {
        return (
          <p key={idx} className="font-bold text-blue-800 mt-6 mb-3 text-base sm:text-lg break-words">
            {trimmedLine}
          </p>
        );
      }

      if (trimmedLine.startsWith('Explanation:')) {
        return (
          <p key={idx} className="text-gray-700 italic my-2 bg-blue-50 p-3 rounded text-sm sm:text-base break-words">
            {trimmedLine}
          </p>
        );
      }

      if (!trimmedLine) {
        return <br key={idx} />;
      }

      return (
        <p key={idx} className="my-1 text-gray-800 text-sm sm:text-base break-words leading-relaxed">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="w-full mt-6 sm:mt-10 mb-6 p-4 sm:p-7 md:p-10 rounded-2xl shadow-xl bg-blue-50 border border-blue-200">
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="animate-pulse text-lg sm:text-xl text-blue-600 mb-2 font-semibold">
            {t("enhancing.title")}
          </p>
          <p className="text-xs sm:text-sm text-blue-400">
            {t("enhancing.subtitle")}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2 text-sm sm:text-base">{t("errors.title")}</p>
          <p className="text-red-500 break-words text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {!loading && (originalText || enhancedResult) && !error && (
        <>
          {/* NEW: Toggle Tabs with Keyboard Shortcut Hints */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("original")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  viewMode === "original"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                }`}
              >
                {t("viewer.original")}
              </button>
              <button
                onClick={() => setViewMode("enhanced")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  viewMode === "enhanced"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                }`}
              >
                {t("viewer.enhanced")}
              </button>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded border border-gray-200">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd> + 
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">←</kbd> / 
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">→</kbd>
            </div>
          </div>

          {/* Content Display */}
          {viewMode === "original" && originalText && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl sm:text-2xl text-blue-700 mb-4 flex items-center gap-2">
                {t("viewer.originalHeading")}
              </h3>
              <div className="bg-white text-gray-800 p-4 sm:p-6 rounded-xl max-h-[400px] sm:max-h-[600px] overflow-y-auto border border-blue-100 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base break-words">
                  {originalText}
                </pre>
              </div>
            </div>
          )}

          {viewMode === "enhanced" && enhancedResult && (
            <>
              <h3 className="font-bold text-xl sm:text-2xl text-blue-700 mb-4 sm:mb-6 flex items-center gap-2 break-words">
                {t("enhanced.heading")}
              </h3>

              {/* ATS Score Display */}
              {atsScores && (atsScores.original !== null || atsScores.enhanced !== null) && (
                <div className="bg-white p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 shadow-md border border-blue-100">
                  <h4 className="text-base sm:text-lg font-bold text-blue-900 mb-4">
                    {t("viewer.atsAnalysis")}
                  </h4>
                  
                  <div className="space-y-4">
                    {atsScores.original !== null && (
                      <ATSScoreBar score={atsScores.original} label={t("viewer.originalScore")} />
                    )}
                    
                    {atsScores.enhanced !== null && (
                      <ATSScoreBar score={atsScores.enhanced} label={t("viewer.enhancedScore")} />
                    )}
                  </div>

                  {atsScores.original !== null && atsScores.enhanced !== null && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-semibold text-sm sm:text-base text-center">
                        ✨ {t("viewer.improvement")}: +{atsScores.enhanced - atsScores.original} {t("viewer.points")}
                      </p>
                    </div>
                  )}

                  {atsScores.improvements.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        {t("viewer.keyImprovements")}:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm">
                        {atsScores.improvements.slice(0, 5).map((improvement, idx) => (
                          <li key={idx} className="break-words">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Resume Content */}
              <div className="bg-white text-blue-800 p-4 sm:p-6 rounded-xl max-h-[400px] sm:max-h-[600px] overflow-y-auto border border-blue-100 shadow-inner">
                {renderFormattedText(enhancedResult)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}