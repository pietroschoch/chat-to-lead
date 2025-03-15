// src/components/Chat.tsx
import React, { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '../hooks/useChat';

interface ChatProps {
  onClose: () => void;
}

export function Chat({ onClose }: ChatProps) {
  const { 
    messages, 
    currentQuestionIndex, 
    inputValue, 
    questions,
    setInputValue,
    handleSubmit,
    isComplete,
    isTyping
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Envia mensagem para o pai quando o chat é fechado
  const handleClose = () => {
    onClose();
    
    // Envia mensagem para o pai (janela do iframe)
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage('closechat', '*');
      } catch (e) {
        console.error('Erro ao enviar mensagem para janela pai:', e);
      }
    }
  };

  return (
    <div className="w-full md:w-[28rem] h-[32rem] md:h-[32rem] rounded-2xl md:rounded-2xl fixed bottom-0 md:bottom-4 right-0 md:right-4 bg-white shadow-lg overflow-hidden">
      <ChatHeader onClose={handleClose} />
      <div className="flex flex-col h-[calc(100%-4rem)] overflow-hidden">
        <div className="flex-grow overflow-y-auto p-3 gap-3 flex flex-col">
          {messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              isAgent={msg.isAgent} 
              message={msg.message} 
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <div className="h-16">
          {!isComplete && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && (
            <ChatInput
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
              placeholder={questions[currentQuestionIndex].placeholder}
              isEmailField={questions[currentQuestionIndex].field === 'email'}
            />
          )}
        </div>
      </div>
    </div>
  );
}