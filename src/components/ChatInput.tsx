import React, { useState, useEffect } from 'react';
import { CircleArrowRight } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder: string;
  isEmailField: boolean;
}

export function ChatInput({ value, onChange, onSubmit, placeholder, isEmailField }: ChatInputProps) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (isEmailField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(value) || value === '');
    } else {
      setIsValid(true);
    }
  }, [value, isEmailField]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <div className='flex items-center p-3'>
      <input
        className={`rounded-xl rounded-r-none border h-[3.25rem] border-gray-300 p-4 py-3 flex-1 -mr-5 focus:outline-none focus:border ${
          isValid ? 'focus:border-green-600' : 'border-red-500 focus:border-red-500'
        }`}
        type={isEmailField ? "email" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        className={`text-white p-2 rounded-xl w-[3.25rem] h-[3.25rem] flex items-center justify-center ${
          isValid ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleSubmit}
        disabled={!isValid}
      >
        <CircleArrowRight size={32}/>
      </button>
    </div>
  );
}