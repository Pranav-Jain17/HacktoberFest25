export default function DownloadButton({ 
  enhancedFileBase64,
  fileFormat
}) {
  // Helper to download file blob from base64 string
  const downloadFileFromBase64 = (base64Data, fileName, mimeType) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      alert("No enhanced resume file available for download");
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        className="mt-6 px-5 py-3 text-lg font-bold text-white bg-blue-700 rounded-xl shadow-lg hover:bg-blue-900 active:scale-95 transition"
      >
        Download Enhanced Resume
      </button>
    </div>
  );
}
