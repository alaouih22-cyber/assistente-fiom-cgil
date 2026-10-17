import React, { useState, useRef, useEffect } from 'react';
import { User, AISearchResponse, AISearchResult } from '../../types/index.js';
import {
  Search,
  Sparkles,
  Folder,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Layers,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  MessageSquare,
  CornerDownRight
} from 'lucide-react';

interface UniversalAISearchBarProps {
  currentUser: User;
  onNavigateToTarget: (target: AISearchResult['navigationTarget']) => void;
  compact?: boolean;
}

export const UniversalAISearchBar: React.FC<UniversalAISearchBarProps> = ({
  currentUser,
  onNavigateToTarget,
  compact = false
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<AISearchResponse | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [followUpText, setFollowUpText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = [
    'Dove trovo la legge sui controlli a distanza dei lavoratori?',
    'Cerca nel CCNL le regole sugli straordinari e le maggiorazioni',
    'Portami alla parte sulla classificazione professionale e sui livelli',
    'Dove abbiamo archiviato la comunicazione della direzione sulla modifica dell\'orario?',
    'Cerca il verbale in cui abbiamo parlato dei turni',
    'Cerca le clausole che regolano il preavviso',
    'Mostrami tutte le fonti che parlano di cambio mansione',
    'Trova le disposizioni sulla sicurezza e sul ruolo dell\'RLS',
    'Trova la cartella contenente i verbali delle riunioni sindacali'
  ];

  const handleSearch = async (queryString?: string, isFollowUp: boolean = false) => {
    const q = queryString || (isFollowUp ? followUpText : query);
    if (!q.trim()) return;

    setIsSearching(true);
    setIsOpenModal(true);

    try {
      const historyPayload = isFollowUp ? conversationHistory : [];
      const res = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          query: q,
          categoryFilter: selectedCategory,
          history: historyPayload
        })
      });

      const data: AISearchResponse = await res.json();
      setSearchResponse(data);

      // Track in conversational history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', text: q },
        { role: 'model', text: data.aiSynthesis }
      ]);
      setFollowUpText('');
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDirectNavigation = (target: AISearchResult['navigationTarget']) => {
    setIsOpenModal(false);
    onNavigateToTarget(target);
  };

  const getSourceIcon = (sourceType: AISearchResult['sourceType']) => {
    switch (sourceType) {
      case 'legge':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'ccnl':
        return <Layers className="w-4 h-4 text-blue-600" />;
      case 'accordo_aziendale':
      case 'verbale':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'modello':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <Folder className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      {/* Search Input Bar (Mounted prominently in header or dashboard) */}
      <div className={`relative ${compact ? 'w-full max-w-md' : 'w-full max-w-2xl'}`}>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-red-700">
            <Search className="w-4 h-4 text-slate-400" />
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse hidden sm:block" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Cerca con AI: «controlli a distanza», «verbale turni», «preavviso», «straordinari»..."
            className="w-full bg-slate-50 border border-slate-300 hover:border-red-400 focus:border-red-600 rounded-2xl pl-11 pr-24 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600/20 focus:bg-white shadow-2xs transition"
          />

          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="absolute right-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 disabled:opacity-40 shadow-xs"
          >
            <span>Cerca AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full Modal Search Drawer */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-red-900 via-red-800 to-slate-950 text-white">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-700 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                      Ricerca Intelligente AI – Archivio Sindacale CSI Colombella
                    </h3>
                    <p className="text-2xs text-red-200">
                      Indicizzazione semantica conforme RBAC • Norme, CCNL, Verbali RSU, Comunicazioni Direzione
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpenModal(false)}
                  className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Search Field in modal */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="Chiedi in linguaggio naturale..."
                    className="w-full bg-white text-slate-900 border-none rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-300 transition shrink-0"
                >
                  {isSearching ? 'Ricerca...' : 'Cerca'}
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 text-3xs font-bold">
                {[
                  { id: 'all', label: 'Tutto l\'Archivio' },
                  { id: 'normativa', label: 'Leggi & Statuto' },
                  { id: 'ccnl', label: 'CCNL Metalmeccanici' },
                  { id: 'accordi', label: 'Accordi Aziendali' },
                  { id: 'verbali', label: 'Verbali RSU' },
                  { id: 'modelli', label: 'Modelli & Bozze' },
                  { id: 'pratiche', label: 'Pratiche' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedCategory(f.id);
                      if (query) handleSearch(query);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      selectedCategory === f.id
                        ? 'bg-white text-red-900 shadow-2xs font-extrabold'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Results or sample suggestions */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
              {/* Sample Prompts if no results yet */}
              {!searchResponse && !isSearching && (
                <div className="space-y-3">
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                    Esempi di Ricerca in Linguaggio Naturale
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(p);
                          handleSearch(p);
                        }}
                        className="text-left p-3 bg-white rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/40 transition shadow-2xs group flex items-start gap-2.5 text-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-800 group-hover:text-red-900">
                          «{p}»
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
                  <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin text-red-700" />
                  </div>
                  <p className="font-bold text-sm text-slate-800">
                    Analisi semantica e recupero nei contenuti autorizzati...
                  </p>
                  <p className="text-2xs text-slate-500">
                    Consultazione Statuto Lavoratori, CCNL Federmeccanica-Assistal, verbali e accordi CSI
                  </p>
                </div>
              )}

              {/* Search Synthesis Output Card */}
              {searchResponse && !isSearching && (
                <div className="space-y-4">
                  {/* AI Synthesis Summary */}
                  <div className="bg-gradient-to-br from-red-50 to-amber-50/60 rounded-2xl p-4 sm:p-5 border border-red-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-red-950 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Risposta e Valutazione AI dai Documenti Recuperati</span>
                      </div>
                      <span className="text-3xs font-extrabold bg-red-200/80 text-red-900 px-2 py-0.5 rounded-full">
                        {searchResponse.totalMatches} Fonti Pertinenti
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                      {searchResponse.aiSynthesis}
                    </div>

                    {/* Folders found badges */}
                    {searchResponse.foldersFound.length > 0 && (
                      <div className="pt-2 border-t border-red-200/60 flex flex-wrap items-center gap-1.5 text-2xs">
                        <span className="font-bold text-slate-600">Cartelle interessate:</span>
                        {searchResponse.foldersFound.map((f, i) => (
                          <span
                            key={i}
                            className="bg-white/80 border border-red-200 text-red-950 px-2 py-0.5 rounded-md font-mono text-3xs font-semibold flex items-center gap-1"
                          >
                            <Folder className="w-3 h-3 text-red-600" />
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* List of matched cards */}
                  <div className="space-y-3">
                    <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Documenti, Articoli e Clausole Specifiche Trovate</span>
                      <span className="text-3xs text-slate-400">Ordinati per pertinenza semantica</span>
                    </div>

                    {searchResponse.results.map((res) => (
                      <div
                        key={res.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:border-red-400 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          {/* Badges: folder path & source type */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-3xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                                {getSourceIcon(res.sourceType)}
                                <span className="uppercase">{res.sourceType.replace('_', ' ')}</span>
                              </span>

                              <span className="text-3xs font-mono font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                {res.folderPath}
                              </span>
                            </div>

                            <span className="text-3xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Pertinenza: {res.relevanceScore}%
                            </span>
                          </div>

                          {/* Title & Section Clause */}
                          <div>
                            <h4 className="font-bold text-sm sm:text-base text-slate-900">
                              {res.title}
                            </h4>
                            <div className="text-xs font-semibold text-red-700 mt-0.5">
                              {res.sectionClause}
                            </div>
                          </div>

                          {/* Original Text Extract */}
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-serif italic leading-relaxed">
                            "{res.extract}"
                          </div>

                          {/* Relevance Explanation */}
                          <div className="text-2xs text-slate-600 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Perché è pertinente:</strong> {res.explanation}</span>
                          </div>
                        </div>

                        {/* Card Action Button Bar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 text-3xs text-slate-400">
                            <span>Versione: {res.version}</span>
                            <span>•</span>
                            <span>Verificato: {res.lastVerified}</span>
                            {res.officialUrl && (
                              <a
                                href={res.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-700 hover:underline flex items-center gap-0.5 ml-1 font-bold"
                              >
                                Fonte Ufficiale <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => handleDirectNavigation(res.navigationTarget)}
                            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                          >
                            <span>{res.navigationTarget.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {searchResponse.results.length === 0 && (
                      <div className="p-8 bg-white rounded-2xl text-center text-slate-500 border border-slate-200 space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                        <h4 className="font-bold text-slate-800">Nessun documento trovato</h4>
                        <p className="text-xs">
                          Non è stato trovato alcun documento o clausola contrattuale corrispondente a "{query}" nei fascicoli autorizzati per il profilo <strong>{currentUser.role.toUpperCase()}</strong>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Conversational Follow-up questions */}
                  {searchResponse.suggestedQuestions && (
                    <div className="pt-2">
                      <div className="text-3xs uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                        <span>Approfondimenti suggeriti</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {searchResponse.suggestedQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setFollowUpText(q);
                              handleSearch(q, true);
                            }}
                            className="bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 text-2xs px-2.5 py-1 rounded-xl transition shadow-2xs"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up input form */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-2xs font-bold text-slate-700 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-red-700" />
                      Continua la ricerca o chiedi chiarimenti su questi risultati:
                    </span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(followUpText, true);
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder="es. «Spiegami meglio il secondo risultato» oppure «Cosa manca per applicarlo?»"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                      />
                      <button
                        type="submit"
                        disabled={!followUpText.trim()}
                        className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 disabled:opacity-40"
                      >
                        Invia
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
