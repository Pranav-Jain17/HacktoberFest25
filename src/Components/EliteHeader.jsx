import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; 
import ThemeToggle from './ThemeToggle';

export default function EliteHeader() {
  const { t } = useTranslation();

  return (
    <header className="w-full mt-6 sm:mt-10 mb-6 sm:mb-10">
      {/* Language Switcher + Theme Toggle - Top Right */}
      <div className="flex justify-end items-center gap-4 mb-4 px-4 sm:px-0">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Centered Title and Subtitle */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-700 dark:text-blue-300 transition-colors duration-300">
          {t('header.title')}
        </h1>
        <p className="text-base sm:text-lg mt-3 text-blue-500 dark:text-blue-400 font-semibold transition-colors duration-300">
          {t('header.subtitle')}
        </p>
      </div>
    </header>
  );
}
