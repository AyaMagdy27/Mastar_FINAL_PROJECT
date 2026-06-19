import React, { useRef, useEffect } from 'react';

interface AutoExpandingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AutoExpandingTextarea({
  value,
  onChange,
  placeholder,
  disabled
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Directly adjust height on type for smoother feedback
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl p-6 pb-10 min-h-[10rem] max-h-96 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50/50 font-medium text-sm transition-all focus:bg-white text-slate-800 placeholder-slate-400 overflow-y-auto shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
      ></textarea>
      <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-white/80 px-2 py-0.5 rounded backdrop-blur border border-slate-100/50">
        {value.length} characters
      </div>
    </div>
  );
}
