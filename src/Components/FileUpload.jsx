import { useRef, useState } from "react";

export default function FileUpload({ setResumeFile }) {
  const inputRef = useRef();
  const [dragActive, setDragActive] = useState(false);

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
    <div className="w-full px-2">
      <div
        onClick={() => inputRef.current.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`rounded-2xl shadow-xl transition-all duration-300 border-2 border-dashed border-violet-400 cursor-pointer w-full bg-white/10 backdrop-blur-md px-6 py-12 md:py-20 flex flex-col items-center gap-4 ${
          dragActive ? "border-pink-400 bg-pink-400/20" : ""
        }`}
      >
        <span className="mb-2 text-4xl text-indigo-200">📄</span>
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Drag & Drop your <span className="text-violet-400">PDF</span>, <span className="text-pink-400">DOCX</span> or <span className="text-fuchsia-400">TXT</span> resume here
        </h2>
        <button
          onClick={e => (e.stopPropagation(), inputRef.current.click())}
          className="transition-all px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow active:scale-95 hover:from-pink-600 hover:to-violet-600 font-bold"
        >
          Select File
        </button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
        <small className="block mt-2 text-xs text-gray-400">
          We never store your data. Resume processed locally & via secure AI.
        </small>
      </div>
    </div>
  );
}
