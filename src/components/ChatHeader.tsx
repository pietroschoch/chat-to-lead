// src/components/ChatHeader.tsx
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-white flex items-center justify-between p-2 md:p-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img className="rounded-xl h-8 w-8 md:h-10 md:w-10" src="https://github.com/pietroschoch.png" alt="" />
        <div className="flex flex-col md:flex-row md:items-center md:gap-3">
          <span className="text-base md:text-lg font-bold">Pietro</span>
          <span className="text-xs md:text-sm p-1 md:p-2 bg-gray-200 rounded-md text-gray-600">Leankeep</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden sm:flex items-center gap-1">
          <span className="w-2 h-2 md:w-3 md:h-3 bg-green-700 rounded-full"></span>
          <span className="text-xs md:text-base text-green-700">online agora</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}