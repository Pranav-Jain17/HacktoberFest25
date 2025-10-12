export default function DownloadButton({ enhancedText }) {
  const onDownload = () => {
    const file = new Blob([enhancedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "enhanced_resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="text-center">
      <button
        className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-violet-600 hover:to-pink-600 transition-all px-5 py-3 mt-6 text-lg font-bold rounded-xl text-white shadow-lg active:scale-95"
        onClick={onDownload}
      >
        Download Enhanced Resume
      </button>
    </div>
  );
}
