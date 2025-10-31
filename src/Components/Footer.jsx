export default function Footer() {
  return (
    <footer
      className="w-full bg-blue-50 border-t border-blue-200 text-xs sm:text-sm text-blue-800 py-4 font-medium text-center px-4"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <a
          href="/privacy"
          className="hover:text-blue-900 underline underline-offset-2"
        >
          Privacy Policy
        </a>
        <a
          href="/license"
          className="hover:text-blue-900 underline underline-offset-2"
        >
          License
        </a>
        <a
          href="/about"
          className="hover:text-blue-900 underline underline-offset-2"
        >
          About
        </a>
      </div>

      <div className="mt-2 opacity-70">
        © {new Date().getFullYear()} | AI Resume Enhancer SPA
      </div>
    </footer>
  );
}
