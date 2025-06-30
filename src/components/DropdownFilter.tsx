'use client';

import React from 'react';

interface DropdownFilterProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 border px-3 py-2 rounded-md bg-white"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
