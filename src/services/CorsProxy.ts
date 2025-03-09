/**
 * This service provides a fallback solution for making API requests
 * when the Vite proxy server is not available (like in production).
 */
export class CorsProxyService {
    // Free CORS proxy services
    private readonly CORS_PROXIES = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    
    private currentProxyIndex = 0;
    
    /**
     * Get the next CORS proxy URL in the rotation
     */
    private getNextProxy(): string {
      const proxy = this.CORS_PROXIES[this.currentProxyIndex];
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.CORS_PROXIES.length;
      return proxy;
    }
    
    /**
     * Make a fetch request with CORS proxy fallback
     * @param url Original URL to fetch
     * @param options Fetch options
     * @returns Fetch response
     */
    public async fetch(url: string, options: RequestInit = {}): Promise<Response> {
      try {
        // First try direct request (works if CORS is enabled or using Vite proxy in dev)
        return await fetch(url, options);
      } catch (error) {
        console.log('Direct fetch failed, trying CORS proxy:', error);
        
        // If direct request fails, try using a CORS proxy
        const proxy = this.getNextProxy();
        
        // Format URL accordingly based on the proxy service
        let proxyUrl = proxy;
        if (proxy.includes('?url=')) {
          proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        } else {
          proxyUrl = `${proxy}${url}`;
        }
        
        return fetch(proxyUrl, options);
      }
    }
  }
  
  export const corsProxy = new CorsProxyService();