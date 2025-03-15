// src/App.tsx
import { useState, useEffect } from 'react';
import { OpenChatButton } from './components/OpenChatButton';
import { Chat } from './components/Chat';
import { ChatProvider } from './context/ChatContext';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExternalLoader, setIsExternalLoader] = useState(false);

  // Detecta se o carregador externo está presente
  useEffect(() => {
    const checkExternalLoader = () => {
      const hasExternalLoader = typeof window.openLeankeepChat === 'function';
      setIsExternalLoader(hasExternalLoader);
      return hasExternalLoader;
    };

    // Verificar imediatamente
    checkExternalLoader();

    // Verificar novamente quando o loader sinalizar que está pronto
    const handleLoaderReady = () => {
      setIsExternalLoader(true);
    };

    window.addEventListener('leankeepChatReady', handleLoaderReady);
    
    // Atualizar estado quando o chat for aberto/fechado externamente
    const handleChatOpened = () => setIsChatOpen(true);
    const handleChatClosed = () => setIsChatOpen(false);
    
    window.addEventListener('leankeepChatOpened', handleChatOpened);
    window.addEventListener('leankeepChatClosed', handleChatClosed);

    return () => {
      window.removeEventListener('leankeepChatReady', handleLoaderReady);
      window.removeEventListener('leankeepChatOpened', handleChatOpened);
      window.removeEventListener('leankeepChatClosed', handleChatClosed);
    };
  }, []);

  // Detecta se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint md no Tailwind
    };
    
    // Verificação inicial
    checkIfMobile();
    
    // Adiciona listener para mudanças de tamanho da tela
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Impede rolagem do body quando o chat estiver aberto em dispositivos móveis
  useEffect(() => {
    if (isMobile && isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isChatOpen]);

  // Lidar com abertura do chat
  const handleOpenChat = () => {
    setIsChatOpen(true);
    
    // Se estiver usando o loader externo, não precisamos renderizar nosso próprio Chat
    if (isExternalLoader) {
      if (typeof window.openLeankeepChat === 'function') {
        window.openLeankeepChat();
      }
    }
  };

  // Lidar com fechamento do chat
  const handleCloseChat = () => {
    setIsChatOpen(false);
    
    // Se estiver usando o loader externo, fechar via método global
    if (isExternalLoader) {
      if (typeof window.closeLeankeepChat === 'function') {
        window.closeLeankeepChat();
      }
    }
  };

  return (
    <ChatProvider>
      {!isChatOpen && <OpenChatButton onClick={handleOpenChat} />}
      
      {/* Só renderizamos nosso próprio Chat se não estivermos usando o loader externo */}
      {isChatOpen && !isExternalLoader && (
        <div className={isMobile ? "fixed inset-0 z-50 bg-white" : ""}>
          <Chat onClose={handleCloseChat} />
        </div>
      )}
    </ChatProvider>
  );
}

// Adicionar a interface para o objeto window
declare global {
  interface Window {
    openLeankeepChat?: () => void;
    closeLeankeepChat?: () => void;
  }
}