"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [texto, setTexto] = useState('');
  const [resumo, setResumo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [historico, setHistorico] = useState<{t: string, r: string}[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('historico_resumos');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  const gerarResumo = async () => {
    if (!texto) return alert("Cole um texto!");
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
          messages: [{ role: "system", content: "Resuma em português." }, { role: "user", content: texto }]
        })
      });
      const data = await response.json();
      const novoR = data.choices[0].message.content;
      setResumo(novoR);
      const nH = [{t: texto.substring(0, 20) + "...", r: novoR}, ...historico].slice(0, 5);
      setHistorico(nH);
      localStorage.setItem('historico_resumos', JSON.stringify(nH));
    } catch (e) { alert("Erro na IA."); } finally { setCarregando(false); }
  };

  const falar = () => {
    const m = new SpeechSynthesisUtterance(resumo);
    m.lang = 'pt-BR';
    window.speechSynthesis.speak(m);
  };

  const partilharZap = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent("*Resumo:* " + resumo)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-2xl w-full bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border dark:border-gray-700">
        <h1 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6 text-center italic">RESUMO MASTER</h1>
        
        <textarea 
          className="w-full h-32 p-4 border rounded-2xl mb-4 bg-white dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cole seu texto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        
        <button onClick={gerarResumo} disabled={carregando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl mb-4 shadow-lg transition">
          {carregando ? "⌛ PROCESSANDO..." : "🚀 GERAR RESUMO"}
        </button>

        {resumo && (
          <div className="p-5 bg-white dark:bg-gray-700 border-l-8 border-blue-600 rounded-xl shadow-inner">
            <p className="text-sm leading-relaxed mb-6">{resumo}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={falar} className="py-3 bg-green-500 text-white rounded-xl font-bold">🔊 OUVIR</button>
              <button onClick={partilharZap} className="py-3 bg-green-600 text-white rounded-xl font-bold">📱 WHATSAPP</button>
              <button onClick={() => {navigator.clipboard.writeText(resumo); setCopiado(true); setTimeout(()=>setCopiado(false), 2000);}}
                className="col-span-2 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-bold">
                {copiado ? "✅ COPIADO!" : "📋 COPIAR TEXTO"}
              </button>
            </div>
          </div>
        )}

        {historico.length > 0 && (
          <div className="mt-8 opacity-70">
            <h3 className="text-xs font-bold uppercase mb-3 tracking-widest text-gray-500">Histórico Local</h3>
            {historico.map((h, i) => (
              <div key={i} onClick={() => setResumo(h.r)} className="p-3 mb-2 bg-gray-200 dark:bg-gray-900 rounded-lg text-[10px] truncate cursor-pointer">
                {h.t}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

