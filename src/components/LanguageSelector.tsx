'use client';

import React from 'react';
import { Language } from '@/types';
import { SUPPORTED_LANGUAGES } from '@/config/languages';

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (languageCode: string) => void;
  disabled?: boolean;
}

export default function LanguageSelector({
  label,
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <div className="language-selector">
      <label htmlFor={`lang-${label}`} className="label">
        {label}
      </label>
      <select
        id={`lang-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select"
      >
        {SUPPORTED_LANGUAGES.map((lang: Language) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}
