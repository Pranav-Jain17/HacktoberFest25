import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; 
export default function EliteHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center mt-10 mb-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-blue-700">
          {t('header.title')}
        </h1>
        <p className="text-lg mt-3 text-blue-500 font-semibold">
          {t('header.subtitle')}
        </p>
      </div>

      <LanguageSwitcher />
    </header>
  );
}
