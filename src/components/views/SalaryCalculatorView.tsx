import React, { useState } from 'react';
import {
  CCNL_METALMECCANICI_LEVELS,
  MAGGIORAZIONI_CCNL_METALMECCANICI,
  COMPORTO_CCNL_METALMECCANICI,
  PREAVVISO_CCNL_METALMECCANICI,
  TFR_PARAMETRI_CCNL,
  FLEXIBLE_BENEFITS_CCNL,
  ELEMENTO_PEREQUATIVO_CCNL,
  REGOLE_STRAORDINARIO_SOGLIE
} from '../../data/ccnl.ts';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  Calculator,
  Coins,
  Clock,
  HeartPulse,
  LogOut,
  PiggyBank,
  FileCheck,
  AlertTriangle,
  Upload,
  RefreshCw,
  TrendingUp,
  FileText,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Gift,
  Scale,
  Building
} from 'lucide-react';

export const SalaryCalculatorView: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<
    'retribuzione' | 'welfare_perequativo' | 'comporto' | 'preavviso' | 'tfr' | 'audit_cedolino'
  >('retribuzione');

  // --- 1. STATE CALCOLATORE RETRIBUZIONE & MAGGIORAZIONI ---
  const [selectedLevelCode, setSelectedLevelCode] = useState<string>('D2');
  const [scattiAnzianita, setScattiAnzianita] = useState<number>(1);
  const [superminimo, setSuperminimo] = useState<number>(0);
  const [indennitaVarie, setIndennitaVarie] = useState<number>(0);

  // Straordinari ore
  const [oreStraord25, setOreStraord25] = useState<number>(0);
  const [oreStraord30, setOreStraord30] = useState<number>(0);
  const [oreStraord50Fest, setOreStraord50Fest] = useState<number>(0);
  const [oreStraord50Notte, setOreStraord50Notte] = useState<number>(0);
  const [oreStraord65NotteFest, setOreStraord65NotteFest] = useState<number>(0);
  const [applicaIncremento8OltreSoglia, setApplicaIncremento8OltreSoglia] = useState<boolean>(false);
  const [oreOltreSoglia48h, setOreOltreSoglia48h] = useState<number>(0);

  // Turni avvicendati ore
  const [oreTurnoPomeriggio8, setOreTurnoPomeriggio8] = useState<number>(0);
  const [oreTurnoNotte30, setOreTurnoNotte30] = useState<number>(0);

  // Calcoli Retribuzione
  const levelObj =
    CCNL_METALMECCANICI_LEVELS.find((l) => l.code === selectedLevelCode) ||
    CCNL_METALMECCANICI_LEVELS[1];

  const minimoTabellare = levelObj.monthlyBasePay;
  const valoreScatto = levelObj.valoreScattoBiennale || 22.88;
  const totaleScatti = Math.min(Math.max(0, scattiAnzianita), 5) * valoreScatto;
  const indennitaFunzione = levelObj.indennitaFunzioneQuadro || 0;
  const retribuzioneMensileFissa =
    minimoTabellare + totaleScatti + Math.max(0, superminimo) + Math.max(0, indennitaVarie) + indennitaFunzione;

  // Divisore orario contrattuale ex art. 5 Sez. Quarta Titolo III CCNL Metalmeccanici
  const divisoreOrario = 173;
  const tariffaOrariaBase = retribuzioneMensileFissa / divisoreOrario;

  // Valore maggiorazioni ordinarie
  const valStraord25 = Math.max(0, oreStraord25) * (tariffaOrariaBase * 1.25);
  const valStraord30 = Math.max(0, oreStraord30) * (tariffaOrariaBase * 1.30);
  const valStraord50Fest = Math.max(0, oreStraord50Fest) * (tariffaOrariaBase * 1.50);
  const valStraord50Notte = Math.max(0, oreStraord50Notte) * (tariffaOrariaBase * 1.50);
  const valStraord65NotteFest = Math.max(0, oreStraord65NotteFest) * (tariffaOrariaBase * 1.65);

  // Ulteriore incremento +8% per straordinario oltre 48 ore settimanali o soglie contrattuali
  const valIncremento8 = applicaIncremento8OltreSoglia
    ? Math.max(0, oreOltreSoglia48h) * (tariffaOrariaBase * 0.08)
    : 0;

  const valTurnoPomeriggio = Math.max(0, oreTurnoPomeriggio8) * (tariffaOrariaBase * 0.08);
  const valTurnoNotte = Math.max(0, oreTurnoNotte30) * (tariffaOrariaBase * 0.30);

  const totaleMaggiorazioni =
    valStraord25 +
    valStraord30 +
    valStraord50Fest +
    valStraord50Notte +
    valStraord65NotteFest +
    valIncremento8 +
    valTurnoPomeriggio +
    valTurnoNotte;

  const totaleLordoMese = retribuzioneMensileFissa + totaleMaggiorazioni;

  // Trattenute previdenziali e fiscali (Scaglioni IRPEF 2024 / Riforma fiscale)
  const aliquotaInps = 0.0919; // 9.19% IVS a carico del lavoratore
  const trattenutaInps = totaleLordoMese * aliquotaInps;
  const imponibileFiscale = Math.max(0, totaleLordoMese - trattenutaInps);

  const imponibileAnnuo = imponibileFiscale * 13;
  let impostaLordaAnnua = 0;
  if (imponibileAnnuo <= 28000) {
    impostaLordaAnnua = imponibileAnnuo * 0.23;
  } else if (imponibileAnnuo <= 50000) {
    impostaLordaAnnua = 28000 * 0.23 + (imponibileAnnuo - 28000) * 0.35;
  } else {
    impostaLordaAnnua = 28000 * 0.23 + 22000 * 0.35 + (imponibileAnnuo - 50000) * 0.43;
  }

  let detrazioneAnnua = 0;
  if (imponibileAnnuo <= 15000) {
    detrazioneAnnua = 1955;
  } else if (imponibileAnnuo <= 28000) {
    detrazioneAnnua = 1955 * ((28000 - imponibileAnnuo) / 13000);
  } else if (imponibileAnnuo <= 50000) {
    detrazioneAnnua = 1910 * ((50000 - imponibileAnnuo) / 22000);
  }

  const impostaNettaAnnua = Math.max(0, impostaLordaAnnua - detrazioneAnnua);
  const ritenutaIrpefMensile = impostaNettaAnnua / 13;
  const stimaNettoMensile = Math.max(0, imponibileFiscale - ritenutaIrpefMensile);

  // --- 2. STATE WELFARE & ELEMENTO PEREQUATIVO ---
  const [haContrattazioneAziendale, setHaContrattazioneAziendale] = useState(false);
  const [haSuperminimoAssorbibile, setHaSuperminimoAssorbibile] = useState(false);
  const [mesiServizioAnnoPrecedente, setMesiServizioAnnoPrecedente] = useState(12);
  const [percentualePartTime, setPercentualePartTime] = useState(100);

  const perequativoSpettante = (!haContrattazioneAziendale && !haSuperminimoAssorbibile)
    ? (ELEMENTO_PEREQUATIVO_CCNL.importoAnnuo * (mesiServizioAnnoPrecedente / 12) * (percentualePartTime / 100))
    : 0;

  // --- 3. STATE CALCOLATORE COMPORTO MALATTIA ---
  const [comportoAnzianita, setComportoAnzianita] = useState<'fino_3' | '3_a_6' | 'oltre_6'>('3_a_6');
  const [comportoTipo, setComportoTipo] = useState<'standard' | 'prolungato'>('standard');
  const [giorniGiaFruiti, setGiorniGiaFruiti] = useState<number>(45);
  const [giorniNuovoCertificato, setGiorniNuovoCertificato] = useState<number>(15);

  const limiteComporto =
    comportoAnzianita === 'fino_3'
      ? (comportoTipo === 'standard' ? 183 : 274)
      : comportoAnzianita === '3_a_6'
      ? (comportoTipo === 'standard' ? 274 : 411)
      : (comportoTipo === 'standard' ? 365 : 548);

  const totaleGiorniAssenza = Math.max(0, giorniGiaFruiti) + Math.max(0, giorniNuovoCertificato);
  const giorniResiduiComporto = Math.max(0, limiteComporto - totaleGiorniAssenza);
  const percentualeComporto = Math.min(100, (totaleGiorniAssenza / limiteComporto) * 100);
  const isComportoSuperato = totaleGiorniAssenza > limiteComporto;

  // --- 4. STATE CALCOLATORE PREAVVISO ---
  const [preavvisoLivello, setPreavvisoLivello] = useState<string>('D2');
  const [preavvisoQualifica, setPreavvisoQualifica] = useState<'operaio' | 'impiegato'>('operaio');
  const [preavvisoAnzianita, setPreavvisoAnzianita] = useState<'fino_5' | '5_a_10' | 'oltre_10'>('fino_5');
  const [preavvisoTipoRecesso, setPreavvisoTipoRecesso] = useState<'licenziamento' | 'dimissioni'>('licenziamento');

  const regolaPreavviso =
    PREAVVISO_CCNL_METALMECCANICI.find((r) => r.livelliInclusi.includes(preavvisoLivello)) ||
    PREAVVISO_CCNL_METALMECCANICI[0];

  const getDettaglioPreavviso = () => {
    if (preavvisoQualifica === 'operaio') {
      if (preavvisoAnzianita === 'fino_5') return regolaPreavviso.finoA5AnniOperai;
      if (preavvisoAnzianita === '5_a_10') return regolaPreavviso.da5A10AnniOperai;
      return regolaPreavviso.oltre10AnniOperai;
    } else {
      if (preavvisoAnzianita === 'fino_5') return regolaPreavviso.finoA5AnniImpiegati;
      if (preavvisoAnzianita === '5_a_10') return regolaPreavviso.da5A10AnniImpiegati;
      return regolaPreavviso.oltre10AnniImpiegati;
    }
  };

  const terminePreavvisoCalcolato = getDettaglioPreavviso();

  // --- 5. STATE CALCOLATORE TFR ---
  const [tfrRal, setTfrRal] = useState<number>(28000);
  const [tfrFondoPregresso, setTfrFondoPregresso] = useState<number>(8500);
  const [tfrTassoInflazione, setTfrTassoInflazione] = useState<number>(1.8);

  const quotaAnnuaLorda = Math.max(0, tfrRal) / TFR_PARAMETRI_CCNL.divisoreAnnuale;
  const detrazioneIvs = Math.max(0, tfrRal) * TFR_PARAMETRI_CCNL.contributoIvsLavoratore;
  const quotaAnnuaAccantonata = Math.max(0, quotaAnnuaLorda - detrazioneIvs);

  const tassoRivalutazioneTotale =
    TFR_PARAMETRI_CCNL.tassoFissoRivalutazione +
    (Math.max(0, tfrTassoInflazione) / 100) * TFR_PARAMETRI_CCNL.percentualeInflazioneFoi;
  const rivalutazioneFondoPregresso =
    Math.max(0, tfrFondoPregresso) * tassoRivalutazioneTotale;
  const impostaSostitutivaRivalutazione = rivalutazioneFondoPregresso * 0.17;
  const rivalutazioneNetta = rivalutazioneFondoPregresso - impostaSostitutivaRivalutazione;

  const nuovoTotaleFondoTFR =
    Math.max(0, tfrFondoPregresso) + quotaAnnuaAccantonata + rivalutazioneNetta;

  // --- 6. STATE AUDIT CEDOLINO ---
  const [cedolinoImage, setCedolinoImage] = useState<string | null>(null);
  const [cedolinoFileName, setCedolinoFileName] = useState<string>('');
  const [cedolinoLordoReale, setCedolinoLordoReale] = useState<string>('');
  const [cedolinoNettoReale, setCedolinoNettoReale] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Il file supera la dimensione massima consentita (20 MB).');
      return;
    }

    setCedolinoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCedolinoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);

    try {
      const base64 = cedolinoImage ? cedolinoImage.split(',')[1] : undefined;
      const res = await fetch('/api/gemini/audit-payslip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: base64,
          mimeType: 'image/jpeg',
          levelCode: selectedLevelCode,
          userLordo: cedolinoLordoReale ? parseFloat(cedolinoLordoReale) : undefined,
          userNetto: cedolinoNettoReale ? parseFloat(cedolinoNettoReale) : undefined
        })
      });

      const data = await res.json();
      setAuditResult(data.analysis || data.text || 'Analisi completata con successo.');
    } catch (err: any) {
      setAuditResult(
        `Errore durante l'audit del cedolino: ${err?.message || 'Server non raggiungibile'}. Puoi comunque riscontrare manualmente i minimi tabellari riportati a fianco.`
      );
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Istituzionale FIOM */}
      <div className="bg-white border-l-4 border-red-700 shadow-xs rounded-xl p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                Modulo 1 • CCNL Federmeccanica-Assistal
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-red-700" />
                {currentCompany.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Verifica Busta Paga & Tabelle Salariali Ufficiali
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Tabelle salariali in vigore (adeguamenti 1° giugno 2026), scatti biennali, maggiorazioni straordinario (con incremento +8% per superamento soglie), turni avvicendati, welfare contrattuale (200 €) ed Elemento Perequativo (485 €).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('retribuzione')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'retribuzione'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Retribuzione & Straordinari</span>
            </button>
            <button
              onClick={() => setActiveTab('welfare_perequativo')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'welfare_perequativo'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Welfare (200€) & Perequativo (485€)</span>
            </button>
            <button
              onClick={() => setActiveTab('comporto')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'comporto'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Comporto Malattia</span>
            </button>
            <button
              onClick={() => setActiveTab('preavviso')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'preavviso'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Preavviso</span>
            </button>
            <button
              onClick={() => setActiveTab('tfr')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'tfr'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <PiggyBank className="w-3.5 h-3.5" />
              <span>TFR</span>
            </button>
            <button
              onClick={() => setActiveTab('audit_cedolino')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'audit_cedolino'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Audit Cedolino</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: RETRIBUZIONE, STRAORDINARI E TURNI AVVICENDATI     */}
      {/* ======================================================== */}
      {activeTab === 'retribuzione' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Box Inquadramento Base */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-red-700" />
                  Elementi Fissi della Retribuzione Mensile (Minimi Giugno 2026)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded-md">
                  Divisore: 173 ore/mese
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Livello Contrattuale CCNL *
                  </label>
                  <select
                    value={selectedLevelCode}
                    onChange={(e) => setSelectedLevelCode(e.target.value)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
                  >
                    {CCNL_METALMECCANICI_LEVELS.map((lvl) => (
                      <option key={lvl.code} value={lvl.code}>
                        {lvl.code} ({lvl.exLevel}) • € {lvl.monthlyBasePay.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Ruolo: <strong>{levelObj.field}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scatti di Anzianità Maturati (Max 5 bienni)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={scattiAnzianita}
                      onChange={(e) =>
                        setScattiAnzianita(
                          Math.min(5, Math.max(0, parseInt(e.target.value, 10) || 0))
                        )
                      }
                      className="w-20 text-sm font-bold border border-slate-300 rounded-lg p-2.5 text-center focus:ring-2 focus:ring-red-600"
                    />
                    <div className="text-xs text-slate-600">
                      <span>Valore singolo: <strong>€ {valoreScatto.toFixed(2)}</strong></span>
                      <span className="block text-slate-500">Totale: € {totaleScatti.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Superminimo Individuale (€/mese)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={superminimo || ''}
                    placeholder="0.00"
                    onChange={(e) => setSuperminimo(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Indennità Fisse di Reparto / Mansione (€/mese)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={indennitaVarie || ''}
                    placeholder="0.00"
                    onChange={(e) => setIndennitaVarie(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                  />
                  {levelObj.indennitaFunzioneQuadro && (
                    <span className="text-[10px] text-amber-700 block mt-0.5">
                      + € {levelObj.indennitaFunzioneQuadro.toFixed(2)} indennità quadro A1 inclusa
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Box Straordinari con Incremento +8% Soglie */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-700" />
                  Lavoro Straordinario, Festivo e Incremento +8%
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Base oraria: <strong>€ {tariffaOrariaBase.toFixed(3)}</strong>/ora
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diurno feriale (prime 2h) (+25%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreStraord25 || ''}
                    placeholder="0 ore"
                    onChange={(e) => setOreStraord25(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    € {(tariffaOrariaBase * 1.25).toFixed(2)}/h
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diurno oltre 2h (+30%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreStraord30 || ''}
                    placeholder="0 ore"
                    onChange={(e) => setOreStraord30(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    € {(tariffaOrariaBase * 1.30).toFixed(2)}/h
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Festivo o Domenica (+50%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreStraord50Fest || ''}
                    placeholder="0 ore"
                    onChange={(e) => setOreStraord50Fest(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    € {(tariffaOrariaBase * 1.50).toFixed(2)}/h
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notturno feriale (+50%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreStraord50Notte || ''}
                    placeholder="0 ore"
                    onChange={(e) => setOreStraord50Notte(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Dalle 22:00 alle 06:00
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notturno festivo (+65%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreStraord65NotteFest || ''}
                    placeholder="0 ore"
                    onChange={(e) => setOreStraord65NotteFest(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-slate-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    € {(tariffaOrariaBase * 1.65).toFixed(2)}/h
                  </span>
                </div>

                {/* Turni Avvicendati */}
                <div className="bg-red-50/50 p-3 rounded-lg border border-red-200">
                  <label className="block text-xs font-bold text-red-900 mb-1">
                    2° Turno Pomeriggio (+8%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreTurnoPomeriggio8 || ''}
                    placeholder="Ore turno"
                    onChange={(e) => setOreTurnoPomeriggio8(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-red-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600 bg-white"
                  />
                  <span className="text-[10px] text-red-700 block mt-1">
                    Turnisti 14:00 - 22:00
                  </span>
                </div>

                <div className="bg-red-50/50 p-3 rounded-lg border border-red-200">
                  <label className="block text-xs font-bold text-red-900 mb-1">
                    3° Turno Notte (+30%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oreTurnoNotte30 || ''}
                    placeholder="Ore turno"
                    onChange={(e) => setOreTurnoNotte30(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold border border-red-300 rounded-md p-1.5 focus:ring-1 focus:ring-red-600 bg-white"
                  />
                  <span className="text-[10px] text-red-700 block mt-1">
                    Turnisti 22:00 - 06:00
                  </span>
                </div>
              </div>

              {/* Clausola Contrattuale Incremento +8% Oltre Soglie */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applicaIncremento8OltreSoglia}
                    onChange={(e) => setApplicaIncremento8OltreSoglia(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-amber-950">
                    Applica incremento contrattuale dell'+8% per superamento delle 48 ore settimanali o soglie CCNL
                  </span>
                </label>

                {applicaIncremento8OltreSoglia && (
                  <div className="flex items-center gap-3 pt-1">
                    <label className="text-xs text-amber-900 font-medium">
                      Ore effettuate oltre la soglia delle 48 ore:
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={oreOltreSoglia48h}
                      onChange={(e) => setOreOltreSoglia48h(parseFloat(e.target.value) || 0)}
                      className="w-24 text-xs font-bold border border-amber-300 rounded p-1.5 bg-white text-center"
                    />
                    <span className="text-xs font-bold text-amber-900">
                      Maggiorazione aggiuntiva: + € {valIncremento8.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonna Destra: Risultati e Prospetto Paga */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    Prospetto Retributivo Mensile
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Livello {selectedLevelCode} • {levelObj.exLevel}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Quota oraria base</span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    € {tariffaOrariaBase.toFixed(2)} /h
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Minimo Tabellare (Giugno 2026):</span>
                  <span className="font-mono font-bold text-white">€ {minimoTabellare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Scatti di anzianità ({scattiAnzianita} di 5):</span>
                  <span className="font-mono text-emerald-400">+ € {totaleScatti.toFixed(2)}</span>
                </div>
                {superminimo > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-300">Superminimo individuale:</span>
                    <span className="font-mono text-emerald-400">+ € {superminimo.toFixed(2)}</span>
                  </div>
                )}
                {totaleMaggiorazioni > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-300">Maggiorazioni straordinario e turni:</span>
                    <span className="font-mono text-amber-400">+ € {totaleMaggiorazioni.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b-2 border-slate-700 text-sm font-bold">
                  <span className="text-white">TOTALE LORDO MENSILE:</span>
                  <span className="font-mono text-white text-base">€ {totaleLordoMese.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-1 text-slate-400">
                  <span>Trattenute Previdenziali IVS (9.19%):</span>
                  <span className="font-mono text-red-400">- € {trattenutaInps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Ritenuta Fiscale IRPEF netta presunta:</span>
                  <span className="font-mono text-red-400">- € {ritenutaIrpefMensile.toFixed(2)}</span>
                </div>

                <div className="bg-red-950/60 border border-red-800/80 p-3 rounded-xl mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-300 block">
                      Stima Netto in Busta Paga
                    </span>
                    <span className="text-2xl font-black text-amber-300">
                      € {stimaNettoMensile.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 text-right">
                    Su 13 mensilità ordinarie<br />senza addizionali regionali
                  </span>
                </div>
              </div>
            </div>

            {/* Riepilogo Minimi Tabellari CCNL Metalmeccanici */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Tabelle Minimi CCNL Federmeccanica-Assistal
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1">Livello</th>
                      <th className="py-1 text-right">Minimo Base</th>
                      <th className="py-1 text-right">Scatto Bien.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CCNL_METALMECCANICI_LEVELS.map((lvl) => (
                      <tr
                        key={lvl.code}
                        className={lvl.code === selectedLevelCode ? 'bg-red-50 font-bold text-red-950' : 'text-slate-700'}
                      >
                        <td className="py-1">{lvl.code} ({lvl.exLevel})</td>
                        <td className="py-1 text-right font-mono">€ {lvl.monthlyBasePay.toFixed(2)}</td>
                        <td className="py-1 text-right font-mono">€ {lvl.valoreScattoBiennale.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: WELFARE CONTRATTUALE (200€) & PEREQUATIVO (485€)   */}
      {/* ======================================================== */}
      {activeTab === 'welfare_perequativo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box Flexible Benefits */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Flexible Benefits • Welfare Contrattuale
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {FLEXIBLE_BENEFITS_CCNL.riferimentoCCNL}
                </span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-900 uppercase">Valore Contrattuale Annuo</span>
                <span className="text-3xl font-black text-red-800 block">
                  € {FLEXIBLE_BENEFITS_CCNL.importoAnnuo.toFixed(2)}
                </span>
              </div>
              <span className="px-3 py-1 bg-red-700 text-white rounded-lg text-xs font-bold">
                100% Defiscalizzato
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Decorrenza contrattuale:</strong> Attivazione al <strong>{FLEXIBLE_BENEFITS_CCNL.decorrenza}</strong> di ogni anno contrattuale.
              </p>
              <p>
                <strong>Scadenza fruizione:</strong> Entro il <strong>{FLEXIBLE_BENEFITS_CCNL.termineUtilizzo}</strong> (le somme non spese non possono essere monetizzate in busta paga ma possono confluire al fondo pensione negoziale Cometa, se previsto dall'accordo).
              </p>
              <p>
                <strong>Destinatari:</strong> {FLEXIBLE_BENEFITS_CCNL.beneficiari}.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Ambiti di utilizzo ex art. 51 TUIR:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Buoni spesa, carburante e acquisto beni (entro i massimali fringe benefit di legge);</li>
                  <li>Rimborsi rette scolastiche, asili nido, libri di testo e campus estivi figli;</li>
                  <li>Spese sanitarie e odontoiatriche integrative a Metasalute;</li>
                  <li>Versamento volontario al Fondo Pensione Cometa.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Box Elemento Perequativo */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Elemento Perequativo Contrattuale
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {ELEMENTO_PEREQUATIVO_CCNL.riferimentoCCNL}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Importo Massimo Annuo</span>
                <span className="text-3xl font-black text-amber-300 block">
                  € {ELEMENTO_PEREQUATIVO_CCNL.importoAnnuo.toFixed(2)}
                </span>
              </div>
              <span className="text-xs text-slate-300 text-right">
                Nel cedolino di Giugno
              </span>
            </div>

            {/* Verifica Spettanza Guidata */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900">Verifica dei Requisiti di Spettanza:</h4>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={haContrattazioneAziendale}
                  onChange={(e) => setHaContrattazioneAziendale(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="text-slate-800">
                  In azienda è presente contrattazione di 2° livello (Premio di Risultato / Produzione)?
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={haSuperminimoAssorbibile}
                  onChange={(e) => setHaSuperminimoAssorbibile(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="text-slate-800">
                  Il lavoratore percepisce superminimi individuali o collettivi pari o superiori a 485 € annui?
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Mesi di servizio anno precedente:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={mesiServizioAnnoPrecedente}
                    onChange={(e) => setMesiServizioAnnoPrecedente(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Percentuale Part-Time:
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={percentualePartTime}
                    onChange={(e) => setPercentualePartTime(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white font-bold text-center"
                  />
                </div>
              </div>

              {/* Risultato Spettanza */}
              <div className={`p-3 rounded-lg border font-medium ${
                perequativoSpettante > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {perequativoSpettante > 0 ? (
                  <div>
                    <span className="font-bold block text-sm">✅ Elemento Perequativo Spettante:</span>
                    <span className="text-xl font-black text-emerald-800 block mt-0.5">
                      € {perequativoSpettante.toFixed(2)} lordi
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Da erogare obbligatoriamente con la retribuzione del mese di Giugno.
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold block">❌ Elemento Perequativo non dovuto</span>
                    <span className="text-[11px] text-amber-800">
                      Assorbito dalla presenza di contrattazione aziendale o da superminimo individuale di pari importo.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PERIODO DI COMPORTO MALATTIA                      */}
      {/* ======================================================== */}
      {activeTab === 'comporto' && (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-700" />
                Calcolo Periodo di Comporto (Art. 2110 c.c. & CCNL Metalmeccanici)
              </h2>
              <p className="text-xs text-slate-500">
                Verifica dei giorni di conservazione del posto di lavoro su arco temporale mobile di 36 mesi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anzianità di Servizio in Azienda
              </label>
              <select
                value={comportoAnzianita}
                onChange={(e) => setComportoAnzianita(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                <option value="fino_3">Fino a 3 anni compiuti (183 gg)</option>
                <option value="3_a_6">Da 3 a 6 anni compiuti (274 gg)</option>
                <option value="oltre_6">Oltre 6 anni compiuti (365 gg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipologia di Comporto
              </label>
              <select
                value={comportoTipo}
                onChange={(e) => setComportoTipo(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                <option value="standard">Standard (Malattia comune)</option>
                <option value="prolungato">Prolungato (+50% per patologie gravi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giorni già fruiti negli ultimi 36 mesi
              </label>
              <input
                type="number"
                min={0}
                value={giorniGiaFruiti}
                onChange={(e) => setGiorniGiaFruiti(Number(e.target.value))}
                className="w-full text-sm font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Barra di Avanzamento Comporto */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Giorni Consumati: {totaleGiorniAssenza} / {limiteComporto} giorni</span>
              <span className={isComportoSuperato ? 'text-red-700' : 'text-slate-700'}>
                {percentualeComporto.toFixed(1)}% del limite
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isComportoSuperato
                    ? 'bg-red-700'
                    : percentualeComporto > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${percentualeComporto}%` }}
              />
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-500">Giorni residui di tutela:</span>
              <span className="font-bold text-slate-900">{giorniResiduiComporto} giorni</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PREAVVISO CCNL                                    */}
      {/* ======================================================== */}
      {activeTab === 'preavviso' && (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-700" />
                Termini e Indennità Sostitutiva di Preavviso
              </h2>
              <p className="text-xs text-slate-500">
                Art. 1 Sezione Quarta Titolo VII CCNL Metalmeccanici Industria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Livello Contrattuale
              </label>
              <select
                value={preavvisoLivello}
                onChange={(e) => setPreavvisoLivello(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                {CCNL_METALMECCANICI_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    {lvl.code} ({lvl.exLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifica Giuridica
              </label>
              <select
                value={preavvisoQualifica}
                onChange={(e) => setPreavvisoQualifica(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                <option value="operaio">Operaio</option>
                <option value="impiegato">Impiegato / Quadro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anzianità di Servizio
              </label>
              <select
                value={preavvisoAnzianita}
                onChange={(e) => setPreavvisoAnzianita(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                <option value="fino_5">Fino a 5 anni di servizio</option>
                <option value="5_a_10">Oltre 5 e fino a 10 anni</option>
                <option value="oltre_10">Oltre 10 anni di servizio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipologia Recesso
              </label>
              <select
                value={preavvisoTipoRecesso}
                onChange={(e) => setPreavvisoTipoRecesso(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-red-600"
              >
                <option value="licenziamento">Licenziamento (dovuto dall'Azienda)</option>
                <option value="dimissioni">Dimissioni (dovuto dal Lavoratore)</option>
              </select>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-red-900 block">Termine Contrattuale Dovuto</span>
              <span className="text-2xl font-black text-red-800">
                {terminePreavvisoCalcolato}
              </span>
            </div>
            <div className="text-right text-xs text-red-900">
              <span>Decorrenza: </span>
              <strong>
                {preavvisoQualifica === 'operaio' ? regolaPreavviso.decorrenzaOperai : regolaPreavviso.decorrenzaImpiegati}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: CALCOLO TFR                                       */}
      {/* ======================================================== */}
      {activeTab === 'tfr' && (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-red-700" />
                Calcolo e Rivalutazione del TFR (Art. 2120 c.c. & L. 297/82)
              </h2>
              <p className="text-xs text-slate-500">
                Quota annua utile (RAL / 13,5 - 0,5% IVS) e rivalutazione fondo (1,5% fisso + 75% inflazione FOI).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Retribuzione Annua Lorda (RAL)
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                value={tfrRal}
                onChange={(e) => setTfrRal(Number(e.target.value))}
                className="w-full text-sm font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fondo TFR Pregresso al 31/12 precedente
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={tfrFondoPregresso}
                onChange={(e) => setTfrFondoPregresso(Number(e.target.value))}
                className="w-full text-sm font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tasso Inflazione FOI ISTAT stimato (%)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={tfrTassoInflazione}
                onChange={(e) => setTfrTassoInflazione(Number(e.target.value))}
                className="w-full text-sm font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Quota Annua Accantonata</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">€ {quotaAnnuaAccantonata.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500">Detratto 0,5% IVS (€ {detrazioneIvs.toFixed(2)})</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Rivalutazione Netta Fondo</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">+ € {rivalutazioneNetta.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500">Tasso netto post imposta 17%</span>
            </div>

            <div className="bg-red-50 p-3.5 rounded-lg border border-red-200">
              <span className="text-[10px] uppercase font-bold text-red-900 block">Nuovo Fondo TFR Totale</span>
              <span className="text-xl font-black text-red-800 mt-1 block">€ {nuovoTotaleFondoTFR.toFixed(2)}</span>
              <span className="text-[10px] text-red-700">Accantonamento aggiornato</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: AUDIT CEDOLINO                                    */}
      {/* ======================================================== */}
      {activeTab === 'audit_cedolino' && (
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-700" />
                Audit e Verifica Analitica Busta Paga
              </h2>
              <p className="text-xs text-slate-500">
                Acquisizione del cedolino (file/foto) o inserimento manuale delle voci per il riscontro dei minimi CCNL (Giugno 2026).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Carica File / Immagine Cedolino (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />
                {cedolinoFileName && (
                  <span className="text-xs text-slate-600 block mt-1 font-semibold">
                    File selezionato: {cedolinoFileName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lordo Totale Reale in Busta (€)
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    value={cedolinoLordoReale}
                    placeholder="Es. 2064.88"
                    onChange={(e) => setCedolinoLordoReale(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Netto Percepito in Busta (€)
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    value={cedolinoNettoReale}
                    placeholder="Es. 1650.00"
                    onChange={(e) => setCedolinoNettoReale(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analisi di conformità contrattuale in corso...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Esegui Audit Riscontro con Minimi CCNL</span>
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[220px]">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Esito del Riscontro Tecnico Sindacale
              </h4>
              {auditResult ? (
                <div className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {auditResult}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Carica un cedolino o inserisci i valori reali per avviare il confronto automatico.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
