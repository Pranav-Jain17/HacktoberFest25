import { useState } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-2">
      <EliteHeader />
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        {!resumeFile ? (
          <FileUpload setResumeFile={setResumeFile} />
        ) : (
          <>
            <EnhancementViewer
              resumeFile={resumeFile}
              setEnhancedText={setEnhancedText}
            />
            {enhancedText && <DownloadButton enhancedText={enhancedText} />}
          </>
        )}
      </main>
      <footer className="text-xs text-blue-800 py-4 font-medium opacity-80">
        © 2025 | AI Resume Enhancer SPA
      </footer>
    </div>
  );
}
