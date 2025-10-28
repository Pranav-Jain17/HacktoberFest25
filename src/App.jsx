import { useState } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";
import LanguageSwitcher from "./Components/LanguageSwitcher";
import './i18n/config';
export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");
  const [base64FileContent, setBase64FileContent] = useState("");
  const [fileFormat, setFileFormat] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-2">
      <EliteHeader />
      <div className="mt-4 mb-6">
        <LanguageSwitcher />
      </div>
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        {!resumeFile ? (
          <FileUpload setResumeFile={setResumeFile} />
        ) : (
          <>
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
          </>
        )}
      </main>
      <footer className="text-xs text-blue-800 py-4 font-medium opacity-80">
        © 2025 | AI Resume Enhancer SPA
      </footer>
    </div>
  );
}