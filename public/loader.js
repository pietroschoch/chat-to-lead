(function(){
    // Evitar múltiplas inicializações
    if(window.openLeankeepChat) return;
    
    // Função para detectar mobile
    function isMobile(){
      return window.innerWidth<768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    // Criar elementos do chat
    function createChat(){
      // Limpar qualquer instância existente
      var old = document.getElementById('leankeep-chat-container');
      if(old && old.parentNode) old.parentNode.removeChild(old);
      
      // Criar container
      var container = document.createElement('div');
      container.id = 'leankeep-chat-container';
      container.style.cssText = 'position:fixed;z-index:99999;display:none;';
      document.body.appendChild(container);
      
      // Adicionar estilos
      var style = document.createElement('style');
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
      
      // Criar iframe
      var iframe = document.createElement('iframe');
      iframe.id = 'leankeep-chat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Chat Leankeep';
      container.appendChild(iframe);
      
      // Ouvir mensagens do iframe
      window.addEventListener('message', function(event){
        if(event.data === 'closechat'){
          container.style.display = 'none';
          // Disparar evento para notificar que o chat foi fechado
          window.dispatchEvent(new Event('leankeepChatClosed'));
        }
        
        if(event.data === 'openchat'){
          container.style.display = 'block';
          // Disparar evento para notificar que o chat foi aberto
          window.dispatchEvent(new Event('leankeepChatOpened'));
        }
      });
      
      // Expor métodos globais
      window.openLeankeepChat = function(){
        container.style.display = 'block';
        // Disparar evento para notificar que o chat foi aberto
        window.dispatchEvent(new Event('leankeepChatOpened'));
      };
      
      window.closeLeankeepChat = function(){
        container.style.display = 'none';
        // Disparar evento para notificar que o chat foi fechado
        window.dispatchEvent(new Event('leankeepChatClosed'));
      };
      
      // Sinalizar que o loader está pronto para uso
      window.dispatchEvent(new Event('leankeepChatReady'));
    }
    
    // Inicializar quando o DOM estiver pronto
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', createChat);
    }else{
      createChat();
    }
  })();