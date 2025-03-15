// src/App.tsx
import { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { ChatProvider } from './context/ChatContext';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExternalLoader, setIsExternalLoader] = useState(false);

  // Detectar presença do loader externo
  useEffect(() => {
    const checkExternalLoader = () => {
      const hasLoader = typeof window.openLeankeepChat === 'function';
      setIsExternalLoader(hasLoader);
      console.log("External loader detected:", hasLoader);
      return hasLoader;
    };

    // Verificar imediatamente
    checkExternalLoader();

    // Adicionar listener para mensagens do loader
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'openchat') {
        console.log("Open chat message received");
        setIsChatOpen(true);
      } else if (event.data === 'closechat') {
        console.log("Close chat message received");
        setIsChatOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Detecta se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Impede rolagem do body quando o chat estiver aberto em dispositivos móveis
  useEffect(() => {
    if (isMobile && isChatOpen && !isExternalLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isChatOpen, isExternalLoader]);

  // Lidar com fechamento do chat interno
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <ChatProvider>
      {/* Renderizar o chat interno apenas se não houver loader externo */}
      {isChatOpen && !isExternalLoader && (
        <div className={isMobile ? "fixed inset-0 z-50 bg-white" : ""}>
          <Chat onClose={handleCloseChat} />
        </div>
      )}
    </ChatProvider>
  );
}

// Interface para o objeto window
declare global {
  interface Window {
    openLeankeepChat?: () => void;
    closeLeankeepChat?: () => void;
  }
}