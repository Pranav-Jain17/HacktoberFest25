import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col items-start">
   
      <label htmlFor="language-select" className="sr-only">
        Language selection
      </label>

      <select
        id="language-select"
        aria-label="Language selection"
        value={i18n.language}
        onChange={handleChange}
        className="p-2 border border-blue-600 rounded text-blue-800 focus:ring-2 focus:ring-blue-800"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;

