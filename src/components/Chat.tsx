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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="w-[28rem] h-[32rem] rounded-2xl fixed bottom-4 right-4 bg-white shadow-lg overflow-hidden">
      <ChatHeader onClose={onClose} />
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