import { corsProxy } from './CorsProxy';

export class RDStationAuth {
    // Credenciais da sua aplicação RD Station
    private static CLIENT_ID = '34883ac3-b203-4862-b196-7d2ec8af3ee8';
    private static CLIENT_SECRET = '6e7bb72e2fea465bb8a79ec4b8519f23';
    private static TOKEN_URL = 'https://api.rd.services/auth/token';
  
    // Tokens armazenados
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private tokenExpiration: number | null = null;
  
    constructor() {
      // Inicializa com os tokens fornecidos
      this.setTokensManually(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5yZC5zZXJ2aWNlcyIsInN1YiI6InJETGI4ZWVwTWdhU3NrNjd3SWVzNlhZZzhfWEFvVEZqaS1qLXZXaXdJOFFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBwLnJkc3RhdGlvbi5jb20uYnIvYXBpL3YyLyIsImFwcF9uYW1lIjoiTGVhbmtlZXAgTGVhZENoYXQiLCJleHAiOjE3NDE2MDY3NDMsImlhdCI6MTc0MTUyMDM0Mywic2NvcGUiOiIifQ.T8xK8NYa86wG1iJJjW5YK9AvyXqEzW2JNUNC0xwmySK-Yw7m9WOeZlIMGfIryU3Syg2VyVbKES7aJbP7S13TgQQNov4pnFagwurEV4rIiJydLxPNOyJ7QUzG5PA8EU6KpFQXYWQfJlCwFEkNKovtNs0-LjsjiAUKfR8Y70YBq0F_I5s0wS1z0hUgWK9j39CYUV07M-A6i8fL876YfrBIIEAcYTAlbkZaon_6Um0Dur0ENuaIycnQAQxdvSBf3Lo_AoASd9fICZ033R3GA2SyC9SyazoLke9qwW8RLHb4G0m4CVrtE8YJCFp4gnQujAJOXRWJLPgn6Tbh6Mo57DVhvQ', 
        '5wOPod1VkQJpUusG8w2HMj_yRFlxzZSAn4Ps8DM4slo', 
        86400
      );
    }
  
    // Define os tokens manualmente
    public setTokensManually(accessToken: string, refreshToken: string, expiresIn: number = 86400): void {
      // Calcula a expiração com base na duração do token
      const expirationTime = Date.now() + (expiresIn * 1000);
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenExpiration = expirationTime;
    }
  
    private async refreshAccessToken(): Promise<boolean> {
      if (!this.refreshToken) {
        return false;
      }
  
      const payload = {
        client_id: RDStationAuth.CLIENT_ID,
        client_secret: RDStationAuth.CLIENT_SECRET,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      };
      
      try {
        // Primeiro tenta usar o proxy configurado no Vite
        let response: Response;
        
        try {
          response = await fetch('/rd-api/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (error) {
          console.log('Falha ao usar proxy local, tentando CORS proxy:', error);
          
          // Se falhar, tenta usar o CORS proxy
          response = await corsProxy.fetch(RDStationAuth.TOKEN_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }
  
        if (!response.ok) {
          console.error('Falha ao renovar token:', await response.text());
          return false;
        }
  
        const data = await response.json();
        this.setTokensManually(data.access_token, data.refresh_token, data.expires_in);
        return true;
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        return false;
      }
    }
  
    private isTokenExpired(): boolean {
      if (!this.tokenExpiration) return true;
      // Considera o token expirado 60 segundos antes para margem de segurança
      return Date.now() >= (this.tokenExpiration - 60000);
    }
  
    public async getValidAccessToken(): Promise<string | null> {
      if (!this.accessToken || this.isTokenExpired()) {
        if (this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (!refreshed) return null;
        } else {
          return null;
        }
      }
      return this.accessToken;
    }
  
    public async fetch(url: string, options: RequestInit = {}): Promise<Response> {
      const token = await this.getValidAccessToken();
      
      if (!token) {
        throw new Error('Token de acesso válido não disponível');
      }
  
      // Adiciona o token de acesso ao cabeçalho Authorization
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
  
      try {
        // Primeiro tenta usar o proxy configurado no Vite
        let response: Response;
        try {
          // Converte o URL para usar o proxy se for uma URL da API RD
          let proxyUrl = url;
          if (url.startsWith('https://api.rd.services')) {
            proxyUrl = url.replace('https://api.rd.services', '/rd-api');
          }
          
          response = await fetch(proxyUrl, {
            ...options,
            headers
          });
        } catch (error) {
          console.log('Falha ao usar proxy local, tentando CORS proxy:', error);
          
          // Se falhar, tenta usar o CORS proxy
          response = await corsProxy.fetch(url, {
            ...options,
            headers
          });
        }
    
        // Se receber um erro de autorização (401), tenta renovar o token e repetir a requisição
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Atualiza o token no cabeçalho e tenta novamente
            return this.fetch(url, options);
          }
        }
    
        return response;
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    }
  }
  
  // Exporta uma instância única
  export const rdStationAuth = new RDStationAuth();