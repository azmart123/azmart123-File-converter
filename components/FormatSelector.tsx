
import React from 'react';
import { FormatCategory } from '../types';

interface FormatSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: FormatCategory[];
  id: string;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange, options, id }) => {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-white bg-base-300 border border-slate-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
      >
        <option value="" disabled>Select format...</option>
        {options.map((category) => (
          <optgroup key={category.name} label={category.name}>
            {category.formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
