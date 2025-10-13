import { useState } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";
import { extractText, enhanceResumeWithGemini } from "./hooks/gemini";

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [fileFormat, setFileFormat] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [uploaderName, setUploaderName] = useState("");

 async function handleFileProcessed(file) {
  setResumeFile(file);

  const result = await extractText(file);
  console.log("extractText result:", result); // Should be object with text and format
  const resumeText = result.text;
  const format = result.format;

  if (typeof resumeText !== "string") {
    console.error("Expected string for resumeText, got:", resumeText);
    return; // Or handle error gracefully
  }
  if (!resumeText.trim()) {
    console.error("Extracted resumeText is empty");
    return;
  }

  setFileFormat(format);

  const uploadName = file.name.split(".")[0] || "Anonymous";
  setUploaderName(uploadName);

  const enhanced = await enhanceResumeWithGemini(resumeText, format, uploadName);
  setEnhancedText(enhanced);
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-2">
      <EliteHeader />
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        {!resumeFile ? (
          <FileUpload setResumeFile={handleFileProcessed} />
        ) : (
          <>
            <EnhancementViewer
              resumeFile={resumeFile}
              enhancedText={enhancedText}
              fileFormat={fileFormat}
              uploaderName={uploaderName}
              setEnhancedText={setEnhancedText}
              // also pass ATS scores if managed here
            />
            {enhancedText && <DownloadButton enhancedText={enhancedText} fileFormat={fileFormat} />}
          </>
        )}
      </main>
      <footer className="text-xs text-blue-800 py-4 font-medium opacity-80">
        © 2025 | AI Resume Enhancer SPA
      </footer>
    </div>
  );
}
