import React, { useState, useEffect } from 'react';
import { UNION_DOCUMENT_TEMPLATES, DocumentTemplate } from '../../data/templates.js';
import { User } from '../../types/index.js';
import {
  PenTool,
  Copy,
  Check,
  Download,
  FileCheck,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
  Eye
} from 'lucide-react';

interface DocumentGeneratorViewProps {
  currentUser: User;
  initialTemplateId?: string;
  onSavedToArchive?: () => void;
}

export const DocumentGeneratorView: React.FC<DocumentGeneratorViewProps> = ({
  currentUser,
  initialTemplateId,
  onSavedToArchive
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(
    UNION_DOCUMENT_TEMPLATES.find((t) => t.id === initialTemplateId) || UNION_DOCUMENT_TEMPLATES[0]
  );

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize form default values
  useEffect(() => {
    if (initialTemplateId) {
      const match = UNION_DOCUMENT_TEMPLATES.find((t) => t.id === initialTemplateId);
      if (match) setSelectedTemplate(match);
    }
  }, [initialTemplateId]);

  useEffect(() => {
    const defaults: Record<string, string> = {};
    selectedTemplate.campiRichiesti.forEach((field) => {
      if (field.chiave === 'nomeLavoratore' && !defaults[field.chiave]) {
        defaults[field.chiave] = currentUser.name;
      } else {
        defaults[field.chiave] = field.valoreDefault || '';
      }
    });
    setFormValues(defaults);
    setSavedSuccess(false);
  }, [selectedTemplate, currentUser]);

  const handleInputChange = (key: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  // Generate finalized text by substituting placeholders
  const generateFinalText = () => {
    let result = selectedTemplate.corpoTesto;
    selectedTemplate.campiRichiesti.forEach((field) => {
      const val = formValues[field.chiave] || `[DA COMPLETARE: ${field.nome.toUpperCase()}]`;
      result = result.replaceAll(`{{${field.chiave}}}`, val);
    });
    return result;
  };

  const generatedText = generateFinalText();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.id}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToArchive = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          title: `Bozza: ${selectedTemplate.titolo}`,
          category: 'modulistica',
          description: `Generato il ${new Date().toLocaleDateString()} per ${currentUser.name}. ${selectedTemplate.normativaRiferimento}`,
          visibility: ['admin', 'rsa', 'rsu'].includes(currentUser.role) ? 'sindacale' : 'privato_lavoratore',
          filename: `${selectedTemplate.id}.txt`,
          contentSummary: generatedText.slice(0, 300)
        })
      });

      if (res.ok) {
        setSavedSuccess(true);
        if (onSavedToArchive) onSavedToArchive();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving document to archive:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <PenTool className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Generatore di Bozze & Modulistica Sindacale
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Modelli ufficiali modificabili con riscontro normativo, campi guidati ed esportazione sicura.
          </p>
        </div>

        {/* Template Select Dropdown */}
        <select
          value={selectedTemplate.id}
          onChange={(e) => {
            const found = UNION_DOCUMENT_TEMPLATES.find((t) => t.id === e.target.value);
            if (found) setSelectedTemplate(found);
          }}
          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-red-600 focus:outline-hidden"
        >
          {UNION_DOCUMENT_TEMPLATES.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.titolo}
            </option>
          ))}
        </select>
      </div>

      {/* Warning Notice Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">Avvertenza Deontologica e di Sicurezza:</div>
          <p className="leading-relaxed">
            {selectedTemplate.avvertenzaSindacale}
          </p>
          <div className="text-2xs text-amber-800">
            <strong>Riferimento Normativo:</strong> {selectedTemplate.normativaRiferimento}
          </div>
        </div>
      </div>

      {/* Main Grid: Form input on left, live preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Compila i Dati della Lettera
            </h3>
            <p className="text-2xs text-slate-500">
              I campi aggiorneranno in tempo reale l'anteprima a destra.
            </p>
          </div>

          <div className="space-y-3">
            {selectedTemplate.campiRichiesti.map((field) => (
              <div key={field.chiave}>
                <label className="block text-2xs font-bold uppercase text-slate-500 mb-1">
                  {field.nome}
                </label>
                {field.tipo === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formValues[field.chiave] || ''}
                    onChange={(e) => handleInputChange(field.chiave, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                  />
                ) : (
                  <input
                    type={field.tipo === 'data' ? 'date' : 'text'}
                    value={formValues[field.chiave] || ''}
                    onChange={(e) => handleInputChange(field.chiave, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Anteprima Bozza Formattata
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiato!' : 'Copia Testo'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Scarica TXT</span>
                </button>
              </div>
            </div>

            {/* Document sheet */}
            <div className="mt-4 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-slate-900 max-h-[500px] overflow-y-auto shadow-inner">
              {generatedText}
            </div>
          </div>

          {/* Action footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-2xs text-slate-400">
              La bozza è pronta per essere stampata o depositata presso la sede aziendale.
            </span>

            <button
              onClick={handleSaveToArchive}
              disabled={isSaving}
              className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 disabled:opacity-50 transition flex items-center gap-1.5 shadow-xs"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FolderPlus className="w-4 h-4" />
              )}
              <span>{savedSuccess ? 'Salvato in Archivio!' : 'Salva in Archivio Riservato'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
