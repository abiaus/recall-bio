"use client";

import { useState } from "react";

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  textarea?: boolean;
  rows?: number;
}

export function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  textarea = false,
  rows = 4,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-white text-[var(--text-primary)] focus:outline-none transition-all duration-200 placeholder:text-[#A89580] ${
    isFocused
      ? "border-[var(--primary-terracotta)] shadow-md shadow-[var(--primary-terracotta)]/10"
      : "border-[#D4C5B0] hover:border-[#C4B5A0]"
  } ${className}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused ? "text-[var(--primary-terracotta)]" : "text-[#5D4E37]"
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
    </div>
  );
}
