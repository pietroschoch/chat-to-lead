// src/App.tsx
import { useState, useEffect } from 'react';
import { OpenChatButton } from './components/OpenChatButton';
import { Chat } from './components/Chat';
import { ChatProvider } from './context/ChatContext';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <ChatProvider>
      {!isChatOpen && <OpenChatButton onClick={() => setIsChatOpen(true)} />}
      {isChatOpen && (
        <div className={isMobile ? "fixed inset-0 z-50 bg-white" : ""}>
          <Chat onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </ChatProvider>
  );
}