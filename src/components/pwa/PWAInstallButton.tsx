import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">App Installata</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`flex items-center gap-2 rounded-lg bg-red-700 text-white font-medium hover:bg-red-800 transition shadow-sm active:scale-95 ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
        }`}
        title="Installa l'app Assistente Sindacale sul dispositivo"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Installa App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 text-red-800 font-medium hover:bg-red-100 transition ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Installa su iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">Installa su iPhone o iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Per aggiungere l'applicazione alla schermata Home di iOS:</p>
                <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-red-600 bg-red-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">1</span>
                  <span>Tocca l'icona <strong>Condividi</strong> (il quadrato con la freccia verso l'alto in Safari).</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-red-600 bg-red-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">2</span>
                  <span>Scorri l'elenco delle azioni e seleziona <strong>"Aggiungi alla schermata Home"</strong>.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-red-600 bg-red-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">3</span>
                  <span>Conferma premendo <strong>"Aggiungi"</strong> in alto a destra.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Ho capito
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert("Per installare l'app: clicca sull'icona di installazione nella barra degli indirizzi del browser oppure dal menu 'Installa applicazione'.")}
      className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-700 font-medium px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50 transition"
      title="PWA pronta all'installazione"
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>Installa Web App</span>
    </button>
  );
};
