import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Plus,
  Trash2,
  Building,
  ShieldCheck,
  Megaphone,
  Briefcase
} from 'lucide-react';

export interface UnionAssembly {
  id: string;
  date: string;
  durationHours: number;
  agenda: string;
  shiftsInvolved: string;
  locationRoom: string;
  externalFiomOfficers: string;
  status: 'programmata' | 'svolta' | 'annullata';
  createdAt: string;
}

export interface UnionPermit {
  id: string;
  delegateName: string;
  delegateRole: 'rsu' | 'rsa' | 'rls';
  date: string;
  hoursRequested: number;
  timeStart: string;
  timeEnd: string;
  legalBasis: 'art23' | 'art24'; // art. 23 (espletamento mandato) o art. 24 (partecipazione a trattative/congressi)
  reason: string;
  createdAt: string;
}

const STORAGE_ASSEMBLIES_KEY = 'fiom_assemblies_data';
const STORAGE_PERMITS_KEY = 'fiom_permits_data';

export const UnionRightsAssemblyView: React.FC = () => {
  const { currentCompany } = useCompany();

  const [activeTab, setActiveTab] = useState<'assemblee' | 'convocazione' | 'permessi'>('assemblee');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Assemblee State
  const [assemblies, setAssemblies] = useState<UnionAssembly[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ASSEMBLIES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Permessi State
  const [permits, setPermits] = useState<UnionPermit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PERMITS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Form Convocazione Assemblea
  const [assemblyDate, setAssemblyDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [assemblyHours, setAssemblyHours] = useState(1);
  const [assemblyAgenda, setAssemblyAgenda] = useState(
    '1. Andamento produttivo e carichi di lavoro;\n2. Rinnovo contrattuale e salario di produttività (PdR);\n3. Salute e sicurezza sul lavoro (D.Lgs. 81/08);\n4. Varie ed eventuali.'
  );
  const [shiftsInvolved, setShiftsInvolved] = useState(
    '1° Turno (ore 10:00 - 11:00); 2° Turno (ore 14:00 - 15:00); 3° Turno (ore 22:00 - 23:00)'
  );
  const [locationRoom, setLocationRoom] = useState(
    'Locale mensa aziendale / Sala riunioni sindacale di stabilimento'
  );
  const [externalOfficers, setExternalOfficers] = useState(
    'Funzionari territoriali della Segreteria FIOM-CGIL'
  );

  // Form Permesso RSU/RSA
  const [delegateName, setDelegateName] = useState('');
  const [delegateRole, setDelegateRole] = useState<'rsu' | 'rsa' | 'rls'>('rsu');
  const [permitDate, setPermitDate] = useState(new Date().toISOString().split('T')[0]);
  const [permitHours, setPermitHours] = useState(4);
  const [permitStart, setPermitStart] = useState('08:00');
  const [permitEnd, setPermitEnd] = useState('12:00');
  const [permitLegalBasis, setPermitLegalBasis] = useState<'art23' | 'art24'>('art23');
  const [permitReason, setPermitReason] = useState(
    'Espletamento del mandato sindacale e consultazione delle lavoratrici e dei lavoratori di stabilimento'
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ASSEMBLIES_KEY, JSON.stringify(assemblies));
    } catch (e) {
      console.error('Error saving assemblies', e);
    }
  }, [assemblies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PERMITS_KEY, JSON.stringify(permits));
    } catch (e) {
      console.error('Error saving permits', e);
    }
  }, [permits]);

  // Calcolo Monte Ore Assemblea (10 ore annue pro capite ex art. 20 L. 300/70)
  const MAX_HOURS_ANNUAL = 10;
  const currentYear = new Date().getFullYear();
  const consumedHours = assemblies
    .filter((a) => a.date.startsWith(String(currentYear)) && a.status !== 'annullata')
    .reduce((sum, a) => sum + Number(a.durationHours || 0), 0);
  const remainingHours = Math.max(0, MAX_HOURS_ANNUAL - consumedHours);

  // Generatore Lettera Convocazione Assemblea
  const generateAssemblyNotice = () => {
    return `ALLA DIREZIONE AZIENDALE
${currentCompany.name}
${currentCompany.facility}

INVIO A MEZZO PEC / CONSEGNA A MANO

OGGETTO: Comunicazione formale di convocazione assemblea retribuita dei lavoratori ai sensi dell'art. 20 della Legge 20 maggio 1970, n. 300 e del vigente CCNL Metalmeccanici Industria.

La scrivente Rappresentanza Sindacale Unitaria (RSU FIOM-CGIL) / RSA dello stabilimento in indirizzo,

COMUNICA CHE

in data ${assemblyDate ? new Date(assemblyDate).toLocaleDateString('it-IT') : '[Data Assemblea]'} è indetta un'assemblea retribuita di tutte le lavoratrici e di tutti i lavoratori dell'unità produttiva per la durata di ore ${assemblyHours} (a valere sul monte ore annuo pro capite di cui all'art. 20 L. 300/70), articolata secondo i seguenti scaglioni orari:

${shiftsInvolved}

ORDINE DEL GIORNO:
${assemblyAgenda}

Ai sensi dell'art. 27 della Legge 300/1970, si richiede la messa a disposizione del seguente locale aziendale idoneo all'interno dell'unità produttiva:
${locationRoom}

Si comunica altresì che, ai sensi dell'art. 20, comma 3, della Legge 300/1970, all'assemblea parteciperanno i seguenti dirigenti sindacali esterni:
${externalOfficers || 'Delegazione della FIOM-CGIL territoriale'}.

Si richiede conferma della ricezione della presente e dell'avvenuta predisposizione del locale indicato.

Distinti saluti.

Luogo e data: ${currentCompany.location.split(',')[1]?.trim() || 'Stabilimento'}, lì ${new Date().toLocaleDateString('it-IT')}

Per la Rappresentanza Sindacale:
RSU FIOM-CGIL / RSA - Stabilimento di ${currentCompany.name}`;
  };

  // Generatore Comunicazione Permesso Sindacale
  const generatePermitNotice = () => {
    const basisLabel =
      permitLegalBasis === 'art23'
        ? 'art. 23 Legge 300/1970 (permessi retribuiti per espletamento del mandato sindacale)'
        : 'art. 24 Legge 300/1970 (permessi per partecipazione a trattative sindacali / organi direttivi)';

    return `ALLA DIREZIONE AZIENDALE
UFFICIO DEL PERSONALE E RELAZIONI SINDACALI
${currentCompany.name}
${currentCompany.facility}

OGGETTO: Comunicazione preventiva di fruizione di permesso sindacale retribuito ai sensi dell'${basisLabel} e del CCNL Metalmeccanici Industria.

Il/La sottoscritto/a ${delegateName || '[Nome e Cognome Delegato/a]'}, in qualità di componente ${
      delegateRole.toUpperCase()
    } FIOM-CGIL presso lo stabilimento in indirizzo,

COMUNICA CHE

in data ${new Date(permitDate).toLocaleDateString('it-IT')} usufruirà di n. ${permitHours} ore di permesso sindacale retribuito dalle ore ${permitStart} alle ore ${permitEnd}.

MOTIVAZIONE:
${permitReason}

La presente comunicazione viene inoltrata con il dovuto preavviso contrattuale di 24 ore previsto dalle disposizioni collettive vigenti.

Distinti saluti.

Data di trasmissione: ${new Date().toLocaleDateString('it-IT')}

Firma del Delegato: _______________________

RSU FIOM-CGIL / RSA - Stabilimento di ${currentCompany.name}`;
  };

  const handleSaveAssembly = (e: React.FormEvent) => {
    e.preventDefault();
    const newAss: UnionAssembly = {
      id: `ass_${Date.now()}`,
      date: assemblyDate,
      durationHours: Number(assemblyHours),
      agenda: assemblyAgenda,
      shiftsInvolved,
      locationRoom,
      externalFiomOfficers: externalOfficers,
      status: 'programmata',
      createdAt: new Date().toISOString()
    };
    setAssemblies((prev) => [newAss, ...prev]);
    setActiveTab('assemblee');
    alert('Assemblea registrata nel piano annuale dello stabilimento.');
  };

  const handleSavePermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateName.trim()) {
      alert('Inserire il nome del delegato richiedente.');
      return;
    }
    const newPerm: UnionPermit = {
      id: `perm_${Date.now()}`,
      delegateName: delegateName.trim(),
      delegateRole,
      date: permitDate,
      hoursRequested: Number(permitHours),
      timeStart: permitStart,
      timeEnd: permitEnd,
      legalBasis: permitLegalBasis,
      reason: permitReason,
      createdAt: new Date().toISOString()
    };
    setPermits((prev) => [newPerm, ...prev]);
    alert('Permesso sindacale registrato e pronto per la trasmissione.');
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
                Modulo 3 • Titolo III L. 300/1970
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-red-700" />
                {currentCompany.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Diritti Sindacali & Assemblee Retribuite
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Monitoraggio delle 10 ore annue pro capite (Art. 20 L. 300/70), convocazione formale dell'assemblea con locali idonei (Art. 27) e gestione dei permessi sindacali retribuiti RSU/RSA (Artt. 23-24).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('assemblee')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'assemblee'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Monte Ore & Storico
            </button>
            <button
              onClick={() => setActiveTab('convocazione')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'convocazione'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              Indici Assemblea
            </button>
            <button
              onClick={() => setActiveTab('permessi')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'permessi'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Permessi RSU/RSA
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Monte Ore & Registro Assemblee */}
      {activeTab === 'assemblee' && (
        <div className="space-y-6">
          {/* Card Riepilogo Monte Ore */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block">
                Monte Ore Annuo Contrattuale
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">{MAX_HOURS_ANNUAL} h</span>
                <span className="text-xs text-slate-500">pro capite / anno {currentYear}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Diritto inderogabile ex art. 20 L. 300/1970 retribuito al 100%.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block">
                Ore Assemblea Consumate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-red-700">{consumedHours} h</span>
                <span className="text-xs text-slate-500">in {assemblies.length} assemblee</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Ore già fruite dal personale dello stabilimento nell'anno in corso.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-xs">
              <span className="text-xs uppercase font-bold text-red-900 block">
                Ore Residue Disponibili
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-red-800">{remainingHours} h</span>
                <span className="text-xs text-red-700 font-semibold">ancora da convocare</span>
              </div>
              <p className="text-[11px] text-red-900/80 mt-2">
                La RSU può indire ulteriori assemblee entro il limite contrattuale.
              </p>
            </div>
          </div>

          {/* Registro Assemblee */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registro Assemblee di Stabilimento ({currentYear})
                </h3>
                <p className="text-xs text-slate-500">
                  Assemblee sindacali convocate dalla RSU FIOM-CGIL presso {currentCompany.name}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('convocazione')}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Indici Nuova Assemblea
              </button>
            </div>

            {assemblies.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700">Nessuna assemblea registrata per il {currentYear}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Il monte ore di 10 ore è integralmente a disposizione delle lavoratrici e dei lavoratori.
                </p>
                <button
                  onClick={() => setActiveTab('convocazione')}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Prepara Convocazione Formale
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {assemblies.map((ass) => (
                  <div
                    key={ass.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:border-red-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-xs border border-red-200">
                          {ass.durationHours} ORA/E
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          Assemblea del {new Date(ass.date).toLocaleDateString('it-IT')}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Vuoi rimuovere questa assemblea dallo storico?')) {
                            setAssemblies((prev) => prev.filter((a) => a.id !== ass.id));
                          }
                        }}
                        className="text-slate-400 hover:text-red-700 p-1"
                        title="Elimina assemblea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="font-semibold text-slate-900 mb-0.5">Ordine del Giorno:</p>
                      <pre className="text-xs font-sans whitespace-pre-wrap text-slate-700">{ass.agenda}</pre>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-[11px] text-slate-600">
                        <span><strong>Turni:</strong> {ass.shiftsInvolved}</span>
                        <span><strong>Locale:</strong> {ass.locationRoom}</span>
                        <span><strong>Dirigenti esterni:</strong> {ass.externalFiomOfficers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Modulo Convocazione Assemblea */}
      {activeTab === 'convocazione' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-red-700" />
              Parametri Convocazione Assemblea
            </h3>

            <form onSubmit={handleSaveAssembly} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data di Svolgimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={assemblyDate}
                    onChange={(e) => setAssemblyDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500">Preavviso min. 2 giorni lav.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durata Assemblea (Ore) *
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="4"
                    step="0.5"
                    required
                    value={assemblyHours}
                    onChange={(e) => setAssemblyHours(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Residuo annuo: {remainingHours}h</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Articolazione Oraria per Turno di Lavoro *
                </label>
                <input
                  type="text"
                  required
                  value={shiftsInvolved}
                  onChange={(e) => setShiftsInvolved(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Locale Aziendale Richiesto (Art. 27 L. 300/70) *
                </label>
                <input
                  type="text"
                  required
                  value={locationRoom}
                  onChange={(e) => setLocationRoom(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ordine del Giorno (OdG) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={assemblyAgenda}
                  onChange={(e) => setAssemblyAgenda(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dirigenti Sindacali Esterni Partecipanti (Art. 20 c. 3 L. 300/70)
                </label>
                <input
                  type="text"
                  value={externalOfficers}
                  onChange={(e) => setExternalOfficers(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salva nel Piano Assemblee
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Lettera Formale di Convocazione alla Direzione
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(generateAssemblyNotice(), 'notice_draft')}
                  className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'notice_draft' ? 'Copiato!' : 'Copia'}</span>
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
                {generateAssemblyNotice()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Gestione Permessi Sindacali Retribuiti RSU/RSA */}
      {activeTab === 'permessi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-700" />
              Modulo Fruizione Permesso Sindacale Retribuito
            </h3>

            <form onSubmit={handleSavePermit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominativo Delegato/a *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome e Cognome delegato RSU"
                    value={delegateName}
                    onChange={(e) => setDelegateName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruolo Sindacale *
                  </label>
                  <select
                    value={delegateRole}
                    onChange={(e) => setDelegateRole(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-600"
                  >
                    <option value="rsu">Componente RSU FIOM-CGIL</option>
                    <option value="rsa">Dirigente RSA FIOM-CGIL</option>
                    <option value="rls">RLS (D.Lgs. 81/08)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data Fruizione *
                  </label>
                  <input
                    type="date"
                    required
                    value={permitDate}
                    onChange={(e) => setPermitDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dalle Ore
                  </label>
                  <input
                    type="time"
                    value={permitStart}
                    onChange={(e) => setPermitStart(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alle Ore
                  </label>
                  <input
                    type="time"
                    value={permitEnd}
                    onChange={(e) => setPermitEnd(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ore Totali Richieste *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="0.5"
                    required
                    value={permitHours}
                    onChange={(e) => setPermitHours(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 font-bold focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Giuridica
                  </label>
                  <select
                    value={permitLegalBasis}
                    onChange={(e) => setPermitLegalBasis(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-600"
                  >
                    <option value="art23">Art. 23 L. 300/70 (Espletamento mandato)</option>
                    <option value="art24">Art. 24 L. 300/70 (Partecipazione trattative)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivazione
                </label>
                <textarea
                  rows={2}
                  value={permitReason}
                  onChange={(e) => setPermitReason(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registra Permesso nel Sistema
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Comunicazione Preventiva alla Direzione Aziendale
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(generatePermitNotice(), 'permit_draft')}
                  className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'permit_draft' ? 'Copiato!' : 'Copia'}</span>
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
                {generatePermitNotice()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
