import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function EliteHeader() {
  const { t } = useTranslation();

  return (
    <header className="w-full mt-6 sm:mt-10 mb-6 sm:mb-10">
      {/* Top bar: Logo (left) + Language Switcher (right) */}
      <div className="flex justify-between items-center mb-4 px-4 sm:px-8">
        <div className="flex items-center space-x-2">
         
          <img 
           src="/ai_resume_logo.jpg" 
           alt="AI Resume Enhancer Logo"
           className="w-10 h-10 sm:w-12 sm:h-12"
           />

          <span className="hidden sm:block text-xl font-bold text-blue-700">
            AI Resume Enhancer
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Centered Title and Subtitle */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-700">
          {t('header.title')}
        </h1>
        <p className="text-base sm:text-lg mt-3 text-blue-500 font-semibold">
          {t('header.subtitle')}
        </p>
      </div>
    </header>
  );
}
