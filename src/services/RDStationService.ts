// src/services/RDStationService.ts

import { rdStationAuth } from './RDStationAuth';
import { corsProxy } from './CorsProxy';

interface Lead {
  name: string; 
  email: string;
  phone: string;
  company: string;
}

export class RDStationService {
  // Envia um lead como uma conversão para a RD Station
  public async createLead(lead: Lead): Promise<boolean> {
    try {
      const conversionData = {
        event_type: 'CONVERSION',
        event_family: 'CDP',
        payload: {
          conversion_identifier: 'LeadChat',
          email: lead.email,
          name: lead.name,
          mobile_phone: lead.phone, 
          personal_phone: lead.phone, 
          company: lead.company, 
          cf_empresa: lead.company,
          tags: ['leadchat']
        }
      };

      // Tenta enviar usando o método de autenticação normal
      try {
        // Versão normal com autenticação
        const response = await rdStationAuth.fetch(
          'https://api.rd.services/platform/events',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(conversionData)
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Resposta da API RD Station:', data);
          return true;
        }

        const errorText = await response.text();
        console.error('Erro na API RD Station:', errorText);
        throw new Error('Falha na requisição principal');
      } catch (mainError) {
        console.warn('Tentando método alternativo após falha:', mainError);
        
        // Método alternativo: conversão direta para o RD Station 
        // (funciona sem token, mas com limitações)
        const conversionUrl = 'https://api.rd.services/platform/conversions';
        const publicToken = '7d8sca73b329t0r1bf2qp72';  // Token público (fictício, substitua pelo seu)
        
        const fallbackPayload = {
          ...conversionData.payload,
          token: publicToken, // Adiciona o token público para conversões
          traffic_source: 'LeadChat',
        };
        
        try {
          // Usa o CORS proxy para fazer a requisição alternativa
          const fallbackResponse = await corsProxy.fetch(conversionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(fallbackPayload)
          });
          
          if (fallbackResponse.ok) {
            console.log('Conversão enviada pelo método alternativo com sucesso');
            return true;
          } else {
            console.error('Falha no método alternativo:', await fallbackResponse.text());
            return false;
          }
        } catch (fallbackError) {
          console.error('Erro no método alternativo:', fallbackError);
          return false;
        }
      }
    } catch (error) {
      console.error('Erro ao criar conversão no RD Station:', error);
      return false;
    }
  }
}

// Exporta uma instância única
export const rdStationService = new RDStationService();