"use client";
import React, { useState } from 'react';

export default function Home() {
  const [texto, setTexto] = useState('');
  const [resumo, setResumo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarResumo = async () => {
    if (!texto) return alert("Cole um texto primeiro!");
    setCarregando(true);
    setResumo('');
    
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xai-Q4GwQ3Sm08REumBAzwWzAdZPmckhHGCkv17uVY7WxdAWf3C4JVlqoRqTmIvTe9BAqFNupijStiaCwC4S'
        },
        body: JSON.stringify({
          model: "grok-beta", // O grok-beta é mais estável para web
          messages: [
            { role: "system", content: "Você é um assistente que resume textos de forma clara em português." },
            { role: "user", content: `Resuma o seguinte texto de forma concisa: ${texto}` }
          ],
          temperature: 0
        })
      });

      const data = await response.json();
      if (data.choices) {
        setResumo(data.choices[0].message.content);
      } else {
        alert("Erro na resposta da IA. Verifique os créditos no console da xAI.");
      }
    } catch (error) {
      alert("Erro ao conectar com o Grok.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100 text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Resumo Rápido</h1>
        <p className="text-gray-500 mb-6">IA do Grok integrada com sucesso.</p>
        
        <textarea 
          className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Cole aqui o texto que você deseja resumir..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        ></textarea>
        
        <button 
          onClick={gerarResumo}
          disabled={carregando}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 disabled:bg-gray-400 shadow-md"
        >
          {carregando ? "Processando Resumo..." : "🚀 Gerar Resumo Inteligente"}
        </button>

        {resumo && (
          <div className="mt-8 p-6 bg-blue-50 border-l-8 border-blue-600 rounded-lg animate-fade-in">
            <h2 className="text-lg font-bold text-blue-800 mb-2">Resultado:</h2>
            <p className="text-gray-800 leading-relaxed">{resumo}</p>
          </div>
        )}
      </div>
    </main>
  );
}

