(function(){
    console.log("LeadChat loader executing...");
    
    // Evitar múltiplas inicializações
    if(window.openLeankeepChat) {
      console.log("LeadChat loader already initialized");
      return;
    }
    
    console.log("LeadChat loader initializing...");
    
    // Função para detectar mobile
    function isMobile(){
      return window.innerWidth<768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    // Criar elementos do chat
    function createChat(){
      console.log("Creating chat container and iframe");
      
      // Limpar qualquer instância existente
      var old = document.getElementById('leankeep-chat-container');
      if(old && old.parentNode) {
        old.parentNode.removeChild(old);
        console.log("Removed existing chat container");
      }
      
      // Criar container
      var container = document.createElement('div');
      container.id = 'leankeep-chat-container';
      container.style.cssText = 'position:fixed;z-index:99999;display:none;';
      document.body.appendChild(container);
      console.log("Created and added chat container to body");
      
      // Adicionar estilos
      var style = document.createElement('style');
      style.id = 'leankeep-chat-styles';
      style.textContent = `
        #leankeep-chat-container{
          bottom:0;right:0;
          width:${isMobile()?'100%':'380px'};
          height:${isMobile()?'100%':'550px'};
          box-shadow:0 5px 40px rgba(0,0,0,0.16);
          border-radius:${isMobile()?'0':'16px'};
          overflow:hidden;
          transition:all 0.3s ease;
        }
        #leankeep-chat-iframe{
          width:100%;height:100%;border:none;
          background:#fff;
        }
      `;
      document.head.appendChild(style);
      console.log("Added styles to head");
      
      // Criar iframe
      var iframe = document.createElement('iframe');
      iframe.id = 'leankeep-chat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Chat Leankeep';
      container.appendChild(iframe);
      console.log("Created and added iframe to container");
      
      // Ouvir mensagens do iframe
      window.addEventListener('message', function(event){
        console.log("Message received from iframe:", event.data);
        
        if(event.data === 'closechat'){
          console.log("Close chat message received");
          container.style.display = 'none';
          // Disparar evento para notificar que o chat foi fechado
          var closedEvent = new Event('leankeepChatClosed');
          window.dispatchEvent(closedEvent);
          console.log("leankeepChatClosed event dispatched");
        }
        
        if(event.data === 'openchat'){
          console.log("Open chat message received");
          container.style.display = 'block';
          // Disparar evento para notificar que o chat foi aberto
          var openedEvent = new Event('leankeepChatOpened');
          window.dispatchEvent(openedEvent);
          console.log("leankeepChatOpened event dispatched");
        }
      });
      
      // Expor métodos globais
      window.openLeankeepChat = function(){
        console.log("openLeankeepChat method called");
        container.style.display = 'block';
        // Disparar evento para notificar que o chat foi aberto
        var openedEvent = new Event('leankeepChatOpened');
        window.dispatchEvent(openedEvent);
        console.log("leankeepChatOpened event dispatched");
      };
      
      window.closeLeankeepChat = function(){
        console.log("closeLeankeepChat method called");
        container.style.display = 'none';
        // Disparar evento para notificar que o chat foi fechado
        var closedEvent = new Event('leankeepChatClosed');
        window.dispatchEvent(closedEvent);
        console.log("leankeepChatClosed event dispatched");
      };
      
      // Sinalizar que o loader está pronto para uso
      try {
        console.log("Dispatching leankeepChatReady event");
        var readyEvent = new Event('leankeepChatReady');
        window.dispatchEvent(readyEvent);
        console.log("leankeepChatReady event dispatched");
      } catch (e) {
        console.error("Error dispatching ready event:", e);
      }
    }
    
    // Inicializar quando o DOM estiver pronto
    if(document.readyState === 'loading'){
      console.log("Document still loading, waiting for DOMContentLoaded");
      document.addEventListener('DOMContentLoaded', createChat);
    }else{
      console.log("Document already loaded, creating chat immediately");
      createChat();
    }
    
    // Backup para garantir que o evento seja disparado
    setTimeout(function() {
      if(typeof window.openLeankeepChat === 'function' && !window.leankeepChatReadyFired) {
        console.log("Dispatching delayed leankeepChatReady event");
        window.leankeepChatReadyFired = true;
        var readyEvent = new Event('leankeepChatReady');
        window.dispatchEvent(readyEvent);
      }
    }, 1000);
  })();