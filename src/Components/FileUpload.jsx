import { useRef, useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";

export default function FileUpload({
  setResumeFile,
  uploadButtonRef,
  shortcutLabel,
}) {
  const inputRef = useRef();
  const [dragActive, setDragActive] = useState(false);
  const { t } = useTranslation();

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }

  function handleChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  }

  return (
    <section className="w-full">
      <div
        onClick={() => inputRef.current.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 transition-all duration-300 border-blue-300 cursor-pointer w-full bg-white px-6 py-12 md:py-20 flex flex-col items-center gap-4 shadow-lg ${
          dragActive ? "border-blue-500 bg-blue-50" : ""
        }`}
      >
        <span className="mb-2 text-4xl text-blue-400">📄</span>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          {t("upload.title")} <span className="text-blue-500">PDF</span>,{" "}
          <span className="text-blue-500">DOCX</span> {t("upload.or")}{" "}
          <span className="text-blue-500">TXT</span> {t("upload.here")}
        </h2>
        <div className="relative group inline-block">
          <button
            ref={uploadButtonRef}
            onClick={(e) => (e.stopPropagation(), inputRef.current.click())}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            {t("upload.button")}
          </button>
          {shortcutLabel && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded shadow border border-blue-200 select-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none">
              {shortcutLabel}
            </span>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
        <small className="block mt-2 text-xs text-blue-400">
          {t("upload.note")}
        </small>
      </div>
    </section>
  );
}
