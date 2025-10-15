export default function DownloadButton({ 
  enhancedFileBase64,
  fileFormat
}) {
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
          mimeType = "application/octet-stream"; // fallback MIME type
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
