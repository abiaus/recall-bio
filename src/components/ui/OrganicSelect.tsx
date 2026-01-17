"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface OrganicSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function OrganicSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required = false,
  className = "",
}: OrganicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = value.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`} ref={selectRef}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused || isOpen ? "text-[var(--primary-terracotta)]" : "text-[#5D4E37]"
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div
        className={`w-full px-4 py-3 rounded-lg border bg-white text-[var(--text-primary)] cursor-pointer transition-all duration-200 ${
          isFocused || isOpen
            ? "border-[var(--primary-terracotta)] shadow-md shadow-[var(--primary-terracotta)]/10"
            : "border-[#D4C5B0] hover:border-[#C4B5A0]"
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
      >
        <div className="flex items-center justify-between">
          <span className={hasValue ? "text-[var(--text-primary)]" : "text-[#A89580]"}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon}
                {selectedOption.label}
              </span>
            ) : (
              placeholder
            )}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-[#5D4E37]" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-[#D4C5B0] shadow-xl overflow-hidden"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-2 ${
                  value === option.value
                    ? "bg-[var(--primary-terracotta)]/10 text-[var(--primary-terracotta)]"
                    : "hover:bg-[var(--bg-warm)] text-[var(--text-primary)]"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setIsFocused(false);
                }}
              >
                {option.icon}
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
