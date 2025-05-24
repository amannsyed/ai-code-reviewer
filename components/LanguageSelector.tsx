
import React from 'react';
import type { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  languages: SupportedLanguage[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange, languages }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const langValue = event.target.value;
    const lang = languages.find(l => l.value === langValue) || languages[0];
    onLanguageChange(lang);
  };

  return (
    <div className="w-full">
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-1">
        Select Language
      </label>
      <select
        id="language-select"
        value={selectedLanguage.value}
        onChange={handleChange}
        className="w-full bg-gray-700 border border-gray-600 text-gray-100 py-2.5 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
