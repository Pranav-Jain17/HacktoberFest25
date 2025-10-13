import { useState } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 flex flex-col px-2">
      <EliteHeader />
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center">
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
      <footer className="mx-auto text-xs text-gray-400 py-4 opacity-70">
        © 2025 | Powered by Gemini AI | Elite Resume SPA
      </footer>
    </div>
  );
}
