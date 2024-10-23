import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendLeadData } from '../services/rdStationService'; // Integração com o serviço

export function QuestionForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);

  const handleSubmit = () => {
    const leadData = {
      name,
      company,
    };
    sendLeadData(leadData);  // Chama o serviço para enviar os dados ao RD Station
    alert('Dados enviados!');
  };

  return (
    <div>
      {step === 0 && (
        <>
          <p className="mt-4">
            Quer receber uma Proposta Personalizada para sua empresa?
          </p>
          <Button onClick={handleNextStep} className="mt-4 w-full">
            Sim, quero receber
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <p>Qual é o seu nome?</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="mt-4 w-full"
          />
          <Button onClick={handleNextStep} className="mt-4 w-full">
            Próximo
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Qual é o nome da sua empresa?</p>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Digite o nome da empresa"
            className="mt-4 w-full"
          />
          <Button onClick={handleSubmit} className="mt-4 w-full">
            Enviar
          </Button>
        </>
      )}
    </div>
  );
}
