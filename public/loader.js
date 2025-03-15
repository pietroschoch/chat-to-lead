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
      const existingContainers = document.querySelectorAll('#leadchat-container, .leadchat-container');
      existingContainers.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    }
    
    // Função para criar o chat
    function createLeadChat() {
      // Limpar instâncias anteriores
      cleanup();
      
      // Cria um container para o botão e posteriormente para o chat
      const container = document.createElement('div');
      container.id = 'leadchat-container';
      container.className = 'leadchat-container';
      document.body.appendChild(container);
      
      // Primeiro, apenas carrega o botão de chat
      const chatButton = document.createElement('div');
      chatButton.id = 'leadchat-button';
      chatButton.className = 'leadchat-button';
      chatButton.innerHTML = `
        <div class="leadchat-button-inner">
          <div class="leadchat-message">Quer ver uma <strong>Demonstração Gratuita</strong> da Leankeep?</div>
          <div class="leadchat-avatar">
            <img src="https://github.com/pietroschoch.png" alt="Atendente">
            <span class="leadchat-online-indicator"></span>
          </div>
        </div>
      `;
      
      // Estilos para o botão e iframe
      const styles = document.createElement('style');
      styles.id = 'leadchat-styles';
      styles.textContent = `
        .leadchat-container {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .leadchat-button {
          cursor: pointer;
          transition: all 0.3s ease;
          display: block;
        }
        .leadchat-button:hover {
          transform: translateY(-4px);
        }
        .leadchat-button-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .leadchat-message {
          background: white;
          padding: 10px 16px;
          border-radius: 16px;
          border-bottom-right-radius: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-size: 14px;
          line-height: 1.4;
          max-width: ${isMobile() ? 'calc(100vw - 96px)' : '320px'};
          width: ${isMobile() ? 'calc(100vw - 96px)' : 'auto'};
        }
        .leadchat-avatar {
          position: relative;
          flex-shrink: 0;
        }
        .leadchat-avatar img {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .leadchat-online-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        #leadchat-iframe {
          display: none;
          border: none;
          width: ${isMobile() ? '100vw' : '450px'};
          height: ${isMobile() ? '100vh' : '600px'};
          max-width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        #leadchat-iframe.open {
          display: block;
        }
        @media (max-width: 767px) {
          #leadchat-iframe.open {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
            z-index: 99999;
          }
          .leadchat-container {
            bottom: 8px;
            right: 8px;
          }
        }
      `;
      document.head.appendChild(styles);
      
      // Adiciona o botão ao container
      container.appendChild(chatButton);
      
      // Cria o iframe oculto
      const iframe = document.createElement('iframe');
      iframe.id = 'leadchat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Atendimento ao Cliente';
      iframe.setAttribute('importance', 'high');
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('allow', 'clipboard-write');
      container.appendChild(iframe);
      
      // Adiciona a funcionalidade de clique
      chatButton.addEventListener('click', function() {
        chatButton.style.display = 'none';
        iframe.classList.add('open');
      });
      
      // Ouve mensagens do iframe para fechar o chat quando necessário
      window.addEventListener('message', function(event) {
        if (event.data === 'closechat') {
          iframe.classList.remove('open');
          chatButton.style.display = 'block';
        }
      });
      
      // Verifica se o iframe foi carregado corretamente
      iframe.addEventListener('load', function() {
        console.log('LeadChat iframe carregado com sucesso');
      });
  
      // Adiciona método para fechar o chat programaticamente
      window.closeLeadChat = function() {
        iframe.classList.remove('open');
        chatButton.style.display = 'block';
      };
      
      // Expõe a função para limpar e recriar o chat se necessário
      window.resetLeadChat = function() {
        cleanup();
        createLeadChat();
      };
    }
    
    // Verifica se o DOM já está carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createLeadChat);
    } else {
      setTimeout(createLeadChat, 100); // Pequeno delay para garantir que qualquer outro script tenha terminado
    }
  })();