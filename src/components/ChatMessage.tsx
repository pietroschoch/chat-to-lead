import { Phone } from 'lucide-react';

interface ChatMessageProps {
  isAgent: boolean;
  message: string;
}

export function ChatMessage({ isAgent, message }: ChatMessageProps) {
  if (message === "whatsapp_button") {
    return (
      <div className="p-3">
        <button 
          className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          onClick={() => window.open('https://wa.me/5541991016746', '_blank')}
        >
          <Phone size={24} />
          Continuar no WhatsApp
        </button>
      </div>
    );
  }

  return (
    <div className={`flex align-top gap-3 ${isAgent ? '' : 'self-end'}`}>
      {isAgent && <img className="rounded-xl h-10 w-10" src="https://github.com/pietroschoch.png" alt="" />}
      <div className="flex gap-2 flex-col">
        <p className={`rounded-xl ${isAgent ? 'border border-gray-200' : 'bg-gray-100'} p-3 w-fit`}>
          {message}
        </p>
      </div>
    </div>
  );
}