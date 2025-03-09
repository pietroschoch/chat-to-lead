// src/services/RDStationService.ts

import { rdStationAuth } from './RDStationAuth';

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
          phone: lead.phone, 
          company: lead.company,
          cf_empresa: lead.company,
          tags: ['leadchat', 'demo_gratuita']
        }
      };

      // Usa o proxy URL para evitar problemas de CORS
      const response = await rdStationAuth.fetch(
        '/rd-api/platform/events?event_type=conversion',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(conversionData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API RD Station:', errorText);
        return false;
      }

      const data = await response.json();
      console.log('Resposta da API RD Station:', data);
      return true;
    } catch (error) {
      console.error('Erro ao criar conversão no RD Station:', error);
      return false;
    }
  }
}

// Exporta uma instância única
export const rdStationService = new RDStationService();