"use client";
import React, { useState } from 'react';

export default function Home() {
  const [texto, setTexto] = useState('');
  const [resumo, setResumo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const gerarResumo = async () => {
    if (!texto) return alert("Por favor, cole um texto!");
    setCarregando(true);
    setResumo('');
    setCopiado(false);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Você é um assistente que resume textos de forma clara em português." },
            { role: "user", content: `Resuma o seguinte texto de forma concisa: ${texto}` }
          ]
        })
      });

      const data = await response.json();
      setResumo(data.choices[0].message.content);
    } catch (error) {
      alert("Erro ao conectar com a IA.");
    } finally {
      setCarregando(false);
    }
  };

  const copiarTexto = () => {
    navigator.clipboard.writeText(resumo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-2 text-center">Resumo Rápido</h1>
        <p className="text-center text-gray-500 mb-6 italic text-sm">IA Gratuita (Groq) Ativada</p>
        
        <textarea 
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Cole seu texto longo aqui..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        ></textarea>
        
        <button 
          onClick={gerarResumo}
          disabled={carregando}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:bg-gray-400"
        >
          {carregando ? "Processando..." : "🚀 Gerar Resumo"}
        </button>

        {resumo && (
          <div className="mt-8 p-6 bg-blue-50 border-l-8 border-blue-600 rounded-lg relative">
            <h2 className="text-lg font-bold text-blue-800 mb-2">Resumo:</h2>
            <p className="text-gray-800 leading-relaxed mb-4">{resumo}</p>
            <button 
              onClick={copiarTexto}
              className="w-full bg-white border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition"
            >
              {copiado ? "✅ Copiado!" : "📋 Copiar Texto"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
