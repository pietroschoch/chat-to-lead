// src/components/ChatMessage.tsx
import { Phone } from 'lucide-react';

interface ChatMessageProps {
  isAgent: boolean;
  message: string;
}

export function ChatMessage({ isAgent, message }: ChatMessageProps) {
  if (message === "whatsapp_button") {
    return (
      <div className="p-2 md:p-3">
        <button 
          className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          onClick={() => window.open('https://wa.me/5541991016746', '_blank')}
        >
          <Phone size={20} className="md:w-6 md:h-6" />
          <span className="text-sm md:text-base">Continuar no WhatsApp</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex align-top gap-2 md:gap-3 ${isAgent ? '' : 'self-end'}`}>
      {isAgent && <img className="rounded-xl h-8 w-8 md:h-10 md:w-10" src="https://github.com/pietroschoch.png" alt="" />}
      <div className="flex gap-1 md:gap-2 flex-col max-w-[75%] md:max-w-[80%]">
        <p className={`text-sm md:text-base rounded-xl ${isAgent ? 'border border-gray-200' : 'bg-gray-100'} p-2 md:p-3 w-fit`}>
          {message}
        </p>
      </div>
    </div>
  );
}