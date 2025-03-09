import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-white flex items-center justify-between p-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img className="rounded-xl h-10 w-10" src="https://github.com/pietroschoch.png" alt="" />
        <p className="flex items-center gap-3">
          <span className="text-lg font-bold">Pietro</span>
          <span className="p-2 bg-gray-200 rounded-md text-gray-600">Leankeep</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-700 rounded-full"></span>
          <span className="text-green-700 text-base">online agora</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
    </div>
  );
}