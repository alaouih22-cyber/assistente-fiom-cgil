import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  ShieldAlert,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Printer,
  Plus,
  Trash2,
  Scale,
  Building,
  User,
  ArrowRight,
  Info
} from 'lucide-react';

export interface DisciplinaryCase {
  id: string;
  workerNameOrCode: string;
  workerDepartment: string;
  workerLevel: string;
  chargeDate: string; // Data presunto fatto
  noticeReceivedDate: string; // Data ricezione lettera contestazione
  allegedCharges: string; // Descrizione addebiti
  hasSuspension: boolean; // Sospensione cautelare
  suspensionDetails?: string;
  status: 'difesa_in_corso' | 'audizione_richiesta' | 'in_attesa_esito' | 'sanzione_irrogata' | 'decaduta_archiviata';
  defenseNotes: string;
  createdAt: string;
}

const STORAGE_KEY = 'fiom_disciplinary_cases';

export const DisciplinaryContestationsView: React.FC = () => {
  const { currentCompany } = useCompany();
  const [cases, setCases] = useState<DisciplinaryCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'form' | 'registro'>('form');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [workerNameOrCode, setWorkerNameOrCode] = useState('');
  const [workerDepartment, setWorkerDepartment] = useState('');
  const [workerLevel, setWorkerLevel] = useState('C1');
  const [chargeDate, setChargeDate] = useState('');
  const [noticeReceivedDate, setNoticeReceivedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [allegedCharges, setAllegedCharges] = useState('');
  const [hasSuspension, setHasSuspension] = useState(false);
  const [suspensionDetails, setSuspensionDetails] = useState('');
  const [defenseArguments, setDefenseArguments] = useState('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Error saving disciplinary cases', e);
    }
  }, [cases]);

  // Calcolo scadenze ex art. 7 L. 300/1970
  const calculateDeadlines = (receivedDateStr: string) => {
    if (!receivedDateStr) return { defenseDeadline: '', companyDeadline: '', daysRemaining: 0, isExpired: false };
    const received = new Date(receivedDateStr);
    
    // 5 giorni perentori a difesa (decorrenza dal giorno successivo)
    const defenseDate = new Date(received);
    defenseDate.setDate(defenseDate.getDate() + 5);

    // 6 giorni contrattuali CCNL Metalmeccanici per decisione aziendale
    const companyDate = new Date(defenseDate);
    companyDate.setDate(companyDate.getDate() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = defenseDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      defenseDeadline: defenseDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      companyDeadline: companyDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      daysRemaining,
      isExpired: daysRemaining < 0
    };
  };

  const deadlines = calculateDeadlines(noticeReceivedDate);

  // Generazione Bozza Difesa
  const generateDefenseLetter = () => {
    return `ALLA DIREZIONE AZIENDALE
${currentCompany.name}
${currentCompany.facility}

RACCOMANDATA A MANO / VIA PEC

OGGETTO: Giustificazioni scritte e formale richiesta di audizione orale a difesa ai sensi dell'art. 7 della Legge 20 maggio 1970, n. 300 e del CCNL Metalmeccanici Industria (Federmeccanica-Assistal).

Il/La sottoscritto/a ${workerNameOrCode || '[Nome e Cognome / Matricola]'}, inquadrato/a al Livello ${workerLevel} del CCNL Metalmeccanici Industria in servizio presso il reparto ${workerDepartment || '[Reparto di Stabilimento]'}, con riferimento alla contestazione disciplinare protocollata in data ${noticeReceivedDate ? new Date(noticeReceivedDate).toLocaleDateString('it-IT') : '[Data ricezione contestazione]'} e consegnata in pari data;

PREMESSO CHE
- Ai sensi dell'art. 7 della Legge 300/1970 e della Sezione Quarta Titolo VII del vigente CCNL Metalmeccanici, il lavoratore ha diritto di esporre le proprie giustificazioni entro il termine perentorio di 5 giorni e di essere sentito oralmente con l'assistenza della rappresentanza sindacale;
${chargeDate ? `- I fatti contestati risalirebbero alla data del ${new Date(chargeDate).toLocaleDateString('it-IT')}, con conseguente riserva di eccezione di tempestività dell'addebito disciplinare;` : ''}

ESPONE QUANTO SEGUE NEL MERITO:
${defenseArguments.trim() || '[Inserire qui le controdeduzioni analitiche in fatto e in diritto: es. assenza di dolo o colpa, malfunzionamento impianti/sensori, rispetto delle istruzioni operative, mancata formazione o DPI inadeguati, circostanze esimenti].'}

Tanto premesso ed esposto, il/la sottoscritto/a rigetta integralmente gli addebiti mossi in quanto infondati in fatto e in diritto e

RICHIEDE ESPRESSAMENTE
di essere ammesso/a a formale audizione orale a propria difesa ai sensi dell'art. 7 comma 2 e 3 della Legge 300/1970, con l'assistenza del delegato della RSU FIOM-CGIL dello stabilimento.

Si rammenta che fino allo svolgimento dell'audizione e comunque fino al decorso dei termini contrattuali non potrà essere applicato alcun provvedimento disciplinare e che, decorso il termine contrattuale di decadenza di 6 giorni senza comunicazione dell'esito, le presenti giustificazioni dovranno intendersi definitivamente accolte.

Con riserva di ogni ulteriore azione a tutela dei propri diritti.

Luogo e data: ${currentCompany.location.split(',')[1]?.trim() || 'Stabilimento'}, lì ${new Date().toLocaleDateString('it-IT')}

Firma del Lavoratore: _______________________

Per assistenza sindacale:
RSU FIOM-CGIL / RSA - Stabilimento di ${currentCompany.name}`;
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerNameOrCode.trim()) {
      alert('Inserire il nominativo o codice identificativo del lavoratore.');
      return;
    }

    const newCase: DisciplinaryCase = {
      id: `disp_${Date.now()}`,
      workerNameOrCode: workerNameOrCode.trim(),
      workerDepartment: workerDepartment.trim() || 'Produzione',
      workerLevel,
      chargeDate,
      noticeReceivedDate,
      allegedCharges: allegedCharges.trim(),
      hasSuspension,
      suspensionDetails: suspensionDetails.trim(),
      status: 'difesa_in_corso',
      defenseNotes: defenseArguments.trim(),
      createdAt: new Date().toISOString()
    };

    setCases(prev => [newCase, ...prev]);
    setActiveTab('registro');
    alert('Fascicolo disciplinare registrato con successo nel sistema locale RSU.');
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa pratica disciplinare?')) {
      setCases(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Istituzionale FIOM-CGIL */}
      <div className="bg-white border-l-4 border-red-700 shadow-xs rounded-xl p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                Modulo 2 • Tutela Individuale
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-red-700" />
                {currentCompany.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Gestione Disciplinare & Contestazioni (Art. 7 L. 300/1970)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Form guidato per la RSU: calcolo perentorio dei 5 giorni a difesa, verifica tempestività addebito e redazione formale delle controdeduzioni con assistenza sindacale FIOM-CGIL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              Nuova Contestazione
            </button>
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'registro'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Registro Fascicoli ({cases.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonna Sinistra: Form Inserimento Dati Reali */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-700" />
              Dati della Contestazione Ricevuta
            </h2>

            <form onSubmit={handleSaveCase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lavoratore (Nome / Matricola) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Op. Linea Slitter / Matr. 104"
                    value={workerNameOrCode}
                    onChange={(e) => setWorkerNameOrCode(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reparto / Linea di Stabilimento
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Taglio lamiere, Spianatura, Manutenzione"
                    value={workerDepartment}
                    onChange={(e) => setWorkerDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Livello CCNL
                  </label>
                  <select
                    value={workerLevel}
                    onChange={(e) => setWorkerLevel(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  >
                    <option value="D1">D1 (Ex 1° Livello)</option>
                    <option value="D2">D2 (Ex 2°/3° Livello)</option>
                    <option value="C1">C1 (Ex 3° avanzato)</option>
                    <option value="C2">C2 (Ex 4° Livello)</option>
                    <option value="C3">C3 (Ex 5° Livello)</option>
                    <option value="B1">B1 (Ex 5° Super)</option>
                    <option value="B2">B2 (Ex 6° Livello)</option>
                    <option value="B3">B3 (Ex 7° Livello)</option>
                    <option value="A1">A1 (Ex Quadri)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data Presunto Fatto
                  </label>
                  <input
                    type="date"
                    value={chargeDate}
                    onChange={(e) => setChargeDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  />
                  <span className="text-[10px] text-slate-500">Per eccezione tempestività</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data Consegna Lettera *
                  </label>
                  <input
                    type="date"
                    required
                    value={noticeReceivedDate}
                    onChange={(e) => setNoticeReceivedDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-red-600 font-semibold text-red-950"
                  />
                  <span className="text-[10px] text-slate-500">Data firma o notifica PEC</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrizione dei Fatti Addebitati dall'Azienda *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Incolla o riassumi fedelmente il testo della lettera di contestazione (es. presunto ritardo, mancata timbratura, scarto produzione, mancato uso DPI, ecc.)..."
                  value={allegedCharges}
                  onChange={(e) => setAllegedCharges(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono text-xs"
                />
              </div>

              {/* Sospensione Cautelare */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSuspension}
                    onChange={(e) => setHasSuspension(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    È stata disposta contestuale Sospensione Cautelare dal lavoro?
                  </span>
                </label>
                {hasSuspension && (
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ <strong>Nota RSU:</strong> La sospensione cautelare non è una sanzione disciplinare. Il lavoratore conserva il diritto alla retribuzione ordinaria a carico azienda fino alla conclusione del procedimento.
                    </p>
                    <input
                      type="text"
                      placeholder="Dettagli sospensione (es. con allontanamento immediato dai locali)"
                      value={suspensionDetails}
                      onChange={(e) => setSuspensionDetails(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded p-2 mt-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Elementi di Difesa e Giustificazioni del Lavoratore
                </label>
                <textarea
                  rows={3}
                  placeholder="Spiegazioni fornite dal lavoratore al delegato: motivi dell'assenza, problemi macchinario, assenza di preavviso, prassi tollerata in reparto..."
                  value={defenseArguments}
                  onChange={(e) => setDefenseArguments(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salva nel Registro Pratiche RSU
                </button>
                <span className="text-xs text-slate-500">I dati restano salvati in locale protetto</span>
              </div>
            </form>
          </div>

          {/* Colonna Destra: Termini Perentori & Bozza Generata */}
          <div className="lg:col-span-5 space-y-5">
            {/* Monitoraggio Termini Legali */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-red-950">
                    Termini Perentori di Procedimento (Art. 7 L. 300/70)
                  </h3>
                  <p className="text-xs text-red-900 leading-relaxed">
                    Il lavoratore dispone di <strong>5 giorni di calendario</strong> a decorrere dal giorno successivo alla consegna della lettera.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-red-200/70">
                <div className="bg-white p-2.5 rounded-lg border border-red-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Scadenza Memorie / Audizione
                  </span>
                  <span className="text-sm font-black text-red-700">
                    {deadlines.defenseDeadline || '---'}
                  </span>
                  <span className="block text-[10px] text-slate-600 mt-0.5">
                    {deadlines.isExpired ? (
                      <span className="text-red-600 font-bold">⚠️ Termine scaduto</span>
                    ) : (
                      <span>Rimangono <strong>{deadlines.daysRemaining}</strong> giorni</span>
                    )}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-red-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Decadenza Sanzione Azienda
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {deadlines.companyDeadline || '---'}
                  </span>
                  <span className="block text-[10px] text-slate-600 mt-0.5">
                    Termine CCNL: 6 giorni dopo difesa
                  </span>
                </div>
              </div>

              <div className="mt-2.5 text-[11px] text-red-900/80 bg-red-100/50 p-2 rounded flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-red-700" />
                <span>Se l'azienda non comunica la sanzione entro 6 giorni dall'audizione, gli addebiti decadono ex CCNL.</span>
              </div>
            </div>

            {/* Anteprima Bozza Formale Controdeduzioni */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-700" />
                  Bozza Formale Controdeduzioni
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyText(generateDefenseLetter(), 'form_draft')}
                    className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                    title="Copia testo"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === 'form_draft' ? 'Copiato!' : 'Copia'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                    title="Stampa bozza"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Stampa</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-[360px] overflow-y-auto">
                <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
                  {generateDefenseLetter()}
                </pre>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * La lettera riporta in calce i riferimenti della RSU FIOM-CGIL dello stabilimento ({currentCompany.name}).
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Registro Fascicoli Disciplinari */
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registro Pratiche Disciplinari dello Stabilimento
              </h2>
              <p className="text-xs text-slate-500">
                Archivio delle contestazioni gestite dalla RSU di {currentCompany.name} ({currentCompany.facility})
              </p>
            </div>
            <button
              onClick={() => setActiveTab('form')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuova Pratica
            </button>
          </div>

          {cases.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">Nessuna contestazione registrata</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Il registro è attualmente pulito e pronto per l'istruttoria delle vertenze disciplinari reali.
              </p>
              <button
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Registra la Prima Contestazione
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map((c) => {
                const caseDeadlines = calculateDeadlines(c.noticeReceivedDate);
                return (
                  <div
                    key={c.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-colors bg-white space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                          {c.workerLevel}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.workerNameOrCode}</h4>
                          <span className="text-xs text-slate-500">{c.workerDepartment} • Ricevuta il {new Date(c.noticeReceivedDate).toLocaleDateString('it-IT')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          caseDeadlines.isExpired
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {caseDeadlines.isExpired ? 'Termine Difesa Decorso' : `Scadenza Difesa: ${caseDeadlines.defenseDeadline}`}
                        </span>

                        <button
                          onClick={() => handleDeleteCase(c.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                          title="Elimina pratica"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="font-semibold text-slate-900 mb-1">Addebiti contestati dall'Azienda:</p>
                      <p className="font-mono text-[11px] text-slate-800">{c.allegedCharges}</p>
                    </div>

                    {c.defenseNotes && (
                      <div className="text-xs text-slate-700 bg-red-50/50 p-2.5 rounded border border-red-100">
                        <span className="font-bold text-red-900">Note e difesa RSU: </span>
                        <span>{c.defenseNotes}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
