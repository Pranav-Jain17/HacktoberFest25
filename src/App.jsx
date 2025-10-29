import { useState } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";
import './i18n';

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");
  const [base64FileContent, setBase64FileContent] = useState("");
  const [fileFormat, setFileFormat] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <EliteHeader />
      </div>
      
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {!resumeFile ? (
          <FileUpload setResumeFile={setResumeFile} />
        ) : (
          <div className="w-full space-y-4">
            {/* Reset button for mobile */}
            <button
              onClick={() => {
                setResumeFile(null);
                setEnhancedText("");
                setBase64FileContent("");
                setFileFormat("");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline mb-2"
            >
              ← Upload different file
            </button>

            <EnhancementViewer
              resumeFile={resumeFile}
              setEnhancedText={setEnhancedText}
              setBase64FileContent={setBase64FileContent}
              setFileFormat={setFileFormat}
            />
            
            {enhancedText && base64FileContent && (
              <DownloadButton 
                enhancedFileBase64={base64FileContent}
                fileFormat={fileFormat}
              />
            )}
          </div>
        )}
      </main>
      
      <footer className="text-xs sm:text-sm text-blue-800 py-4 font-medium opacity-80 text-center px-4">
        © 2025 | AI Resume Enhancer SPA
      </footer>
    </div>
  );
}