// src/components/OpenChatButton.tsx
interface OpenChatButtonProps {
  onClick: () => void;
}

export function OpenChatButton({ onClick }: OpenChatButtonProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3 fixed bottom-4 right-4 cursor-pointer group hover:bottom-5 transition-all ease-linear" onClick={onClick}>
      {/* Mostra o texto em todas as telas, mas com tamanho adaptado */}
      <span className="bg-white p-2 md:p-4 rounded-2xl rounded-br-none text-xs md:text-lg leading-tight md:leading-6 w-44 sm:w-64 md:w-80 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all ease-linear">
        Quer ver uma <strong>Demonstração Gratuita</strong> da Leankeep?
      </span>
      <div className="relative">
        <img className="rounded-2xl h-14 w-14 md:h-20 md:w-20 shadow-lg" src="https://github.com/pietroschoch.png" alt="" />
        <span className="absolute -top-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-500 rounded-full shadow-lg group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all ease-linear"></span>
      </div>
    </div>
  );
}