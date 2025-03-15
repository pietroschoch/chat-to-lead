(function() {
    // Evitar múltiplas inicializações
    if (window.leadChatInitialized) return;
    window.leadChatInitialized = true;
    
    // Função para detectar se é dispositivo móvel
    function isMobile() {
      return window.innerWidth < 768 || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  
    // Remover qualquer instância existente do chat
    function cleanup() {
      const existingIframes = document.querySelectorAll('#leadchat-iframe-container');
      existingIframes.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    }
    
    // Função para criar apenas o iframe do chat (sem botão)
    function createChatIframe() {
      // Limpar instâncias anteriores
      cleanup();
      
      // Cria um container para o iframe
      const container = document.createElement('div');
      container.id = 'leadchat-iframe-container';
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.zIndex = '9999';
      container.style.display = 'none'; // Inicia oculto
      document.body.appendChild(container);
      
      // Estilos para o iframe
      const styles = document.createElement('style');
      styles.id = 'leadchat-styles';
      styles.textContent = `
        #leadchat-iframe-container {
          z-index: 9999;
        }
        #leadchat-iframe {
          border: none;
          width: ${isMobile() ? '100vw' : '450px'};
          height: ${isMobile() ? '100vh' : '600px'};
          max-width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        @media (max-width: 767px) {
          #leadchat-iframe-container.open {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
          #leadchat-iframe {
            border-radius: 0;
          }
        }
      `;
      document.head.appendChild(styles);
      
      // Cria o iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'leadchat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Atendimento ao Cliente';
      iframe.setAttribute('importance', 'high');
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('allow', 'clipboard-write');
      container.appendChild(iframe);
      
      // Ouve mensagens do seu aplicativo React para abrir o chat
      window.addEventListener('message', function(event) {
        // Mensagem para abrir o chat
        if (event.data === 'openchat') {
          container.style.display = 'block';
          container.classList.add('open');
        }
        
        // Mensagem para fechar o chat
        if (event.data === 'closechat') {
          container.style.display = 'none';
          container.classList.remove('open');
          
          // Notifica o aplicativo React que o chat foi fechado
          window.postMessage('chatclosed', '*');
        }
      });
      
      // Expõe métodos globais para abrir/fechar o chat programaticamente
      window.openLeadChat = function() {
        container.style.display = 'block';
        container.classList.add('open');
      };
      
      window.closeLeadChat = function() {
        container.style.display = 'none';
        container.classList.remove('open');
      };
    }
    
    // Inicia o chat
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createChatIframe);
    } else {
      createChatIframe();
    }
  })();