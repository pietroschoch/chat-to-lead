import { useState } from 'react';
import { OpenChatButton } from './components/OpenChatButton';
import { Chat } from './components/Chat';
import { ChatProvider } from './context/ChatContext';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatProvider>
      {!isChatOpen && <OpenChatButton onClick={() => setIsChatOpen(true)} />}
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
    </ChatProvider>
  );
}