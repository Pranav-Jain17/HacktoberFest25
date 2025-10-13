export default function DownloadButton({ enhancedText }) {
  const handleDownload = () => {
    const blob = new Blob([enhancedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "enhanced_resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        className="mt-6 px-5 py-3 text-lg font-bold text-white bg-blue-700 rounded-xl shadow-lg hover:bg-blue-800 active:scale-95 transition"
      >
        Download Enhanced Resume
      </button>
    </div>
  );
}
