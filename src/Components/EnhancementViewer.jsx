import { useEffect, useState } from "react";
import { enhanceResumeWithGemini } from "../hooks/gemini";

export default function EnhancementViewer({ resumeFile, setEnhancedText }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      setResult("");
      try {
        const enhanced = await enhanceResumeWithGemini(resumeFile);
        setResult(enhanced);
        setEnhancedText(enhanced);
      } catch {
        setError("Could not enhance your resume. Please retry.");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [resumeFile]);

  return (
    <div className="w-full mt-10 mb-6">
      <div className="p-7 md:p-10 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md glassmorphism">
        {loading && (
          <div className="text-center py-8 animate-pulse text-xl text-indigo-200">Enhancing your resume with Gemini AI…</div>
        )}
        {error && <div className="text-red-300 text-center">{error}</div>}
        {!loading && result && (
          <div>
            <h3 className="font-bold text-lg text-fuchsia-300 mb-2">Enhanced Resume Suggestions:</h3>
            <pre className="bg-black/40 text-white p-4 overflow-x-auto rounded-xl whitespace-pre-wrap font-mono text-sm break-words max-h-[400px]">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
