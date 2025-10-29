import { useTranslation } from "react-i18next";

export default function DownloadButton({ 
  enhancedFileBase64,
  fileFormat
}) {
  const { t } = useTranslation(); 

  // Helper to convert base64 to Blob and trigger download
  const downloadFileFromBase64 = (base64Data, fileName, mimeType) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (enhancedFileBase64 && enhancedFileBase64.length > 100) {
      const ext = fileFormat || "pdf";
      let mimeType = "";
      switch (ext) {
        case "pdf":
          mimeType = "application/pdf";
          break;
        case "docx":
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "txt":
          mimeType = "text/plain";
          break;
        default:
          mimeType = "application/octet-stream";
      }
      downloadFileFromBase64(enhancedFileBase64, `enhanced_resume.${ext}`, mimeType);
    } else {
      alert(t("download.noFile")); 
    }
  };

  return (
    <div className="text-center w-full px-4 sm:px-0">
      <button
        onClick={handleDownload}
        className="w-full sm:w-auto mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-blue-700 rounded-xl shadow-lg hover:bg-blue-800 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 sm:h-6 sm:w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        <span className="break-words">{t("download.button")}</span>
      </button>
    </div>
  );
}