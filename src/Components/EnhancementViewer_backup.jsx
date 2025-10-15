import { useEffect, useState } from "react";
import { extractText, enhanceResumeWithGemini } from "../hooks/gemini";

// Basic base64 format validation (checks if string only has base64 chars and padding)
const isValidBase64 = (str) => {
  if (typeof str !== "string") return false;
  // base64 regex covers A-Z, a-z, 0-9, +, / with optional padding =
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
};

export default function EnhancementViewer({ resumeFile, setEnhancedText, setBase64FileContent, setFileFormat }) {
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
        // Extract text and format from the uploaded file
        const { text: resumeText, format } = await extractText(resumeFile);

        if (typeof resumeText !== "string" || resumeText.trim() === "") {
          throw new Error("Could not extract text from the file or text is empty.");
        }

        const uploaderName = resumeFile.name.split(".")[0] || "Anonymous";

        // Call enhancement with extracted text and format
        const enhanced = await enhanceResumeWithGemini(resumeText, format, uploaderName);
        
        // Validate base64 before setting
        if (enhanced.base64 && isValidBase64(enhanced.base64)) {
          setBase64FileContent(enhanced.base64);
        } else {
          setBase64FileContent("");
          console.warn("Invalid or missing base64 data from enhancement API");
        }

        if (enhanced.format) {
          setFileFormat(enhanced.format);
        }

        if (typeof enhanced.enhancedText === "string") {
          setResult(enhanced.enhancedText);
          setEnhancedText(enhanced.enhancedText);
        } else if (typeof enhanced === "string" && enhanced.trim() !== "") {
          setResult(enhanced);
          setEnhancedText(enhanced);
        } else {
          setResult("");
          setEnhancedText("");
        }
      } catch (e) {
        console.error("Enhancement error:", e);
        setError(e.message || "Could not enhance your resume. Please retry.");
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeFile, setEnhancedText, setBase64FileContent, setFileFormat]);

  return (
    <div className="w-full mt-10 mb-6 p-7 md:p-10 rounded-2xl shadow-xl bg-blue-50 border border-blue-200">
      {loading && (
        <div className="text-center py-8">
          <p className="animate-pulse text-xl text-blue-400 mb-2">
            Enhancing your resume with Gemini AI…
          </p>
          <p className="text-sm text-blue-300">Parsing file and optimizing for ATS...</p>
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
