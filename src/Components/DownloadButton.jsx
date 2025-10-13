import { useRef } from "react";
import { generateEliteResumeHTML } from "../utils/resumeTemplate"; // your HTML template function
import html2pdf from "html2pdf.js";

export default function DownloadButton({ enhancedText }) {
  const hiddenRef = useRef();

  // Generate the HTML for the resume and inject into hidden div
  const htmlContent = generateEliteResumeHTML(enhancedText);
console.log("Generated HTML content:",htmlContent)
  // When user clicks download, convert the hidden div's HTML to PDF
  const handleDownload = () => {
    const element = hiddenRef.current;
     if (!element) {
    alert("Nothing to download!");
    return;
  }
    setTimeout(()=>{
html2pdf()
      .set({
        margin: 10,
        filename: "enhanced_resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 ,useCORS: true,logging: true,
             onclone: (clonedDoc) => {
          // Find your hidden div in the cloned DOM and make it visible
          const hiddenEl = clonedDoc.querySelector("#pdf-content");
          if (hiddenEl) {
            hiddenEl.style.opacity = "1";
            hiddenEl.style.position = "relative";
            hiddenEl.style.pointerEvents = "auto";
          }
        }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
    },100)
  };

  return (
    <>
      {/* Hidden div holding the rendered HTML for PDF conversion */}
      <div
      id="pdf-content"
        ref={hiddenRef}
         style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: "210mm" }}
        // style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div className="text-center">
        <button
          onClick={handleDownload}
          className="mt-6 px-5 py-3 text-lg font-bold text-white bg-blue-700 rounded-xl shadow-lg hover:bg-blue-900 active:scale-95 transition"
        >
          Download Enhanced Resume as PDF
        </button>
      </div>
    </>
  );
}
