import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; 

export default function EliteHeader() {
  const { t } = useTranslation();

  return (
    <header className="w-full mt-6 sm:mt-10 mb-6 sm:mb-10">
      {/* Language Switcher - Top Right */}
      <div className="flex justify-end mb-4 px-4 sm:px-0">
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