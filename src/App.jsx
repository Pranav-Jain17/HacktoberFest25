import { useState, useEffect } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";




export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");
  const [base64FileContent, setBase64FileContent] = useState("");
  const [fileFormat, setFileFormat] = useState("");

  // New central states for quota error handling
  const [errorData, setErrorData] = useState({
    message: "",
    isQuota: false,
    delay: 0,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);

  // Countdown for retry after quota lock
  useEffect(() => {
    if (resetTimer > 0) {
      const interval = setInterval(() => {
        setResetTimer((t) => (t > 1 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (resetTimer === 0 && isButtonDisabled) {
      setIsButtonDisabled(false);
      setErrorData({ message: "", isQuota: false, delay: 0 });
    }
  }, [resetTimer, isButtonDisabled]);

  // Quota lock visual animation
  const QuotaErrorBanner = () =>
    errorData.isQuota ? (
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[500px] bg-red-600 text-white text-center py-4 px-6 rounded-xl shadow-lg animate-pulse z-50">
        <p className="font-semibold text-lg mb-1">🚫 API Quota Reached</p>
        <p className="text-sm opacity-90 mb-1">{errorData.message}</p>
        <p className="text-xs opacity-80">
          Retrying available in {formatTime(resetTimer)}...
        </p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-2 relative">
      <EliteHeader />
      {/* Show animated quota error if applicable */}
      <QuotaErrorBanner />

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
              // Pass new error-related props
              errorData={errorData}
              setErrorData={setErrorData}
              isButtonDisabled={isButtonDisabled}
              setIsButtonDisabled={setIsButtonDisabled}
              setResetTimer={setResetTimer}
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
