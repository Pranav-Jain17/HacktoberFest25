export default function Footer() {
  return (
    <footer
      className="w-full bg-blue-50 dark:bg-gray-800 border-t border-blue-200 dark:border-gray-700 
                 text-xs sm:text-sm text-blue-800 dark:text-gray-300 py-4 font-medium text-center px-4 
                 transition-colors duration-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        <a
          href="/privacy"
          className="hover:text-blue-900 dark:hover:text-white underline underline-offset-2"
        >
          Privacy Policy
        </a>
        <a
          href="/license"
          className="hover:text-blue-900 dark:hover:text-white underline underline-offset-2"
        >
          License
        </a>
        <a
          href="/about"
          className="hover:text-blue-900 dark:hover:text-white underline underline-offset-2"
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
