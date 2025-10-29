import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; 
export default function EliteHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center mt-10 mb-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF]">
          {t('header.title')}
        </h1>
        <p className="text-lg mt-3 font-semibold text-[#004080]">
          {t('header.subtitle')}
        </p>
      </div>

      <LanguageSwitcher />
    </header>
  );
}
