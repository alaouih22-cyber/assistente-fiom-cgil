import React, { useState } from 'react';
import { NORMATIVA_DATABASE, NormativaItem } from '../../data/normativa.js';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  Info
} from 'lucide-react';

interface NormativaViewProps {
  initialSelectedNormaId?: string;
}

export const NormativaView: React.FC<NormativaViewProps> = ({ initialSelectedNormaId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<NormativaItem | null>(null);

  React.useEffect(() => {
    if (initialSelectedNormaId) {
      const found = NORMATIVA_DATABASE.find(n => n.id === initialSelectedNormaId);
      if (found) setSelectedItem(found);
    }
  }, [initialSelectedNormaId]);

  const filteredNorme = NORMATIVA_DATABASE.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.titolo.toLowerCase().includes(q) ||
      item.riassunto.toLowerCase().includes(q) ||
      item.testoPertinente.toLowerCase().includes(q) ||
      item.paroleChiave.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Biblioteca Giuridica e Normativa del Lavoro</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fonti legislative ufficiali verificate su <strong>Normattiva</strong>, <strong>Gazzetta Ufficiale</strong> e <strong>Ministero del Lavoro</strong>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca art. 7, 81/08, mansioni, orari..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Normative List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNorme.map((norma) => (
          <div
            key={norma.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:border-red-300 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {norma.articoloSezione}
                </span>

                <span className="flex items-center gap-1 text-3xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {norma.statoVerifica}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 hover:text-red-700 transition">
                {norma.titolo}
              </h3>

              <div className="flex items-center gap-3 text-2xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  {norma.enteUfficiale}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Verifica: {norma.ultimaVerifica}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {norma.riassunto}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {norma.paroleChiave.map((tag, i) => (
                  <span
                    key={i}
                    className="text-3xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(norma)}
                className="text-xs font-bold text-red-700 hover:text-red-900 transition flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                Consulta testo e guida
              </button>

              <a
                href={norma.urlVerificato}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xs font-semibold text-slate-500 hover:text-red-700 transition flex items-center gap-1"
              >
                <span>Fonte Ufficiale</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}

        {filteredNorme.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
            Nessun riferimento normativo trovato per "{searchTerm}". Prova con "art. 7", "sicurezza" o "mansioni".
          </div>
        )}
      </div>

      {/* Modal / Details Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-2xs font-bold uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {selectedItem.articoloSezione}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedItem.titolo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Ente e Fonte Ufficiale Verificata
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{selectedItem.enteUfficiale}</span>
                  <a
                    href={selectedItem.urlVerificato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:underline flex items-center gap-1 text-2xs font-bold"
                  >
                    Apri su Normattiva <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Estratto Ufficiale del Dispositivo Normativo
                </div>
                <div className="bg-red-50/40 border-l-4 border-red-700 p-3 rounded-r-xl italic font-serif text-slate-800 leading-relaxed">
                  "{selectedItem.testoPertinente}"
                </div>
              </div>

              <div>
                <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Spiegazione e Applicazione Sindacale
                </div>
                <p className="leading-relaxed text-slate-700">
                  {selectedItem.riassunto}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-2xs text-amber-900">
                <strong>Avvertenza FIOM:</strong> L'applicazione del precetto normativo generale deve essere sempre coordinata con le pattuizioni del CCNL Metalmeccanici Industria e gli eventuali accordi aziendali vigenti nello stabilimento CSI Colombella.
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Chiudi Scheda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
