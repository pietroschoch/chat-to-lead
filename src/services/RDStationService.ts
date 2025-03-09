import { rdStationAuth } from './RDStationAuth';

interface Lead {
  name: string; 
  email: string;
  phone: string;
  company: string;
}

export class RDStationService {
  // Check if we're in production (Netlify) environment
  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
  }

  // Get the appropriate API URL based on environment
  private getApiUrl(endpoint: string): string {
    // In production, we can't use the proxy, so use CORS proxy or direct API
    if (this.isProduction()) {
      return `https://api.rd.services/${endpoint}`;
    }
    // In development, use the proxy
    return `/rd-api/${endpoint}`;
  }

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

      // Use CORS proxy method directly in production
      if (this.isProduction()) {
        console.log('Using CORS proxy in production environment');
        return this.createLeadWithCorsProxy(lead);
      }

      // Try standard API method first (only in development)
      try {
        const apiUrl = this.getApiUrl('platform/events');
        console.log(`Trying API request to: ${apiUrl}`);
        
        const response = await rdStationAuth.fetch(
          apiUrl,
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
        return this.createLeadWithCorsProxy(lead);
      }
    } catch (error) {
      console.error('Erro ao criar conversão no RD Station:', error);
      return false;
    }
  }

  // Method to create lead using CORS proxy
  private async createLeadWithCorsProxy(lead: Lead): Promise<boolean> {
    // Public token for conversions (replace with your actual one)
    const publicToken = 'your_rd_station_public_token';
    
    const fallbackPayload = {
      conversion_identifier: 'LeadChat',
      email: lead.email,
      name: lead.name,
      mobile_phone: lead.phone, 
      personal_phone: lead.phone, 
      company: lead.company, 
      cf_empresa: lead.company,
      tags: ['leadchat'],
      token: publicToken,
      traffic_source: 'LeadChat',
    };
    
    try {
      // Try each of our CORS proxies
      for (const proxyPrefix of [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
      ]) {
        try {
          const proxyUrl = `${proxyPrefix}${encodeURIComponent('https://api.rd.services/platform/conversions')}`;
          
          console.log(`Trying CORS proxy: ${proxyUrl}`);
          
          const fallbackResponse = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(fallbackPayload)
          });
          
          if (fallbackResponse.ok) {
            console.log('Conversão enviada pelo CORS proxy com sucesso');
            return true;
          } else {
            console.error(`Falha no CORS proxy ${proxyPrefix}:`, await fallbackResponse.text());
          }
        } catch (proxyError) {
          console.error(`Erro no CORS proxy ${proxyPrefix}:`, proxyError);
        }
      }
      
      // Last resort: direct API call (might still fail due to CORS)
      try {
        console.log('Trying direct API call as last resort');
        const directResponse = await fetch('https://api.rd.services/platform/conversions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(fallbackPayload)
        });
        
        if (directResponse.ok) {
          console.log('Conversão enviada diretamente com sucesso');
          return true;
        } else {
          console.error('Falha na chamada direta:', await directResponse.text());
        }
      } catch (directError) {
        console.error('Erro na chamada direta:', directError);
      }
      
      // All methods failed
      return false;
    } catch (error) {
      console.error('Erro no método alternativo:', error);
      return false;
    }
  }
  
  // Alternative method to store leads in localStorage only
  public storeLeadLocally(lead: Lead): void {
    try {
      // Get existing leads or initialize empty array
      const existingLeadsStr = localStorage.getItem('leadchat_leads') || '[]';
      const existingLeads = JSON.parse(existingLeadsStr);
      
      // Add timestamp
      const leadWithTimestamp = {
        ...lead,
        timestamp: new Date().toISOString()
      };
      
      // Add new lead
      existingLeads.push(leadWithTimestamp);
      
      // Save back to localStorage
      localStorage.setItem('leadchat_leads', JSON.stringify(existingLeads));
      
      console.log('Lead stored locally successfully');
    } catch (error) {
      console.error('Error storing lead locally:', error);
    }
  }
}

// Exporta uma instância única
export const rdStationService = new RDStationService();