import { useState, useEffect } from "react";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";
import './i18n';
import "react-toastify/dist/ReactToastify.css";
import "./styles/toastAnimations.css"
import { ToastContainer, toast } from "react-toastify";


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

  // Welcome Toast Message 
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setTimeout(() => {
        toast.info("👋 Welcome! Let’s enhance your resume!", {
        });
      }, 100); // 100ms delay
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <EliteHeader />
        <ToastContainer 
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick = {true}
        />
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
          </div>
        )}
      </main>
      
      <footer className="text-xs sm:text-sm text-blue-800 py-4 font-medium opacity-80 text-center px-4">
        © 2025 | AI Resume Enhancer SPA
      </footer>
    </div>
  );
}
