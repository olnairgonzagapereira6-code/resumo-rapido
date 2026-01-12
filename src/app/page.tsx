import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Resumo Rápido</h1>
        <p className="text-gray-600 mb-6">
          Cole seu texto abaixo para obter uma síntese inteligente e rápida.
        </p>
        
        <textarea 
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Cole seu texto longo aqui..."
        ></textarea>
        
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
          Gerar Resumo
        </button>
      </div>
    </main>
  );
}

