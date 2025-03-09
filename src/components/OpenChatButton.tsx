interface OpenChatButtonProps {
  onClick: () => void;
}

export function OpenChatButton({ onClick }: OpenChatButtonProps) {
  return (
    <div className="flex items-center gap-3 fixed bottom-4 right-4 cursor-pointer group hover:bottom-5 transition-all ease-linear" onClick={onClick}>
      <span className="bg-white p-4 p-r-32 rounded-2xl rounded-br-none text-lg leading-6 w-80 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all ease-linear">
        Quer ver uma <strong>Demonstração Gratuita</strong> da Leankeep?
      </span>
      <div>
        <img className="rounded-2xl h-20 w-20 shadow-lg" src="https://github.com/pietroschoch.png" alt="" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full shadow-lg group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all ease-linear"></span>
      </div>
    </div>
  );
}