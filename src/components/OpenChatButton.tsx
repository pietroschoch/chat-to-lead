// src/components/OpenChatButton.tsx
import { useEffect } from 'react';

interface OpenChatButtonProps {
  onClick: () => void;
}

export function OpenChatButton({ onClick }: OpenChatButtonProps) {
  // Efeito para interagir com o loader externo
  useEffect(() => {
    // Função para verificar se o loader externo está disponível
    const checkExternalLoader = () => {
      return typeof window.openLeankeepChat === 'function';
    };

    // Manipulador de eventos para quando o chat for fechado externamente
    const handleChatClosed = () => {
      // Notificar a aplicação React que o chat foi fechado
      if (typeof window.onChatClosed === 'function') {
        window.onChatClosed();
      }
    };

    // Adicionar listener para o evento de fechamento do chat
    window.addEventListener('leankeepChatClosed', handleChatClosed);

    // Permitir que o componente React acesse o método global
    window.onChatClosed = () => {
      // Chamar qualquer lógica adicional aqui se necessário
    };

    // Limpar os listeners quando o componente for desmontado
    return () => {
      window.removeEventListener('leankeepChatClosed', handleChatClosed);
      delete window.onChatClosed;
    };
  }, []);

  const handleClick = () => {
    // Chamar o callback original
    onClick();
    
    // Se o loader externo estiver disponível, usar seu método para abrir o chat
    if (typeof window.openLeankeepChat === 'function') {
      window.openLeankeepChat();
    } else {
      // Caso o loader não esteja disponível, enviar a mensagem diretamente
      window.postMessage('openchat', '*');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 md:gap-3 cursor-pointer group hover:bottom-5 transition-all ease-linear" onClick={handleClick}>
      {/* Balão de texto - agora ocupa largura total em mobile */}
      <div className="flex-1 bg-white p-2 md:p-4 rounded-2xl rounded-br-none text-xs md:text-lg leading-tight md:leading-6 w-[calc(100vw-6rem)] sm:w-64 md:w-80 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all ease-linear">
        Quer ver uma <strong>Demonstração Gratuita</strong> da Leankeep?
      </div>
      
      {/* Avatar com indicador online */}
      <div className="relative flex-shrink-0">
        <img 
          className="rounded-2xl h-14 w-14 md:h-20 md:w-20 shadow-lg" 
          src="https://github.com/pietroschoch.png" 
          alt="Agente de atendimento" 
        />
        <span className="absolute -top-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-500 rounded-full shadow-lg group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all ease-linear"></span>
      </div>
    </div>
  );
}

// Adicionar a interface para o objeto window
declare global {
  interface Window {
    openLeankeepChat?: () => void;
    closeLeankeepChat?: () => void;
    onChatClosed?: () => void;
  }
}