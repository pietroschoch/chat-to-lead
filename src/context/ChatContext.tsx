import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface Question {
  text: string;
  field: string;
  placeholder: string;
}

interface ChatContextType {
  messages: { isAgent: boolean; message: string }[];
  currentQuestionIndex: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: () => void;
  questions: Question[];
  isComplete: boolean;
  isTyping: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const questions: Question[] = [
    { text: "Qual o seu nome?", field: 'name', placeholder: 'Digite seu nome...' },
    { text: "Qual o seu email?", field: 'email', placeholder: 'Digite seu email...' },
    { text: "Qual o nome da sua empresa?", field: 'company', placeholder: 'Digite o nome da sua empresa...' },
  ];

  const [messages, setMessages] = useState<{ isAgent: boolean; message: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: string, isAgent: boolean) => {
    return new Promise<void>((resolve) => {
      if (isAgent) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { isAgent, message }]);
          setIsTyping(false);
          resolve();
        }, 1500);
      } else {
        setMessages(prev => [...prev, { isAgent, message }]);
        resolve();
      }
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (inputValue.trim()) {
      await addMessage(inputValue.trim(), false);
      setInputValue('');
      
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex < questions.length) {
        await addMessage(questions[nextQuestionIndex].text, true);
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        await addMessage("Obrigado pelas informações! Clique no botão abaixo para continuar no WhatsApp.", true);
        await addMessage("whatsapp_button", true);
        setIsComplete(true);
      }
    }
  }, [inputValue, currentQuestionIndex, addMessage, questions]);

  useEffect(() => {
    const initializeChat = async () => {
      if (messages.length === 0) {
        await addMessage("Olá, tudo bem? Já estou preparando sua apresentação, antes disso preciso de algumas informações rápidas", true);
        await addMessage(questions[0].text, true);
        setCurrentQuestionIndex(0);
      }
    };
    initializeChat();
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      currentQuestionIndex,
      inputValue,
      setInputValue,
      handleSubmit,
      questions,
      isComplete,
      isTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};
