import { useEffect, useState } from "react";
import { enhanceResumeWithGemini } from "../hooks/gemini";

export default function EnhancementViewer({ resumeFile, setEnhancedText }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeFile) return;

    (async () => {
      setLoading(true);
      setError("");
      setResult("");

      try {
        const enhanced = await enhanceResumeWithGemini(resumeFile);
        if (!enhanced || enhanced.trim() === "") {
          throw new Error("Empty response from AI");
        }
        setResult(enhanced);
        setEnhancedText(enhanced);
      } catch (e) {
        console.error("Enhancement error:", e);
        setError(
          e.message || "Could not enhance your resume. Please retry."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeFile, setEnhancedText]);

  return (
    <div className="w-full mt-10 mb-6 p-7 md:p-10 rounded-2xl shadow-xl bg-blue-50 border border-blue-200">
      {loading && (
        <div className="text-center py-8">
          <p className="animate-pulse text-xl text-blue-400 mb-2">
            Enhancing your resume with Gemini AI…
          </p>
          <p className="text-sm text-blue-300">
            Parsing file and optimizing for ATS...
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">Error:</p>
          <p className="text-red-500 break-words">{error}</p>
        </div>
      )}
      
      {!loading && result && !error && (
        <>
          <h3 className="font-bold text-lg text-blue-700 mb-4">
            Enhanced Resume (ATS Optimized)
          </h3>
          <pre className="bg-white text-blue-800 p-4 rounded-xl whitespace-pre-wrap max-h-[400px] overflow-auto font-mono border border-blue-100 text-sm">
            {result}
          </pre>
        </>
      )}
    </div>
  );
}