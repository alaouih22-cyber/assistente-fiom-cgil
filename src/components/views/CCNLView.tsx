import React, { useState } from 'react';
import {
  CCNL_METALMECCANICI_LEVELS,
  MAGGIORAZIONI_CCNL_METALMECCANICI,
  COMPORTO_CCNL_METALMECCANICI,
  PREAVVISO_CCNL_METALMECCANICI,
  CCNLLevel
} from '../../data/ccnl.js';
import {
  Layers,
  AlertTriangle,
  Clock,
  HeartPulse,
  Coins,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  LogOut,
  Calendar
} from 'lucide-react';

interface CCNLViewProps {
  initialSubTab?: 'livelli' | 'maggiorazioni' | 'comporto' | 'preavviso';
  initialLevelCode?: string;
}

export const CCNLView: React.FC<CCNLViewProps> = ({ initialSubTab, initialLevelCode }) => {
  const [selectedLevel, setSelectedLevel] = useState<CCNLLevel>(() => {
    if (initialLevelCode) {
      const match = CCNL_METALMECCANICI_LEVELS.find((l) => l.code === initialLevelCode);
      if (match) return match;
    }
    return CCNL_METALMECCANICI_LEVELS[1]; // D2 by default
  });

  const [activeSubTab, setActiveSubTab] = useState<'livelli' | 'maggiorazioni' | 'comporto' | 'preavviso'>(
    initialSubTab || 'livelli'
  );

  React.useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
    if (initialLevelCode) {
      const match = CCNL_METALMECCANICI_LEVELS.find((l) => l.code === initialLevelCode);
      if (match) setSelectedLevel(match);
    }
  }, [initialSubTab, initialLevelCode]);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Title & Official Note Card - Compact & Clean */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                CCNL Metalmeccanici Industria Federmeccanica-Assistal
              </h2>
              <p className="text-xs text-slate-500">
                Classificazione professionale a 9 livelli (D1 - A1) • Tabelle retributive e clausole orario
              </p>
            </div>
          </div>

          <a
            href="https://www.federmeccanica.it/ccnl-metalmeccanici.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 border border-emerald-300 bg-emerald-50/60 px-3 py-1.5 rounded-lg transition self-start md:self-auto"
          >
            <span>Portale Ufficiale Federmeccanica</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mandatory context disclaimer */}
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Verifica Contrattuale Obbligatoria:</strong> Il presente CCNL è il riferimento nazionale del settore metalmeccanico. Non presumere l'applicazione automatica senza aver verificato la causale contrattuale sul cedolino paga o sulla lettera di assunzione. L'eventuale <strong>Accordo Integrativo Aziendale CSI Colombella</strong> non è censito automaticamente e deve essere verificato con la FIOM-CGIL Perugia.
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 text-xs sm:text-sm font-bold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('livelli')}
          className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'livelli'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Inquadramento & Minimi (D1 - A1)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maggiorazioni')}
          className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'maggiorazioni'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Maggiorazioni Turni & Straordinari</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comporto')}
          className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'comporto'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Periodo di Comporto Malattia</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preavviso')}
          className={`pb-2.5 px-2 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'preavviso'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Termini di Preavviso</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: Inquadramento e Livelli                           */}
      {/* ======================================================== */}
      {activeSubTab === 'livelli' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Level List */}
          <div className="lg:col-span-5 space-y-1.5">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1 px-1">
              Seleziona Livello Contrattuale
            </div>
            {CCNL_METALMECCANICI_LEVELS.map((lvl) => {
              const isSelected = selectedLevel.code === lvl.code;
              return (
                <button
                  key={lvl.code}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {lvl.code}
                    </span>
                    <div>
                      <div className="text-xs font-bold leading-tight">{lvl.field}</div>
                      <div
                        className={`text-2xs ${
                          isSelected ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        Ex {lvl.exLevel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold">€ {lvl.monthlyBasePay.toFixed(2)}</div>
                    <div
                      className={`text-3xs ${
                        isSelected ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      scatto: +€{lvl.valoreScattoBiennale.toFixed(2)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Detail Card */}
          <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
                    Livello {selectedLevel.code} (Ex {selectedLevel.exLevel})
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {selectedLevel.field}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Minimo Tabellare</span>
                  <div className="text-xl font-black text-emerald-900">
                    € {selectedLevel.monthlyBasePay.toFixed(2)}
                  </div>
                  <span className="text-3xs text-slate-400">mensile per 13 mensilità</span>
                </div>
              </div>

              {/* Scatto biennale per questo livello */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950 block">Aumento Periodico di Anzianità (Scatto Biennale)</span>
                  <span className="text-2xs text-amber-900">Massimo 5 scatti maturabili ogni biennio di anzianità</span>
                </div>
                <div className="text-right font-black text-amber-950 text-sm">
                  € {selectedLevel.valoreScattoBiennale.toFixed(2)} <span className="text-2xs font-normal">/ mese</span>
                </div>
              </div>

              {/* Declaratoria */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">
                  Declaratoria Contrattuale Ufficiale
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                  "{selectedLevel.declaratoria}"
                </div>
              </div>

              {/* Mansioni concrete di stabilimento */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                  Esempi di Mansioni e Profili nello Stabilimento (Nastri & Lamiere)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLevel.esempiMansioniMetalmeccaniche.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-emerald-50/40 border border-emerald-100 p-2 rounded-lg text-xs text-slate-800 flex items-start gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Termini mansioni superiori */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Periodo continuativo per acquisizione definitiva ex art. 2103 c.c.:
                </span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {selectedLevel.terminiMansioniSuperioriMesi} mesi continuativi
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-2xs text-slate-500 gap-2">
              <span>Welfare contrattuale annuale: 200 € netti</span>
              <span>Previdenza Complementare Cometa • Assistenza Sanitaria Metasalute</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Maggiorazioni Turni e Straordinario              */}
      {/* ======================================================== */}
      {activeSubTab === 'maggiorazioni' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Tabelle Maggiorazioni Orarie Contrattuali (Art. 7 Sez. Quarta Titolo III)
            </h3>
            <p className="text-xs text-slate-500">
              Le percentuali si applicano sulla quota oraria della retribuzione (calcolata dividendo la retribuzione mensile fissa per il divisore contrattuale 173).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">Tipo Prestazione Oraria</th>
                  <th className="py-2.5 px-3">Riferimento CCNL</th>
                  <th className="py-2.5 px-3 text-right">Maggiorazione Spettante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MAGGIORAZIONI_CCNL_METALMECCANICI.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{m.nome}</div>
                      <div className="text-2xs text-slate-500">{m.descrizione}</div>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600">{m.riferimentoCCNL}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-black text-xs sm:text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        +{m.percentuale}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-2xs text-slate-600">
            <strong>Divisore orario contrattuale:</strong> Per tutti i lavoratori metalmeccanici a 40 ore settimanali (operai, impiegati e quadri), la paga oraria base è determinata da: <code>Retribuzione Mensile Fissa / 173</code>.
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Comporto Malattia                                */}
      {/* ======================================================== */}
      {activeSubTab === 'comporto' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Periodo di Comporto e Conservazione del Posto di Lavoro per Malattia
            </h3>
            <p className="text-xs text-slate-500">
              Disciplina ex <strong>Art. 2 Sez. Quarta Titolo VI CCNL Metalmeccanici</strong>. Limiti massimi di assenza retribuita per malattia prima della risoluzione del rapporto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPORTO_CCNL_METALMECCANICI.map((c, i) => (
              <div
                key={i}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  {c.anzianitaAnni}
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Comporto ordinario:</span>
                    <span className="font-bold text-slate-900">{c.comportoBreveMesi} mesi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giorni totali:</span>
                    <span className="font-bold">{c.conservazionePostoGiorni} giorni</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Comporto prolungato:</span>
                    <span className="font-bold text-emerald-900">{c.comportoProlungatoMesi} mesi</span>
                  </div>
                </div>

                <div className="text-2xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                  Il comporto prolungato si applica in caso di evento morboso continuativo con ricovero o gravi patologie debitamente documentate.
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-950">
            <strong>Avvertenza Delegati:</strong> Il calcolo del comporto per sommatoria (assenze frazionate in un arco temporale di 36 mesi) richiede l'estratto presenze completo. In prossimità della scadenza del comporto, il lavoratore può richiedere formalmente un periodo di aspettativa non retribuita ex CCNL per evitare il licenziamento.
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: Termini di Preavviso                              */}
      {/* ======================================================== */}
      {activeSubTab === 'preavviso' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Termini Contrattuali di Preavviso di Licenziamento e Dimissioni
            </h3>
            <p className="text-xs text-slate-500">
              Disciplina ex <strong>Art. 1 Sezione Quarta Titolo VII CCNL Metalmeccanici Industria</strong>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">Fascia Livelli</th>
                  <th className="py-2.5 px-3">Fino a 5 anni</th>
                  <th className="py-2.5 px-3">Da 5 a 10 anni</th>
                  <th className="py-2.5 px-3">Oltre 10 anni</th>
                  <th className="py-2.5 px-3">Decorrenza Termine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {PREAVVISO_CCNL_METALMECCANICI.map((p, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-slate-50/50 font-semibold text-slate-900">
                      <td colSpan={5} className="py-2 px-3 text-xs bg-slate-100/70 border-t border-slate-200">
                        {p.fasciaLivelli}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-600 pl-6">Operai:</td>
                      <td className="py-2 px-3 font-bold">{p.finoA5AnniOperai}</td>
                      <td className="py-2 px-3 font-bold">{p.da5A10AnniOperai}</td>
                      <td className="py-2 px-3 font-bold">{p.oltre10AnniOperai}</td>
                      <td className="py-2 px-3 text-2xs text-slate-600">{p.decorrenzaOperai}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-600 pl-6">Impiegati / Quadri:</td>
                      <td className="py-2 px-3 font-bold text-emerald-900">{p.finoA5AnniImpiegati}</td>
                      <td className="py-2 px-3 font-bold text-emerald-900">{p.da5A10AnniImpiegati}</td>
                      <td className="py-2 px-3 font-bold text-emerald-900">{p.oltre10AnniImpiegati}</td>
                      <td className="py-2 px-3 text-2xs text-slate-600">{p.decorrenzaImpiegati}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-2xs text-slate-600 leading-relaxed">
            <strong>Dimissioni Telematiche Obbligatorie:</strong> Ai sensi del D.Lgs. 151/2015, le dimissioni volontarie devono essere trasmesse esclusivamente in modalità telematica tramite il portale del Ministero del Lavoro (SPID/CIE) o con l'assistenza dell'ufficio vertenze e patronato INCA-CGIL.
          </div>
        </div>
      )}
    </div>
  );
};
