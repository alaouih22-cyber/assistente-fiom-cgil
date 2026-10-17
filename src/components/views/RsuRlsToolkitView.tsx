import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  ShieldAlert,
  AlertTriangle,
  CheckSquare,
  FileCheck2,
  CalendarCheck,
  Building,
  Flame,
  Printer,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  HardHat,
  Wind,
  Volume2,
  Sliders,
  AlertOctagon,
  FileText
} from 'lucide-react';

export interface RlsReport {
  id: string;
  reportType: 'segnalazione_urgente' | 'verbale_riunione_periodica';
  department: string;
  hazardCategory: string;
  description: string;
  riskLevel: 'basso' | 'medio' | 'grave_immediato';
  requestedRemedy: string;
  deadlineDays: number;
  status: 'aperta' | 'trasmessa_rspp' | 'risolta';
  createdAt: string;
}

const STORAGE_KEY = 'fiom_rls_reports';

export const RsuRlsToolkitView: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'checklist' | 'verbale' | 'registro'>('checklist');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // RLS Checklist Items
  const [checklist, setChecklist] = useState([
    {
      id: 'chk_macchine',
      category: 'Macchinari & Linee Produttive',
      title: 'Ripari, fotocellule di protezione e blocchi di sicurezza su cesoie, presse e slitter',
      desc: 'Verifica efficienza ripari fissi/interbloccati e dispositivi di arresto di emergenza a fungo su tutte le postazioni operatore.',
      checked: true,
      critical: true
    },
    {
      id: 'chk_carroponte',
      category: 'Carroponte & Movimentazione Carichi',
      title: 'Integrità catene, fasce di sollevamento e radiocomandi con uomo presente',
      desc: 'Assenza di tagli/sfilacciature su fasce, ganci con linguetta antisgancio, segnalatori acustici/luminosi di traslazione e verifiche periodiche INAIL aggiornate.',
      checked: false,
      critical: true
    },
    {
      id: 'chk_dpi',
      category: 'DPI & Protezione Individuale',
      title: 'Fornitura e idoneità DPI (scarpe S3, guanti antitaglio livello F, cuffie antirumore)',
      desc: 'Disponibilità continua di guanti con resistenza al taglio massima per movimentazione nastri e lamiere decapate/tagliate, e maschere per fumi.',
      checked: true,
      critical: false
    },
    {
      id: 'chk_fumi',
      category: 'Fumi, Nebbie Oleose & Chimica',
      title: 'Aspirazione localizzata su linee di taglio e vasche di decapaggio/emulsione',
      desc: 'Efficienza impianti di aspirazione forzata, sostituzione filtri esausti e captazione fumi di saldatura direttamente alla fonte.',
      checked: false,
      critical: true
    },
    {
      id: 'chk_rumore',
      category: 'Rumore & Microclima',
      title: 'Monitoraggio livelli di rumore (>85 dB(A)) e tutela da stress termico',
      desc: 'Misure fonometriche aggiornate nel DVR, pause fisse in locali climatizzati/insonorizzati e distribuzione bevande idrosaline in periodi caldi.',
      checked: false,
      critical: false
    },
    {
      id: 'chk_emergenza',
      category: 'Vie di Fuga & Pronto Soccorso',
      title: 'Corridoi di transito sgombri da coils/scarti e presidi medici riforniti',
      desc: 'Uscite di emergenza e porte tagliafuoco libere da ostacoli, pacchetti di medicazione completi e docce lavaocchi di sicurezza funzionanti.',
      checked: true,
      critical: false
    }
  ]);

  // Form Segnalazione / Verbale RLS
  const [reportType, setReportType] = useState<'segnalazione_urgente' | 'verbale_riunione_periodica'>('segnalazione_urgente');
  const [department, setDepartment] = useState('Reparto Linee Slitter & Taglio Lamiere');
  const [hazardCategory, setHazardCategory] = useState('Carroponte & Movimentazione Coils');
  const [riskLevel, setRiskLevel] = useState<'basso' | 'medio' | 'grave_immediato'>('medio');
  const [description, setDescription] = useState(
    'Rilevato malfunzionamento del finecorsa di salita del carroponte n. 2 e usura evidente delle fasce di sollevamento per coils pesanti nel reparto cesoiatura.'
  );
  const [requestedRemedy, setRequestedRemedy] = useState(
    'Messa fuori servizio cautelativa immediata dell\'attrezzatura, sostituzione fasce usurate e collaudo straordinario con rilascio di verbale di verifica da parte del tecnico abilitato.'
  );
  const [deadlineDays, setDeadlineDays] = useState(3);

  // Registro Segnalazioni
  const [reports, setReports] = useState<RlsReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving RLS reports', e);
    }
  }, [reports]);

  const handleToggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Generatore Verbale RLS
  const generateRlsLetter = () => {
    if (reportType === 'segnalazione_urgente') {
      return `AL DATORE DI LAVORO
AL RESPONSABILE DEL SERVIZIO PREVENZIONE E PROTEZIONE (RSPP)
AL MEDICO COMPETENTE
${currentCompany.name}
${currentCompany.facility}

INVIO A MEZZO PEC / CONSEGNA A MANO CON RICEVUTA

OGGETTO: Segnalazione formale di non conformità / pericolo per la salute e sicurezza ai sensi dell'art. 50, comma 1, lett. o) del D.Lgs. 9 aprile 2008, n. 81.

Il/I sottoscritto/i Rappresentante/i dei Lavoratori per la Sicurezza (RLS) eletto/i nello stabilimento in indirizzo,

NELL'ESERCIZIO DELLE PROPRIE ATTRIBUZIONI DI LEGGE,
a seguito del sopralluogo svolto in data odierna e delle segnalazioni pervenute dai lavoratori,

SEGNALA/NO QUANTO SEGUE:
- Unità produttiva / Reparto: ${department}
- Categoria di rischio: ${hazardCategory}
- Livello di gravità stimato: ${riskLevel === 'grave_immediato' ? 'GRAVE ED IMMEDIATO (richiede stop cautelativo)' : riskLevel.toUpperCase()}

DESCRIZIONE DEL PERICOLO O ANOMALIA RISCONTRATA:
${description}

INTERVENTI E MISURE DI PREVENZIONE RICHIESTE:
${requestedRemedy}

Si richiede l'adozione delle misure correttive sopra esposte entro e non oltre n. ${deadlineDays} giorni dalla presente, con contestuale riscontro scritto al sottoscritto RLS sulle modalità e tempistiche di ripristino delle condizioni di piena sicurezza.

In caso di mancato intervento entro il termine indicato, l'RLS si riserva di adire l'Organo di Vigilanza territorialmente competente (Servizio PSAL - ASL) ai sensi dell'art. 50 comma 1 lett. o) del D.Lgs. 81/08.

Luogo e data: ${currentCompany.location.split(',')[1]?.trim() || 'Stabilimento'}, lì ${new Date().toLocaleDateString('it-IT')}

Per il Rappresentante dei Lavoratori per la Sicurezza (RLS):
Firma RLS: _______________________

RSU FIOM-CGIL / RSA - Stabilimento di ${currentCompany.name}`;
    } else {
      return `VERBALE DELLA RIUNIONE PERIODICA DI PREVENZIONE E PROTEZIONE
(Art. 35 D.Lgs. 9 aprile 2008, n. 81)

Stabilimento: ${currentCompany.name} - ${currentCompany.facility}
Data riunione: ${new Date().toLocaleDateString('it-IT')}

PARTECIPANTI:
- Datore di Lavoro o suo Delegato per la Sicurezza
- Responsabile del Servizio di Prevenzione e Protezione (RSPP)
- Medico Competente
- Rappresentanti dei Lavoratori per la Sicurezza (RLS) FIOM-CGIL

PUNTI ALL'ORDINE DEL GIORNO ESAMINATI:
1. Esame del Documento di Valutazione dei Rischi (DVR) e del piano di miglioramento;
2. Andamento degli infortuni, dei mancati infortuni (near-miss) e delle malattie professionali;
3. Criteri di scelta, caratteristiche tecniche ed efficacia dei Dispositivi di Protezione Individuale (DPI);
4. Programmi di informazione e formazione dei dirigenti, preposti e lavoratori (inclusi somministrati e appalti);
5. Stato di conformità di impianti, carroponti, linee slitter e sistemi di aspirazione.

OSSERVAZIONI E RICHIESTE FORMALIZZATE DALL'RLS:
${requestedRemedy || description}

IMPEGNI CONCORDATI E CRONOPROGRAMMA AZIENDALE:
La Direzione aziendale e l'RSPP si impegnano a completare gli interventi correttivi concordati entro 30 giorni dalla sottoscrizione del presente verbale.

Letto, confermato e sottoscritto.

Firma Datore di Lavoro / RSPP: _______________________
Firma Medico Competente: _______________________
Firma RLS FIOM-CGIL: _______________________`;
    }
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: RlsReport = {
      id: `rls_${Date.now()}`,
      reportType,
      department,
      hazardCategory,
      description,
      riskLevel,
      requestedRemedy,
      deadlineDays: Number(deadlineDays),
      status: 'aperta',
      createdAt: new Date().toISOString()
    };

    setReports((prev) => [newReport, ...prev]);
    setActiveTab('registro');
    alert('Segnalazione RLS registrata con successo nel protocollo di sicurezza di stabilimento.');
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
                Modulo 4 • D.Lgs. 81/2008
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-red-700" />
                {currentCompany.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Salute e Sicurezza sul Lavoro (Ruolo RLS)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Checklist mirata per stabilimenti siderurgici e metalmeccanici (impianti, carroponti, DPI, fumi, microclima) e redazione del Verbale di Segnalazione Urgente RLS (Art. 50) o Riunione Periodica (Art. 35).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Checklist Fabbrica
            </button>
            <button
              onClick={() => setActiveTab('verbale')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'verbale'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Redigi Verbale RLS
            </button>
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'registro'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Registro Segnalazioni ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Checklist di Stabilimento */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Audit di Reparto & Checklist Sicurezza Metalmeccanica
                </h3>
                <p className="text-xs text-slate-500">
                  Verifica periodica dei presidi di sicurezza per impianti siderurgici, movimentazione pesi e salute dei lavoratori.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('verbale')}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                Trasforma in Segnalazione Formale
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    item.checked
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : item.critical
                      ? 'border-red-200 bg-red-50/40 hover:bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}} // handled by div
                    className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      {item.critical && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-bold border border-red-200">
                          Critico
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Modulo Redazione Verbale / Segnalazione */}
      {activeTab === 'verbale' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-700" />
              Parametri della Segnalazione RLS
            </h3>

            <form onSubmit={handleSaveReport} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo di Documento *
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-600 font-semibold"
                  >
                    <option value="segnalazione_urgente">Segnalazione Urgente RLS (Art. 50)</option>
                    <option value="verbale_riunione_periodica">Verbale Riunione Periodica (Art. 35)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Livello di Rischio Stimato *
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-red-600 font-bold"
                  >
                    <option value="basso">Basso (non conformità lieve)</option>
                    <option value="medio">Medio (potenziale danno)</option>
                    <option value="grave_immediato">Grave & Immediato (Stop cautelativo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reparto / Postazione *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria Pericolo *
                  </label>
                  <input
                    type="text"
                    required
                    value={hazardCategory}
                    onChange={(e) => setHazardCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrizione Analitica dell'Anomalia o Pericolo *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Misure Correttive Richieste al Datore di Lavoro / RSPP *
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestedRemedy}
                  onChange={(e) => setRequestedRemedy(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Termine Richiesto per Riscontro (Giorni)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 font-bold"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registra nel Protocollo RLS
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Bozza Formale del Verbale
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(generateRlsLetter(), 'rls_draft')}
                  className="p-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'rls_draft' ? 'Copiato!' : 'Copia'}</span>
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
                {generateRlsLetter()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Registro Segnalazioni */}
      {activeTab === 'registro' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registro Segnalazioni di Sicurezza dello Stabilimento
              </h3>
              <p className="text-xs text-slate-500">
                Archivio delle istanze formalizzate dagli RLS FIOM-CGIL presso {currentCompany.name}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('verbale')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuova Segnalazione
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-700">Nessuna segnalazione RLS registrata</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Il registro delle non conformità è attualmente pulito e pronto per la formalizzazione delle verifiche di stabilimento.
              </p>
              <button
                onClick={() => setActiveTab('verbale')}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Compila la Prima Segnalazione RLS
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="border border-slate-200 rounded-xl p-4 bg-white hover:border-red-300 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs uppercase ${
                        r.riskLevel === 'grave_immediato'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        Rischio {r.riskLevel.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{r.hazardCategory}</h4>
                      <span className="text-xs text-slate-500">({r.department})</span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Vuoi eliminare questa segnalazione RLS?')) {
                          setReports((prev) => prev.filter((item) => item.id !== r.id));
                        }
                      }}
                      className="text-slate-400 hover:text-red-700 p-1"
                      title="Elimina segnalazione"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <strong>Anomalia: </strong>{r.description}
                  </p>

                  <div className="text-xs text-red-950 bg-red-50/50 p-2.5 rounded border border-red-100">
                    <strong>Rimedio richiesto entro {r.deadlineDays} gg: </strong>{r.requestedRemedy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
