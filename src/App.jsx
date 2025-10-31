import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import EliteHeader from "./Components/EliteHeader";
import FileUpload from "./Components/FileUpload";
import EnhancementViewer from "./Components/EnhancementViewer";
import DownloadButton from "./Components/DownloadButton";
import Footer from "./Components/Footer";
import Privacy from "./pages/Privacy";
import License from "./pages/License";
import About from "./pages/About";
import "./i18n";

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [enhancedText, setEnhancedText] = useState("");
  const [base64FileContent, setBase64FileContent] = useState("");
  const [fileFormat, setFileFormat] = useState("");

  const [errorData, setErrorData] = useState({
    message: "",
    isQuota: false,
    delay: 0,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);

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

  const QuotaErrorBanner = () =>
    errorData.isQuota ? (
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[500px] bg-red-600 text-white text-center py-4 px-6 rounded-xl shadow-lg animate-pulse z-50">
        <p className="font-semibold text-lg mb-1">🚫 API Quota Reached</p>
        <p className="text-sm opacity-90 mb-1">{errorData.message}</p>
        <p className="text-xs opacity-80">Retrying available in {resetTimer}s...</p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <EliteHeader />
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <Routes>
          <Route
            path="/"
            element={
              !resumeFile ? (
                <FileUpload setResumeFile={setResumeFile} />
              ) : (
                <div className="w-full space-y-4">
                  <button
                    onClick={() => {
                      setResumeFile(null);
                      setEnhancedText("");
                      setBase64FileContent("");
                      setFileFormat("");
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline mb-2 transition-colors duration-300"
                  >
                    ← Upload different file
                  </button>

                  <EnhancementViewer
                    resumeFile={resumeFile}
                    setEnhancedText={setEnhancedText}
                    setBase64FileContent={setBase64FileContent}
                    setFileFormat={setFileFormat}
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
              )
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/license" element={<License />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
