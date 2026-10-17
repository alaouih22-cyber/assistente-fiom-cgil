import React, { useState } from 'react';
import { User } from '../../types/index.js';
import {
  Shield,
  Users,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface RsaRsuViewProps {
  currentUser: User;
  onOpenDocGenerator?: (templateId: string) => void;
}

export const RsaRsuView: React.FC<RsaRsuViewProps> = ({ currentUser, onOpenDocGenerator }) => {
  const [activeTab, setActiveTab] = useState<'confronto' | 'prerogative' | 'orientamento'>('confronto');

  // Interactive guidance form state
  const [employeeCount, setEmployeeCount] = useState<string>('120');
  const [hasExistingRep, setHasExistingRep] = useState<'none' | 'rsu_active' | 'rsu_expired' | 'rsa_other'>('rsu_active');
  const [ccnlStatus, setCcnlStatus] = useState<string>('ccnl_metalmeccanici');
  const [unionMembersPresent, setUnionMembersPresent] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [guidanceResult, setGuidanceResult] = useState<any>(null);

  const handleRunGuidance = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/rsa/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCount,
          hasExistingRep,
          ccnlStatus,
          unionMembersPresent
        })
      });
      const data = await res.json();
      setGuidanceResult(data);
    } catch (e) {
      console.error('Error running guidance:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner - Compact & Professional (Dark Green & Gold) */}
      <div className="bg-emerald-950 text-white rounded-xl p-4 sm:p-5 border border-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Rappresentanze Sindacali: Guida Ufficiale RSA e RSU
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
            Disciplina giuridica ex <strong>Legge 300/1970 (Statuto dei Lavoratori)</strong> e <strong>Testo Unico sulla Rappresentanza 10 gennaio 2014</strong>. Differenze, prerogative e percorsi di costituzione.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-emerald-900/80 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto border border-emerald-700/50">
          <button
            onClick={() => setActiveTab('confronto')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'confronto'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            RSA vs RSU
          </button>
          <button
            onClick={() => setActiveTab('prerogative')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'prerogative'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            Diritti & Statuto
          </button>
          <button
            onClick={() => setActiveTab('orientamento')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'orientamento'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            Orientamento Caso Reale
          </button>
        </div>
      </div>

      {/* Tab 1: Comparison RSA vs RSU */}
      {activeTab === 'confronto' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-800" />
              Che cosa sono RSA e RSU e quali sono le differenze legali
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Nell'ordinamento italiano la rappresentanza dei lavoratori nei luoghi di lavoro è articolata su due istituti distinti per natura giuridica, fonte istitutiva e modalità di designazione: la <strong>RSA</strong> e la <strong>RSU</strong>.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Caratteristica</th>
                    <th className="py-2.5 px-3 bg-amber-50/60 text-amber-950 border-x border-slate-200">
                      RSA (Rappresentanza Sindacale Aziendale)
                    </th>
                    <th className="py-2.5 px-3 bg-emerald-50/60 text-emerald-950">
                      RSU (Rappresentanza Sindacale Unitaria)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Fonte Giuridica</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      <strong>Art. 19 Legge 300/1970</strong> (come modificato da Corte Cost. n. 231/2013).
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      <strong>Accordo Interconfederale 10 gennaio 2014</strong> (Testo Unico sulla Rappresentanza Confindustria-CGIL-CISL-UIL).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Modalità di Costituzione</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      <strong>Designazione sindacale</strong> da parte delle organizzazioni sindacali firmatarie del CCNL o partecipanti attive alle trattative.
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      <strong>Elezione democratica a suffragio universale e segreto</strong> da parte di tutti i lavoratori (iscritti e non iscritti).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Elettorato Attivo e Passivo</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      Rappresenta formalmente l'associazione sindacale di appartenenza e tutela prioritariamente i lavoratori iscritti.
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      Hanno diritto di voto e di candidatura <strong>tutti i lavoratori</strong> in forza nell'unità produttiva (operai, impiegati, quadri).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Durata del Mandato</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      Non prefissata per legge; i dirigenti RSA possono essere revocati e sostituiti dall'organizzazione sindacale in qualsiasi momento.
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      <strong>3 anni tassativi</strong> a decorrere dalla proclamazione dei risultati. Al termine dei 3 anni decade automaticamente e si indicono nuove elezioni.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Titolarità Contrattuale</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      Può stipulare accordi aziendali vincolanti per i propri iscritti, salvo efficacia generalizzata pattuita tra le parti firmatarie.
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      <strong>Titolarità esclusiva</strong> della contrattazione collettiva aziendale di 2° livello, con efficacia vincolante per tutto il personale se approvata dalla maggioranza dei componenti.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Requisito Dimensionale</td>
                    <td className="py-2.5 px-3 border-x border-slate-200 bg-amber-50/20">
                      Unità produttive con <strong>più di 15 dipendenti</strong> (art. 35 L. 300/1970).
                    </td>
                    <td className="py-2.5 px-3 bg-emerald-50/20">
                      Unità produttive con <strong>più di 15 dipendenti</strong> (nelle unità minori si applicano le intese di comparto o RLST).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Constitutional Court Sentence Focus Note */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Sentenza Cardine della Corte Costituzionale n. 231/2013 sull'Art. 19
            </div>
            <p>
              La Corte Costituzionale ha dichiarato l'illegittimità dell'art. 19, comma 1, lett. b) dello Statuto dei Lavoratori nella parte in cui non riconosceva il diritto a costituire RSA anche alle associazioni sindacali che, pur non avendo sottoscritto formalmente i contratti collettivi applicati nell'unità produttiva, abbiano comunque <strong>partecipato attivamente alla negoziazione</strong> degli stessi. Questa storica sentenza garantisce la piena agibilità sindacale della FIOM-CGIL.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Prerogatives & Statutory Rights */}
      {activeTab === 'prerogative' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-800" />
              Prerogative e Diritti Sindacali ex Titolo III Legge 300/1970
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              I diritti di seguito elencati competono sia alla RSU che alle RSA nelle unità con oltre 15 dipendenti:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 20 – Diritto di Assemblea</span>
                  <span className="text-2xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">10 ore/anno</span>
                </div>
                <p className="text-slate-600 mt-1">
                  I lavoratori hanno diritto di riunirsi nella propria unità produttiva fuori orario o entro il limite di <strong>10 ore annue retribuite</strong>. L'assemblea è convocata dalla RSU o congiuntamente/singolarmente dalle RSA con preavviso alla Direzione.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 21 – Referendum Aziendale</span>
                  <span className="text-2xs bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">Scrutinio segreto</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Il datore deve consentire lo svolgimento di referendum su materie inerenti all'attività sindacale, tra tutti i lavoratori, fuori dall'orario di lavoro, indetto da tutte le RSA o dalla RSU.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 22 – Tutela contro Trasferimenti</span>
                  <span className="text-2xs bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">Nulla osta obbligatorio</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Il trasferimento da una unità produttiva ad un'altra dei dirigenti delle RSA o dei componenti della RSU può essere disposto solo previo <strong>nulla osta vincolante</strong> dell'associazione sindacale di appartenenza.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 23 & 24 – Permessi Sindacali</span>
                  <span className="text-2xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Retribuiti e non</span>
                </div>
                <p className="text-slate-600 mt-1">
                  I dirigenti RSA e i componenti RSU hanno diritto a <strong>permessi retribuiti</strong> per l'espletamento del mandato sindacale (monte ore fissato dal CCNL Metalmeccanici) e a permessi non retribuiti (art. 24) per partecipazione a congressi e riunioni.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 25 – Diritto di Affissione</span>
                  <span className="text-2xs bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">Bacheca aziendale</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Le rappresentanze sindacali hanno diritto di affiggere, su appositi spazi che il datore di lavoro ha l'obbligo di predisporre in luoghi accessibili a tutti, pubblicazioni, testi e comunicati sindacali.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Art. 28 – Condotta Antisindacale</span>
                  <span className="text-2xs bg-rose-100 text-rose-900 font-bold px-1.5 py-0.5 rounded">Ricorso d'urgenza</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Qualora il datore di lavoro ponga in essere comportamenti diretti a impedire o limitare l'esercizio della libertà e dell'attività sindacale o del diritto di sciopero, il Tribunale competente ordina la cessazione del comportamento con decreto motivato.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Practical Orientation */}
      {activeTab === 'orientamento' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Orientamento Pratico Personalizzato: Quale percorso attivare nel tuo luogo di lavoro?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Inserisci i dati reali della tua unità produttiva per ricevere la diagnosi giuridica, le prerogative applicabili e i passi operativi con la FIOM-CGIL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Numero di lavoratori nell'unità produttiva:
                </label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  min="1"
                  max="5000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  placeholder="Es. 120"
                />
                <span className="text-2xs text-slate-500 mt-0.5 block">
                  Soglia discriminante ex art. 35 Statuto dei Lavoratori: 15 dipendenti.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Situazione attuale della rappresentanza sindacale:
                </label>
                <select
                  value={hasExistingRep}
                  onChange={(e: any) => setHasExistingRep(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="rsu_active">RSU eletta ed attualmente in carica</option>
                  <option value="none">Nessuna rappresentanza presente in azienda</option>
                  <option value="rsu_expired">RSU precedentemente eletta ma scaduta (oltre 3 anni)</option>
                  <option value="rsa_other">Presente solo RSA di altra organizzazione</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contratto Collettivo Applicato:
                </label>
                <select
                  value={ccnlStatus}
                  onChange={(e) => setCcnlStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="ccnl_metalmeccanici">CCNL Metalmeccanici Industria (Federmeccanica-Assistal)</option>
                  <option value="ccnl_confapi">CCNL Metalmeccanici Piccola e Media Industria (Unionmeccanica-Confapi)</option>
                  <option value="altro">Altro CCNL o da accertare</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="membersCheck"
                  checked={unionMembersPresent}
                  onChange={(e) => setUnionMembersPresent(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-700"
                />
                <label htmlFor="membersCheck" className="text-xs text-slate-700 font-medium">
                  Sono presenti lavoratori iscritti o disposti a iscriversi alla FIOM-CGIL
                </label>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleRunGuidance}
                disabled={isEvaluating}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{isEvaluating ? 'Valutazione in corso...' : 'Calcola Diagnosi Giuridica'}</span>
              </button>
            </div>
          </div>

          {/* Results Card */}
          {guidanceResult && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-emerald-800/40 shadow-sm space-y-4">
              <div>
                <span className="text-2xs font-extrabold text-emerald-900 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                  Diagnosi Situazione di Stabilimento
                </span>
                <h3 className="text-base font-bold text-slate-950 mt-1">
                  {guidanceResult.pathTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Base normativa: <em>{guidanceResult.legalBasis}</em>
                </p>
              </div>

              {guidanceResult.warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>{guidanceResult.warning}</div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Passi Procedurali Raccomandati:
                </h4>
                <ol className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {guidanceResult.stepByStep?.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-3xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Prerogative e Tutele di cui hai diritto:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {guidanceResult.rightsAvailable?.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FIOM Verified Territorial Contact */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Contatto Verificato: {guidanceResult.fiomContact.sede}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                    <span>{guidanceResult.fiomContact.indirizzo}</span>
                    <span>Tel: {guidanceResult.fiomContact.telefono}</span>
                    <span>Email: {guidanceResult.fiomContact.email}</span>
                  </div>
                </div>

                {onOpenDocGenerator && (
                  <button
                    onClick={() => onOpenDocGenerator('tmpl-richiesta-incontro')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs shrink-0 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prepara richiesta formale</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
