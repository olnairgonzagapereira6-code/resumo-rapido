"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [texto, setTexto] = useState('');
  const [resumo, setResumo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [historico, setHistorico] = useState<{t: string, r: string}[]>([]);

  // Carrega o histórico do telemóvel ao abrir o site
  useEffect(() => {
    const salvo = localStorage.getItem('historico_resumos');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  const gerarResumo = async () => {
    if (!texto) return alert("Por favor, cole um texto!");
    setCarregando(true);
    
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
            { role: "system", content: "Resuma em português de forma clara." },
            { role: "user", content: `Resuma: ${texto}` }
          ]
        })
      });

      const data = await response.json();
      const novoResumo = data.choices[0].message.content;
      setResumo(novoResumo);

      // Guarda no histórico (máximo 5 itens)
      const novoHist = [{t: texto.substring(0, 30) + "...", r: novoResumo}, ...historico].slice(0, 5);
      setHistorico(novoHist);
      localStorage.setItem('historico_resumos', JSON.stringify(novoHist));

    } catch (error) {
      alert("Erro na IA.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100 text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 border">
        <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">Resumo Pro + Histórico</h1>
        
        <textarea 
          className="w-full h-32 p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cole o texto aqui..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        
        <button 
          onClick={gerarResumo}
          disabled={carregando}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
        >
          {carregando ? "A resumir..." : "🚀 Gerar e Salvar"}
        </button>

        {resumo && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-sm mb-4">{resumo}</p>
            <button 
              onClick={() => { navigator.clipboard.writeText(resumo); setCopiado(true); setTimeout(()=>setCopiado(false), 2000); }}
              className="w-full py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm"
            >
              {copiado ? "✅ Copiado!" : "📋 Copiar Resumo"}
            </button>
          </div>
        )}

        {historico.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-gray-600 mb-2 border-b pb-1 text-sm">Resumos Recentes (no telemóvel)</h3>
            {historico.map((item, i) => (
              <div key={i} onClick={() => setResumo(item.r)} className="p-2 mb-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 text-xs truncate">
                {item.t}
              </div>
            ))}
            <button onClick={() => {localStorage.removeItem('historico_resumos'); setHistorico([]);}} className="text-red-500 text-[10px] mt-2 underline">Limpar Histórico</button>
          </div>
        )}
      </div>
    </main>
  );
}

