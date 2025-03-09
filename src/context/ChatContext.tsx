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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initializationRef = useRef(false);
  const leadDataRef = useRef<Partial<LeadData>>({});

  // Armazena os dados do lead conforme são coletados
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});

  // Função para adicionar mensagem com efeito de digitação para o agente
  const addMessage = useCallback((message: string, isAgent: boolean) => {
    return new Promise<void>((resolve) => {
      if (isAgent) {
        setIsTyping(true);
        // Simula digitação com um delay
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

  // Tenta enviar os dados do lead para RD Station com várias tentativas
  const submitLeadData = useCallback(async (data: Partial<LeadData>): Promise<boolean> => {
    if (!data.name || !data.email || !data.phone || !data.company) {
      console.error('Dados de lead incompletos:', data);
      return false;
    }

    const completeLead = data as LeadData;
    
    // Always store the lead locally first as a backup
    rdStationService.storeLeadLocally(completeLead);
    
    // Tenta enviar o lead até 3 vezes
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Tentativa ${attempt} de enviar lead para RD Station`);
        const success = await rdStationService.createLead(completeLead);
        
        if (success) {
          console.log('Lead enviado com sucesso na tentativa', attempt);
          return true;
        }
        
        // Aguarda antes da próxima tentativa (backoff exponencial)
        if (attempt < 3) {
          const delay = attempt * 1000; // 1s, 2s, 3s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Erro na tentativa ${attempt}:`, error);
        // Continua para a próxima tentativa
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    console.error('Todas as tentativas de envio do lead falharam');
    return false;
  }, []);

  // Função que lida com o envio do formulário
  const handleSubmit = useCallback(async () => {
    if (inputValue.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        
        // Adiciona resposta do usuário ao chat
        await addMessage(inputValue.trim(), false);
        
        // Atualiza os dados do lead
        if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
          const fieldName = questions[currentQuestionIndex].field as keyof LeadData;
          const updatedLeadData = { ...leadData, [fieldName]: inputValue.trim() };
          setLeadData(updatedLeadData);
          leadDataRef.current = updatedLeadData;
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
          
          // Armazena os dados no localStorage como backup
          try {
            localStorage.setItem('leadchat_data', JSON.stringify(leadDataRef.current));
          } catch (e) {
            console.warn('Não foi possível salvar dados no localStorage:', e);
          }
          
          // Tentativa de envio para RD Station
          const success = await submitLeadData(leadDataRef.current);
          
          if (success) {
            await addMessage("Seus dados foram enviados com sucesso! Clique no botão abaixo para continuar no WhatsApp.", true);
          } else {
            // Mesmo em caso de falha, ainda permitimos que o usuário continue
            await addMessage("Estamos com um problema técnico temporário, mas não se preocupe! Seus dados foram salvos. Clique no botão abaixo para continuar no WhatsApp.", true);
          }
          
          // Adiciona botão do WhatsApp em ambos os casos
          await addMessage("whatsapp_button", true);
          setIsComplete(true);
        }
      } catch (error) {
        console.error("Erro ao processar input:", error);
        
        // Mensagem de erro amigável para o usuário
        await addMessage("Desculpe, encontrei um problema. Vamos continuar.", true);
        
        // Se estávamos na última pergunta e ocorreu um erro, ainda mostramos o botão
        if (currentQuestionIndex === questions.length - 1) {
          await addMessage("Clique no botão abaixo para continuar no WhatsApp.", true);
          await addMessage("whatsapp_button", true);
          setIsComplete(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    inputValue, 
    isSubmitting, 
    currentQuestionIndex, 
    questions, 
    addMessage,
    leadData,
    submitLeadData
  ]);

  // Inicializa o chat na primeira renderização
  useEffect(() => {
    // Utilizar um ref em vez de state para garantir que o código só execute uma vez
    if (!initializationRef.current) {
      initializationRef.current = true;

      const initializeChat = async () => {
        // Verifica se há dados salvos de uma sessão anterior que falhou
        try {
          const savedData = localStorage.getItem('leadchat_data');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Tenta enviar novamente se houver dados completos
            if (parsedData.name && parsedData.email && parsedData.phone && parsedData.company) {
              console.log('Dados encontrados de sessão anterior, tentando enviar novamente');
              submitLeadData(parsedData).then(success => {
                if (success) {
                  console.log('Dados recuperados enviados com sucesso');
                  localStorage.removeItem('leadchat_data');
                }
              });
            }
          }
        } catch (e) {
          console.warn('Erro ao verificar dados salvos:', e);
        }

        // Inicia o fluxo normal do chat
        await addMessage("Olá, tudo bem? Já estou preparando sua apresentação, antes disso preciso de algumas informações rápidas", true);
        await addMessage(questions[0].text, true);
        setCurrentQuestionIndex(0);
      };
      
      initializeChat();
    }
  }, [addMessage, questions, submitLeadData]);

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