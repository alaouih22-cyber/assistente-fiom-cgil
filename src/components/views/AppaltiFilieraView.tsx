import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  Briefcase,
  Building,
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Users,
  Search
} from 'lucide-react';

export interface ContractorContract {
  id: string;
  contractorName: string;
  activityType: string;
  ccnlApplied: string;
  isPirateContract: boolean;
  workerCount: number;
  hasSocialClause: boolean;
  hasDuvri: boolean;
  hasValidDurc: boolean;
  notes: string;
  status: 'conforme' | 'anomalia_segnalata' | 'diffida_inviata';
  createdAt: string;
}

const STORAGE_KEY = 'fiom_contractors_data';

export const AppaltiFilieraView: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'registro' | 'nuovo' | 'diffida'>('registro');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [contractors, setContractors] = useState<ContractorContract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Form State
  const [contractorName, setContractorName] = useState('');
  const [activityType, setActivityType] = useState('Manutenzione Meccanica / Pulizie Industriali');
  const [ccnlApplied, setCcnlApplied] = useState('CCNL Metalmeccanici Industria Federmeccanica');
  const [isPirateContract, setIsPirateContract] = useState(false);
  const [workerCount, setWorkerCount] = useState(5);
  const [hasSocialClause, setHasSocialClause] = useState(true);
  const [hasDuvri, setHasDuvri] = useState(true);
  const [hasValidDurc, setHasValidDurc] = useState(true);
  const [contractorNotes, setContractorNotes] = useState('');

  // Form Diffida
  const [diffidaContractor, setDiffidaContractor] = useState('');
  const [diffidaSubject, setDiffidaSubject] = useState(
    'Mancato pagamento retribuzioni lavoratori in appalto e attivazione della responsabilità solidale del committente ex art. 29 D.Lgs. 276/2003 e art. 1676 c.c.'
  );
  const [diffidaDetails, setDiffidaDetails] = useState(
    'Si segnala che i dipendenti della ditta appaltatrice impiegati presso lo stabilimento non hanno percepito le ultime 2 mensilità retributive e i relativi ratei. Si intima il pagamento diretto da parte del Committente.'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contractors));
    } catch (e) {
      console.error('Error saving contractors', e);
    }
  }, [contractors]);

  const handleSaveContractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName.trim()) {
      alert('Inserire la ragione sociale dell\'appaltatore.');
      return;
    }

    const newContractor: ContractorContract = {
      id: `contr_${Date.now()}`,
      contractorName: contractorName.trim(),
      activityType,
      ccnlApplied,
      isPirateContract,
      workerCount: Number(workerCount),
      hasSocialClause,
      hasDuvri,
      hasValidDurc,
      notes: contractorNotes.trim(),
      status: isPirateContract || !hasValidDurc || !hasDuvri ? 'anomalia_segnalata' : 'conforme',
      createdAt: new Date().toISOString()
    };

    setContractors((prev) => [newContractor, ...prev]);
    setActiveTab('registro');
    alert('Appalto inserito nel monitoraggio di filiera.');
  };

  // Generatore Diffida Responsabilità Solidale
  const generateDiffidaNotice = () => {
    return `SPETT.LE DIREZIONE AZIENDALE COMMITTENTE
${currentCompany.name}
${currentCompany.facility}

E, P.C.: ALLA DITTA APPALTATRICE
${diffidaContractor || '[Ragione Sociale Impresa Appaltatrice]'}

INVIO A MEZZO PEC

OGGETTO: Attivazione della Responsabilità Solidale ex art. 29, comma 2, D.Lgs. 10 settembre 2003, n. 276 e art. 1676 Codice Civile – Diffida formale e richiesta urgente di incontro sindacale.

La scrivente Segreteria Territoriale FIOM-CGIL, congiuntamente alla Rappresentanza Sindacale Unitaria (RSU) dello stabilimento in indirizzo,

PREMESSO CHE
1. Presso l'unità produttiva di ${currentCompany.name} operano in appalto i dipendenti dell'impresa ${
      diffidaContractor || '[Impresa Appaltatrice]'
    } per lo svolgimento di attività di ${activityType};
2. L'art. 29, comma 2, del D.Lgs. 276/2003 sancisce la responsabilità solidale del Committente con l'Appaltatore entro il limite di due anni dalla cessazione dell'appalto, per i trattamenti retributivi, le quote di TFR e i contributi previdenziali/assicurativi dovuti in relazione al periodo di esecuzione del contratto di appalto;
3. L'art. 1676 c.c. riconosce espressamente l'azione diretta dei lavoratori verso il committente per conseguire quanto è loro dovuto per l'attività prestata;

CONTESTA E SEGNALA QUANTO SEGUE:
${diffidaDetails}

Tanto premesso, la scrivente Organizzazione Sindacale

INTIMA E DIFFIDA
il Committente ${currentCompany.name} a sospendere in via cautelativa i pagamenti dei corrispettivi contrattuali spettanti alla ditta appaltatrice e a provvedere, in via solidale e con effetto liberatorio, al pagamento diretto delle retribuzioni arretrate e dei relativi contributi previdenziali in favore dei lavoratori interessati.

RICHIEDE ALTRESI'
un incontro urgente con la Direzione Aziendale da tenersi entro e non oltre 5 giorni lavorativi dal ricevimento della presente, con riserva in difetto di adire i competenti organi ispettivi dell'INL e l'Autorità Giudiziaria.

Distinti saluti.

Luogo e data: ${currentCompany.location.split(',')[1]?.trim() || 'Stabilimento'}, lì ${new Date().toLocaleDateString('it-IT')}

Per la Segreteria FIOM-CGIL e la RSU di Stabilimento:
RSU FIOM-CGIL / RSA - Stabilimento di ${currentCompany.name}`;
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Istituzionale FIOM */}
      <div className="bg-white border-l-4 border-red-700 shadow-xs rounded-xl p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                Modulo 5 • Appalti & Filiera
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-red-700" />
                {currentCompany.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Filiera Produttiva & Cambio Appalti
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verifica del corretto CCNL applicato per contrastare il dumping contrattuale, tutela della clausola sociale, conformità DUVRI/DURC e attivazione della Responsabilità Solidale (Art. 29 D.Lgs. 276/03 & Art. 1676 c.c.).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'registro'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Mappatura Appalti ({contractors.length})
            </button>
            <button
              onClick={() => setActiveTab('nuovo')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'nuovo'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              Nuovo Appalto
            </button>
            <button
              onClick={() => setActiveTab('diffida')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'diffida'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              Diffida Resp. Solidale
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Mappatura Registro Appalti */}
      {activeTab === 'registro' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registro Appalti e Subappalti di Sito
              </h3>
              <p className="text-xs text-slate-500">
                Monitoraggio della filiera attiva presso {currentCompany.name} ({currentCompany.facility})
              </p>
            </div>
            <button
              onClick={() => setActiveTab('nuovo')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Aggiungi Appalto
            </button>
          </div>

          {contractors.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-700">Nessun appalto o subappalto registrato</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                La mappa di filiera è pulita. Inserisci le imprese terze operanti in stabilimento per verificare CCNL, clausola sociale e DURC.
              </p>
              <button
                onClick={() => setActiveTab('nuovo')}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Censisci la Prima Impresa in Appalto
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contractors.map((c) => (
                <div
                  key={c.id}
                  className="border border-slate-200 rounded-xl p-4 bg-white hover:border-red-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        c.isPirateContract
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {c.isPirateContract ? '⚠️ CCNL Non Conforme' : 'CCNL Leader'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{c.contractorName}</h4>
                      <span className="text-xs text-slate-500">({c.activityType} • {c.workerCount} addetti)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setDiffidaContractor(c.contractorName);
                          setActiveTab('diffida');
                        }}
                        className="text-xs font-bold text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors"
                      >
                        Avvia Diffida
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Vuoi rimuovere questo appalto dal registro?')) {
                            setContractors((prev) => prev.filter((item) => item.id !== c.id));
                          }
                        }}
                        className="text-slate-400 hover:text-red-700 p-1"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-100 text-slate-600">
                    <div><strong>CCNL:</strong> {c.ccnlApplied}</div>
                    <div><strong>Clausola Sociale:</strong> {c.hasSocialClause ? 'Garantita' : 'Non formalizzata'}</div>
                    <div><strong>DUVRI:</strong> {c.hasDuvri ? 'Sottoscritto' : 'Mancante'}</div>
                    <div><strong>DURC:</strong> {c.hasValidDurc ? 'Regolare' : 'Irregolare'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Nuovo Appalto */}
      {activeTab === 'nuovo' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-red-700" />
            Censimento & Verifica Conformità Appalto
          </h3>

          <form onSubmit={handleSaveContractor} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ragione Sociale Impresa Appaltatrice *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. MetalService S.r.l. / Pulieco Coop."
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attività Svolta in Stabilimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Logistica interna, Cesoie ausiliarie, Imballo"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CCNL Applicato ai Dipendenti in Appalto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. CCNL Metalmeccanici Industria / Multiservizi"
                  value={ccnlApplied}
                  onChange={(e) => setCcnlApplied(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numero Lavoratori Impiegati nel Sito
                </label>
                <input
                  type="number"
                  min="1"
                  value={workerCount}
                  onChange={(e) => setWorkerCount(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 font-bold"
                />
              </div>
            </div>

            {/* Checkbox di Controllo Garanzie Sindacali */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isPirateContract}
                  onChange={(e) => setIsPirateContract(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="text-red-700">
                  ⚠️ Si sospetta applicazione di Contratto Pirata / Dumping retributivo rispetto al CCNL Metalmeccanici
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={hasSocialClause}
                  onChange={(e) => setHasSocialClause(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span>Clausola Sociale di riassorbimento garantita in caso di cambio appalto</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={hasDuvri}
                  onChange={(e) => setHasDuvri(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span>DUVRI allegato e interferenze rischi concordate con RLS (Art. 26 D.Lgs. 81/08)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={hasValidDurc}
                  onChange={(e) => setHasValidDurc(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span>DURC (Documento Unico di Regolarità Contributiva) valido acquisito</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note e Segnalazioni dei Delegati di Reparto
              </label>
              <textarea
                rows={2}
                placeholder="Eventuali ritardi pagamenti, mancate pause o orari difformi..."
                value={contractorNotes}
                onChange={(e) => setContractorNotes(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registra nel Monitoraggio di Filiera
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Diffida Responsabilità Solidale */}
      {activeTab === 'diffida' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-700" />
              Azionamento Responsabilità Solidale (Art. 29 D.Lgs. 276/03)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ditta Appaltatrice Inadempiente *
                </label>
                <input
                  type="text"
                  placeholder="Nome impresa appalto"
                  value={diffidaContractor}
                  onChange={(e) => setDiffidaContractor(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oggetto della Diffida
                </label>
                <input
                  type="text"
                  value={diffidaSubject}
                  onChange={(e) => setDiffidaSubject(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inadempimento e Crediti dei Lavoratori Contestati *
                </label>
                <textarea
                  rows={4}
                  value={diffidaDetails}
                  onChange={(e) => setDiffidaDetails(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600 font-sans"
                />
              </div>

              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-900 space-y-1">
                <p className="font-bold">Principio giuridico inderogabile:</p>
                <p>
                  Ai sensi dell'art. 29 D.Lgs. 276/2003 e dell'art. 1676 c.c., il Committente ({currentCompany.name}) è solidalmente responsabile con l'appaltatore per tutte le somme retributive e contributive omesse fino a 2 anni dopo la cessazione del contratto d'appalto.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Diffida Formale al Committente e Appaltatore
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(generateDiffidaNotice(), 'diffida_draft')}
                  className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'diffida_draft' ? 'Copiato!' : 'Copia'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Stampa</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-[460px] overflow-y-auto">
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
                {generateDiffidaNotice()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
