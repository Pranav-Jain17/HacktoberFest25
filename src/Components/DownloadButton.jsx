import { jsPDF } from "jspdf";
import { generateEliteResumeHTML } from "../utils/resumeTemplate";

export default function DownloadButton({ enhancedText }) {
  const handleDownload = () => {
    if (!enhancedText || enhancedText.trim() === "") {
      alert("No resume text to generate PDF");
      return;
    }

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const htmlContent = generateEliteResumeHTML(enhancedText);

    doc.html(htmlContent, {
      callback: () => {
        doc.save("enhanced_resume.pdf");
      },
      x: 10,
      y: 10,
      width: 190,   // width of your content within PDF page
      windowWidth: 900, // virtual window width, adjust to your HTML template width
    });
  };

  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        className="mt-6 px-5 py-3 text-lg font-bold text-white bg-blue-700 rounded-xl shadow-lg hover:bg-blue-900 active:scale-95 transition"
      >
        Download Enhanced Resume as PDF
      </button>
    </div>
  );
}
