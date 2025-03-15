(function(){
    console.log("LeadChat loader executing...");
    
    // Evitar múltiplas inicializações
    if(window.leadChatInitialized) {
      console.log("LeadChat loader already initialized");
      return;
    }
    window.leadChatInitialized = true;
    
    console.log("LeadChat loader initializing...");
    
    // Função para detectar mobile
    function isMobile(){
      return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    // Criar elementos do chat
    function createChat(){
      console.log("Creating chat elements");
      
      // Limpar qualquer instância existente
      var oldElements = document.querySelectorAll('#leankeep-chat-container, #leankeep-chat-button, #leankeep-chat-styles');
      oldElements.forEach(function(el) {
        if(el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      console.log("Removed any existing elements");
      
      // Criar container
      var container = document.createElement('div');
      container.id = 'leankeep-chat-container';
      container.style.cssText = 'position:fixed;z-index:99999;display:none;';
      document.body.appendChild(container);
      
      // Adicionar estilos - Exatamente como o OpenChatButton do React
      var style = document.createElement('style');
      style.id = 'leankeep-chat-styles';
      style.textContent = `
        /* Estilos do container */
        #leankeep-chat-container {
          bottom: 0;
          right: 0;
          width: ${isMobile() ? '100%' : '380px'};
          height: ${isMobile() ? '100%' : '550px'};
          box-shadow: 0 5px 40px rgba(0,0,0,0.16);
          border-radius: ${isMobile() ? '0' : '16px'};
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        #leankeep-chat-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #fff;
        }
        
        /* Estilos do botão - Replicando exatamente o estilo do OpenChatButton */
        #leankeep-chat-button {
          position: fixed;
          bottom: 16px; /* 4 em rem */
          right: 16px; /* 4 em rem */
          display: flex;
          align-items: center;
          gap: 8px; /* 2 em rem */
          cursor: pointer;
          z-index: 99998;
          transition: all 0.15s linear;
        }
        
        #leankeep-chat-button:hover {
          bottom: 20px; /* 5 em rem - efeito hover */
        }
        
        #leankeep-chat-button-bubble {
          flex: 1;
          background-color: white;
          padding: 8px 16px; /* 2px/4px em rem */
          border-radius: 16px; /* 2xl em tailwind */
          border-bottom-right-radius: 0;
          text-align: left;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12px; /* xs em tailwind */
          line-height: 1.25; /* tight em tailwind */
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          width: calc(100vw - 6rem);
          max-width: 320px; /* md:w-80 em tailwind */
          transition: all 0.15s linear;
        }
        
        #leankeep-chat-button:hover #leankeep-chat-button-bubble {
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04), 0 0 10px 0 rgba(16, 185, 129, 0.5);
        }
        
        #leankeep-chat-button-avatar {
          position: relative;
          flex-shrink: 0;
        }
        
        #leankeep-chat-button-avatar img {
          width: 56px; /* h-14 em tailwind */
          height: 56px; /* w-14 em tailwind */
          border-radius: 16px; /* rounded-2xl em tailwind */
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        }
        
        #leankeep-chat-button-status {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px; /* w-3 em tailwind */
          height: 12px; /* h-3 em tailwind */
          background-color: #10B981; /* bg-green-500 em tailwind */
          border-radius: 50%; /* rounded-full em tailwind */
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          transition: all 0.15s linear;
        }
        
        #leankeep-chat-button:hover #leankeep-chat-button-status {
          box-shadow: 0 0 10px 0 rgba(16, 185, 129, 0.5);
        }
        
        /* Estilos responsivos para desktop */
        @media (min-width: 768px) {
          #leankeep-chat-button {
            gap: 12px; /* md:gap-3 em tailwind */
          }
          
          #leankeep-chat-button-bubble {
            font-size: 18px; /* md:text-lg em tailwind */
            line-height: 1.5; /* md:leading-6 em tailwind */
            padding: 16px; /* md:p-4 em tailwind */
          }
          
          #leankeep-chat-button-avatar img {
            width: 80px; /* md:h-20 em tailwind */
            height: 80px; /* md:w-20 em tailwind */
          }
          
          #leankeep-chat-button-status {
            width: 20px; /* md:w-5 em tailwind */
            height: 20px; /* md:h-5 em tailwind */
          }
        }
        
        /* Melhorias para dispositivos móveis */
        @media (max-width: 640px) {
          #leankeep-chat-button-bubble {
            width: calc(100vw - 6rem);
            max-width: none;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Criar iframe
      var iframe = document.createElement('iframe');
      iframe.id = 'leankeep-chat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Chat Leankeep';
      container.appendChild(iframe);
      
      // Criar botão com design idêntico ao OpenChatButton do React
      var button = document.createElement('div');
      button.id = 'leankeep-chat-button';
      button.innerHTML = `
        <div id="leankeep-chat-button-bubble">
          Quer ver uma <strong>Demonstração Gratuita</strong> da Leankeep?
        </div>
        <div id="leankeep-chat-button-avatar">
          <img src="https://github.com/pietroschoch.png" alt="Agente de atendimento">
          <span id="leankeep-chat-button-status"></span>
        </div>
      `;
      document.body.appendChild(button);
      
      // Adicionar evento de clique
      button.addEventListener('click', function() {
        console.log("Chat button clicked, opening chat");
        container.style.display = 'block';
        button.style.display = 'none';
        
        // Se for mobile, prevenir rolagem do body
        if (isMobile()) {
          document.body.style.overflow = 'hidden';
        }
      });
      
      // Ouvir mensagens do iframe
      window.addEventListener('message', function(event){
        console.log("Message received:", event.data);
        
        if(event.data === 'closechat') {
          console.log("Closing chat from message");
          container.style.display = 'none';
          button.style.display = 'flex';
          
          // Restaurar rolagem do body
          document.body.style.overflow = '';
        }
      });
      
      // Expor métodos globais
      window.openLeankeepChat = function(){
        console.log("openLeankeepChat method called");
        container.style.display = 'block';
        button.style.display = 'none';
        
        // Se for mobile, prevenir rolagem do body
        if (isMobile()) {
          document.body.style.overflow = 'hidden';
        }
      };
      
      window.closeLeankeepChat = function(){
        console.log("closeLeankeepChat method called");
        container.style.display = 'none';
        button.style.display = 'flex';
        
        // Restaurar rolagem do body
        document.body.style.overflow = '';
      };
      
      console.log("Chat elements created successfully");
    }
    
    // Inicializar quando o DOM estiver pronto
    if(document.readyState === 'loading'){
      console.log("Document still loading, waiting for DOMContentLoaded");
      document.addEventListener('DOMContentLoaded', createChat);
    }else{
      console.log("Document already loaded, creating chat immediately");
      createChat();
    }
  })();