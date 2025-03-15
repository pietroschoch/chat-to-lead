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
        #leankeep-chat-button{
          position:fixed;
          bottom:20px;right:20px;
          width:60px;height:60px;
          background:#4CAF50;
          border-radius:50%;
          display:flex;
          justify-content:center;
          align-items:center;
          cursor:pointer;
          box-shadow:0 4px 8px rgba(0,0,0,0.2);
          z-index:99998;
          transition:all 0.3s ease;
        }
        #leankeep-chat-button:hover{
          transform:scale(1.1);
        }
      `;
      document.head.appendChild(style);
      
      // Criar iframe
      var iframe = document.createElement('iframe');
      iframe.id = 'leankeep-chat-iframe';
      iframe.src = 'https://leankeep-lead-chat.netlify.app/';
      iframe.title = 'Chat Leankeep';
      container.appendChild(iframe);
      
      // Criar botão
      var button = document.createElement('div');
      button.id = 'leankeep-chat-button';
      button.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>';
      document.body.appendChild(button);
      
      // Adicionar eventos
      button.onclick = function(){
        container.style.display = 'block';
        button.style.display = 'none';
      };
      
      // Ouvir mensagens do iframe
      window.addEventListener('message', function(event){
        if(event.data === 'closechat'){
          container.style.display = 'none';
          button.style.display = 'flex';
        }
      });
      
      // Expor método global
      window.openLeankeepChat = function(){
        container.style.display = 'block';
        button.style.display = 'none';
      };
      
      window.closeLeankeepChat = function(){
        container.style.display = 'none';
        button.style.display = 'flex';
      };
    }
    
    // Inicializar quando o DOM estiver pronto
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', createChat);
    }else{
      createChat();
    }
  })();