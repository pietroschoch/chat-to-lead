import React from 'react';

export function Avatar() {
  return (
    <div>
      <img
        src="/avatar.png" // Adicione a imagem do avatar
        alt="Avatar"
        className="rounded-full mx-auto mb-4 w-24 h-24"
      />
      <h2 className="text-lg font-bold">Rafael - Leankeep</h2>
      <p className="text-green-500">Online agora</p>
    </div>
  );
}

