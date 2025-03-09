// src/context/ChatContext.tsx
import { createContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { rdStationService } from '../services/RDStationService';

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

interface LeadData {
  name: string;
  email: string;
  phone: string; 
  company: string;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const questions: Question[] = [
    { text: "Qual o seu nome?", field: 'name', placeholder: 'Digite seu nome...' },
    { text: "Qual o seu email?", field: 'email', placeholder: 'Digite seu email...' },
    { text: "Qual o seu WhatsApp?", field: 'phone', placeholder: 'Digite seu WhatsApp...' },
    { text: "Qual o nome da sua empresa?", field: 'company', placeholder: 'Digite o nome da sua empresa...' },
  ];

  const [messages, setMessages] = useState<{ isAgent: boolean; message: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const initializationRef = useRef(false);

  // Armazena os dados do lead conforme são coletados
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});

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
      // Adiciona resposta do usuário ao chat
      await addMessage(inputValue.trim(), false);
      
      // Atualiza os dados do lead
      if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
        const fieldName = questions[currentQuestionIndex].field as keyof LeadData;
        setLeadData(prev => ({ ...prev, [fieldName]: inputValue.trim() }));
      }
      
      setInputValue('');
      
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex < questions.length) {
        // Mostra a próxima pergunta
        await addMessage(questions[nextQuestionIndex].text, true);
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        // Fluxo de finalização
        await addMessage("Obrigado pelas informações! Estou enviando seus dados...", true);
        
        // Envia o lead para a RD Station
        try {
          const success = await rdStationService.createLead(leadData as LeadData);
          
          if (success) {
            await addMessage("Seus dados foram enviados com sucesso! Clique no botão abaixo para continuar no WhatsApp.", true);
          } else {
            await addMessage("Tivemos um problema ao enviar seus dados, mas não se preocupe! Clique no botão abaixo para continuar no WhatsApp.", true);
          }
          
          await addMessage("whatsapp_button", true);
          setIsComplete(true);
        } catch (error) {
          console.error("Erro ao enviar lead:", error);
          await addMessage("Ocorreu um erro ao processar seus dados, mas você pode continuar no WhatsApp.", true);
          await addMessage("whatsapp_button", true);
          setIsComplete(true);
        }
      }
    }
  }, [inputValue, currentQuestionIndex, addMessage, questions, leadData]);

  useEffect(() => {
    // Utilizar um ref em vez de state para garantir que o código só execute uma vez
    if (!initializationRef.current) {
      initializationRef.current = true;

      const initializeChat = async () => {
        await addMessage("Olá, tudo bem? Já estou preparando sua apresentação, antes disso preciso de algumas informações rápidas", true);
        await addMessage(questions[0].text, true);
        setCurrentQuestionIndex(0);
      };
      
      initializeChat();
    }
  }, [addMessage, questions]);

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