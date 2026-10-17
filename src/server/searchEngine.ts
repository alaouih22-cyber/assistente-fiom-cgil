import { db } from './db.js';
import { askGeminiAssistant } from './gemini.js';
import { NORMATIVA_DATABASE, NormativaItem } from '../data/normativa.js';
import { CCNL_METALMECCANICI_LEVELS, MAGGIORAZIONI_CCNL_METALMECCANICI, COMPORTO_CCNL_METALMECCANICI } from '../data/ccnl.js';
import { UNION_DOCUMENT_TEMPLATES } from '../data/templates.js';
import { User, AISearchResult, AISearchResponse } from '../types/index.js';

interface IndexedSearchItem {
  id: string;
  title: string;
  folderPath: string;
  sourceType: AISearchResult['sourceType'];
  sectionClause: string;
  fullText: string;
  extract: string;
  version: string;
  lastVerified: string;
  officialUrl?: string;
  visibility: 'public' | 'sindacale' | 'confidenziale' | 'privato_lavoratore';
  workerId?: string;
  navigationTarget: AISearchResult['navigationTarget'];
  keywords: string[];
}

export function buildSearchIndex(currentUser: User): IndexedSearchItem[] {
  const index: IndexedSearchItem[] = [];

  // 1. Laws & Statuto dei Lavoratori
  NORMATIVA_DATABASE.forEach((norma) => {
    index.push({
      id: `norma_${norma.id}`,
      title: norma.titolo,
      folderPath: `/Normativa Nazionale/${norma.articoloSezione.split(' ')[0]}/`,
      sourceType: 'legge',
      sectionClause: norma.articoloSezione,
      fullText: `${norma.titolo} ${norma.riassunto} ${norma.testoPertinente} ${norma.paroleChiave.join(' ')}`,
      extract: norma.testoPertinente.slice(0, 280) + '...',
      version: 'Normattiva Coordinata Vigente',
      lastVerified: norma.ultimaVerifica,
      officialUrl: norma.urlVerificato,
      visibility: 'public',
      navigationTarget: {
        tab: 'normativa',
        targetId: norma.id,
        actionLabel: `Vai all'articolo (${norma.articoloSezione})`
      },
      keywords: [...norma.paroleChiave, 'legge', 'codice civile', 'statuto lavoratori', 'parlamento']
    });
  });

  // 2. CCNL Metalmeccanici Levels & Classification
  CCNL_METALMECCANICI_LEVELS.forEach((lvl) => {
    index.push({
      id: `ccnl_lvl_${lvl.code}`,
      title: `CCNL Metalmeccanici - Classificazione Professionale Livello ${lvl.code} (Ex ${lvl.exLevel})`,
      folderPath: '/CCNL Metalmeccanici/Classificazione e Livelli/',
      sourceType: 'ccnl',
      sectionClause: `Titolo II - Livello ${lvl.code} (${lvl.field})`,
      fullText: `Livello ${lvl.code} ex ${lvl.exLevel} ${lvl.field} minimo tabellare base ${lvl.monthlyBasePay} euro ${lvl.declaratoria} ${lvl.esempiMansioniMetalmeccaniche.join(' ')}`,
      extract: `Declaratoria: ${lvl.declaratoria} - Minimo tabellare lordo mensile: € ${lvl.monthlyBasePay.toFixed(2)}. Mansioni: ${lvl.esempiMansioniMetalmeccaniche.slice(0, 2).join(', ')}.`,
      version: 'CCNL Federmeccanica-Assistal 2021-2024 / Decorrenze 2024-2026',
      lastVerified: '2026-01-01',
      officialUrl: 'https://www.federmeccanica.it/ccnl-metalmeccanici.html',
      visibility: 'public',
      navigationTarget: {
        tab: 'ccnl',
        targetId: lvl.code,
        subTab: 'livelli',
        actionLabel: `Apri declaratoria Livello ${lvl.code}`
      },
      keywords: ['livello', 'classificazione', 'mansioni', 'declaratoria', lvl.code, lvl.exLevel, 'retribuzione fissa', 'inquadramento']
    });
  });

  // 3. CCNL Overtime & Shift Allowances
  MAGGIORAZIONI_CCNL_METALMECCANICI.forEach((mag) => {
    index.push({
      id: `ccnl_mag_${mag.id}`,
      title: `CCNL Metalmeccanici - ${mag.nome} (+${mag.percentuale}%)`,
      folderPath: '/CCNL Metalmeccanici/Maggiorazioni e Orari/',
      sourceType: 'ccnl',
      sectionClause: mag.riferimentoCCNL,
      fullText: `${mag.nome} ${mag.percentuale}% ${mag.descrizione} ${mag.riferimentoCCNL} straordinario turni notte festivo ciclo continuo divisore 173`,
      extract: `${mag.descrizione} Maggiorazione contrattuale spettante: +${mag.percentuale}% calcolata sulla paga oraria base (divisore 173).`,
      version: 'Art. 7 Sez. Quarta Titolo III',
      lastVerified: '2026-01-01',
      visibility: 'public',
      navigationTarget: {
        tab: 'ccnl',
        subTab: 'maggiorazioni',
        actionLabel: `Apri tabella maggiorazioni (+${mag.percentuale}%)`
      },
      keywords: ['straordinario', 'maggiorazione', 'notturno', 'festivo', 'turni', 'orario', 'banca ore', 'riposi']
    });
  });

  // 4. CCNL Comporto
  COMPORTO_CCNL_METALMECCANICI.forEach((comp, idx) => {
    index.push({
      id: `ccnl_comp_${idx}`,
      title: `CCNL Metalmeccanici - Periodo di Comporto per Malattia (${comp.anzianitaAnni})`,
      folderPath: '/CCNL Metalmeccanici/Comporto Malattia/',
      sourceType: 'ccnl',
      sectionClause: 'Art. 2 Sez. Quarta Titolo VI',
      fullText: `Comporto malattia conservazione posto ${comp.anzianitaAnni} mesi ${comp.comportoBreveMesi} prolungato ${comp.comportoProlungatoMesi} giorni ${comp.conservazionePostoGiorni}`,
      extract: `Anzianità ${comp.anzianitaAnni}: conservazione del posto per ${comp.comportoBreveMesi} mesi ordinari (${comp.conservazionePostoGiorni} giorni) ed elevabile a ${comp.comportoProlungatoMesi} mesi per gravi patologie continuative.`,
      version: 'CCNL Metalmeccanici Industria',
      lastVerified: '2026-01-01',
      visibility: 'public',
      navigationTarget: {
        tab: 'ccnl',
        subTab: 'comporto',
        actionLabel: 'Consulta periodo di comporto'
      },
      keywords: ['malattia', 'comporto', 'conservazione posto', 'assenza', 'infortunio', 'aspettativa']
    });
  });

  // 5. Documents & Folders in Archive (RBAC filtered)
  const docs = db.getDocuments(currentUser.role, currentUser.id);
  docs.forEach((doc) => {
    const safeFolder = doc.folderPath || '/Archivio Generale/';
    index.push({
      id: `doc_${doc.id}`,
      title: doc.title,
      folderPath: safeFolder,
      sourceType: doc.category === 'accordo_aziendale' ? 'accordo_aziendale' :
                  doc.category === 'verbale' ? 'verbale' :
                  doc.category === 'comunicazione_direzione' ? 'comunicazione_direzione' :
                  doc.category === 'ccnl' ? 'ccnl' : 'legge',
      sectionClause: doc.sectionClause || 'Archivio Documentale',
      fullText: `${doc.title} ${doc.description || ''} ${doc.contentSummary || ''} ${doc.fullContent || ''} ${(doc.tags || []).join(' ')} ${safeFolder}`,
      extract: doc.fullContent ? doc.fullContent.slice(0, 280) + '...' : (doc.contentSummary || doc.description || ''),
      version: doc.version || '1.0',
      lastVerified: doc.updatedAt || '2026-01-01',
      officialUrl: doc.verifiedSourceUrl,
      visibility: doc.visibility || 'public',
      workerId: doc.workerId,
      navigationTarget: {
        tab: 'archive',
        targetId: doc.id,
        targetFolder: safeFolder,
        actionLabel: `Apri documento in ${safeFolder}`
      },
      keywords: [...(doc.tags || []), 'documento', 'archivio', doc.filename || '', doc.author || '']
    });
  });

  // 6. Union Document Templates & Drafts
  UNION_DOCUMENT_TEMPLATES.forEach((tmpl) => {
    index.push({
      id: `tmpl_${tmpl.id}`,
      title: `Modello Sindacale: ${tmpl.titolo}`,
      folderPath: '/Procedure e Modelli/Bozze Atti Sindacali/',
      sourceType: 'modello',
      sectionClause: tmpl.normativaRiferimento,
      fullText: `${tmpl.titolo} ${tmpl.descrizione} ${tmpl.normativaRiferimento} ${tmpl.corpoTesto} ${tmpl.destinatario}`,
      extract: `${tmpl.descrizione} Riferimento: ${tmpl.normativaRiferimento}. Destinatario: ${tmpl.destinatario}.`,
      version: 'Modello FIOM Perugia 2026',
      lastVerified: '2026-02-01',
      visibility: 'public',
      navigationTarget: {
        tab: 'doc_generator',
        targetId: tmpl.id,
        actionLabel: `Compila bozza (${tmpl.titolo.slice(0, 30)}...)`
      },
      keywords: ['modello', 'bozza', 'lettera', 'fac-simile', 'istanza', 'procedura', tmpl.categoria]
    });
  });

  // 7. Tickets / Pratiche (authorized only)
  const tickets = db.getTickets(currentUser.role, currentUser.id);
  tickets.forEach((t) => {
    index.push({
      id: `ticket_${t.id}`,
      title: `Pratica ${t.code}: ${t.title}`,
      folderPath: `/Pratiche e Vertenze/${t.category.toUpperCase()}/`,
      sourceType: 'pratica',
      sectionClause: `Pratica ${t.code} (${t.status})`,
      fullText: `${t.code} ${t.title} ${t.description} ${t.workerName} ${t.workerDepartment} ${t.notes.map(n => n.content).join(' ')}`,
      extract: `Pratica ${t.code} aperta per ${t.workerName} (${t.workerDepartment}): ${t.description.slice(0, 200)}...`,
      version: `Stato: ${t.status}`,
      lastVerified: t.updatedAt.split('T')[0],
      visibility: 'sindacale',
      workerId: t.workerId,
      navigationTarget: {
        tab: 'tickets',
        targetId: t.id,
        actionLabel: `Apri pratica ${t.code}`
      },
      keywords: [t.code, 'pratica', 'vertenza', t.category, t.workerName]
    });
  });

  // 8. Circulars
  const circulars = db.getCirculars();
  circulars.forEach((circ) => {
    index.push({
      id: `circ_${circ.id}`,
      title: circ.title,
      folderPath: '/Comunicazioni FIOM/Circolari Ufficiali/',
      sourceType: 'circolare',
      sectionClause: circ.code,
      fullText: `${circ.code} ${circ.title} ${circ.summary} ${circ.content} ${circ.category} ${circ.author}`,
      extract: circ.summary,
      version: circ.code,
      lastVerified: circ.publishedAt.split('T')[0],
      visibility: 'public',
      navigationTarget: {
        tab: 'plant_info',
        actionLabel: `Leggi circolare (${circ.code})`
      },
      keywords: [circ.code, 'circolare', 'comunicazione', 'fiom', circ.category]
    });
  });

  return index;
}

export async function executeSemanticAISearch(
  query: string,
  currentUser: User,
  categoryFilter: string = 'all',
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<AISearchResponse> {
  const index = buildSearchIndex(currentUser);

  // Apply category filtering if requested
  let candidates = index;
  if (categoryFilter !== 'all') {
    if (categoryFilter === 'normativa') candidates = index.filter(i => i.sourceType === 'legge');
    else if (categoryFilter === 'ccnl') candidates = index.filter(i => i.sourceType === 'ccnl');
    else if (categoryFilter === 'accordi') candidates = index.filter(i => i.sourceType === 'accordo_aziendale');
    else if (categoryFilter === 'verbali') candidates = index.filter(i => i.sourceType === 'verbale');
    else if (categoryFilter === 'modelli') candidates = index.filter(i => i.sourceType === 'modello');
    else if (categoryFilter === 'pratiche') candidates = index.filter(i => i.sourceType === 'pratica');
  }

  // Multi-term and semantic scoring
  const queryLower = query.toLowerCase().trim();
  const tokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  // Semantic query expansion synonyms for Italian labor law & metalworking
  const expansions: Record<string, string[]> = {
    'controlli': ['art. 4', 'controllo a distanza', 'telecamere', 'audiovisivi', 'badge', 'gps', 'privacy'],
    'distanza': ['art. 4', 'controllo', 'telecamere', 'sorveglianza'],
    'telecamere': ['art. 4', 'controllo a distanza', 'accordo rsu', 'impianti audiovisivi'],
    'orario': ['slitter', 'turni', 'modifica temporanea', 'pause', 'comunicazione direzione', 'dlgs 66/2003'],
    'turni': ['slitter', 'nastri', 'ciclo continuo', 'avvicendati', 'indennità', 'notturno', 'pause', 'verbale'],
    'straordinari': ['maggiorazione', '25%', '30%', '50%', '65%', 'festivo', 'notturno', 'art. 7 sez. quarta'],
    'maggiorazioni': ['25%', '30%', '50%', '65%', 'notturno festivo', 'turno pomeriggio 8%', 'turno notte 30%'],
    'preavviso': ['dimissioni', 'licenziamento', 'indennità sostitutiva', 'titolo viii', 'termini'],
    'mansione': ['mansioni superiori', 'art. 2103', 'passaggio livello', 'declaratoria', 'inquadramento', 'demansionamento'],
    'mansioni': ['art. 2103', 'mansioni superiori', 'declaratoria', 'livello d2', 'livello c1', 'livello c2'],
    'livelli': ['d1', 'd2', 'c1', 'c2', 'c3', 'b1', 'b2', 'b3', 'a1', 'classificazione', 'tabellari'],
    'classificazione': ['d1', 'd2', 'c1', 'c2', 'c3', 'declaratoria', 'inquadramento'],
    'verbale': ['verbale rsu', 'riunioni bilaterali', 'incontro sindacale', 'turni e pause', 'accordo'],
    'verbali': ['verbale rsu', 'cartella verbali riunioni', 'archivio rsu', 'trattativa'],
    'sicurezza': ['rls', 'dlgs 81/2008', 'dvr', 'filtri', 'aspirazione', 'sopralluogo', 'pericolo grave'],
    'rls': ['dlgs 81/2008', 'art. 50', 'consultazione', 'sopralluoghi', 'segnalazione rls', 'dvr'],
    'ferie': ['riposi', 'banca ore', 'rol', 'par', '4 settimane', 'art. 36 costituzione', 'art. 10 dlgs 66/2003'],
    'assemblee': ['assemblea retribuita', 'art. 20', 'statuto lavoratori', '10 ore', 'permessi sindacali'],
    'assemblea': ['art. 20', '10 ore annue', 'convocazione assemblea', 'sala mensa'],
    'disciplinare': ['contestazione', 'art. 7', '5 giorni', 'giustificazioni', 'difesa', 'audizione'],
    'contestazione': ['art. 7', 'giustificazioni', '5 giorni', 'lettera addebito', 'memorie', 'audizione'],
    'cartella': ['folder', 'percorso', 'archivio rsu', 'comunicazioni direzione', 'secondo livello']
  };

  const expandedTokens = new Set<string>(tokens);
  tokens.forEach(tok => {
    Object.keys(expansions).forEach(key => {
      if (tok.includes(key) || key.includes(tok)) {
        expansions[key].forEach(syn => expandedTokens.add(syn.toLowerCase()));
      }
    });
  });

  // Calculate scores
  const scoredItems = candidates.map((item) => {
    let score = 0;
    const full = (item.fullText || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const folder = (item.folderPath || '').toLowerCase();

    // Exact phrase match
    if (full.includes(queryLower)) score += 80;
    if (title.includes(queryLower)) score += 100;
    if (folder.includes(queryLower)) score += 60;

    // Token matches
    tokens.forEach((tok) => {
      if (title.includes(tok)) score += 25;
      if (folder.includes(tok)) score += 15;
      if (full.includes(tok)) score += 10;
    });

    // Expanded synonym matches
    expandedTokens.forEach((syn) => {
      if (title.includes(syn)) score += 12;
      if (full.includes(syn)) score += 6;
      if (folder.includes(syn)) score += 8;
    });

    return { item, score };
  });

  // Sort and pick top results
  const sorted = scoredItems
    .filter(s => s.score > 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const foldersFound = Array.from(new Set(sorted.map(s => s.item.folderPath)));

  const formattedResults: AISearchResult[] = sorted.map(({ item, score }) => ({
    id: item.id,
    title: item.title,
    folderPath: item.folderPath,
    sourceType: item.sourceType,
    sectionClause: item.sectionClause,
    extract: item.extract,
    explanation: getExplanationForMatch(queryLower, item),
    version: item.version,
    lastVerified: item.lastVerified,
    officialUrl: item.officialUrl,
    relevanceScore: Math.min(99, Math.round(score)),
    navigationTarget: item.navigationTarget
  }));

  // Step 5: Synthesize with Gemini if available for conversational answer
  let aiSynthesis = '';
  let intent = 'Ricerca archivio sindacale e fonti contrattuali';

  if (process.env.GEMINI_API_KEY && formattedResults.length > 0) {
    try {
      const topContext = formattedResults.slice(0, 4).map((r, i) =>
        `[RISULTATO ${i + 1}] Titolo: ${r.title} | Cartella: ${r.folderPath} | Sezione: ${r.sectionClause} | Estratto: "${r.extract}"`
      ).join('\n\n');

      const promptSynthesis = `L'utente (Ruolo: ${currentUser.role}) ha cercato nell'archivio sindacale: "${query}".
Risultati autorizzati recuperati dal database aziendale e contrattuale:
${topContext}

Fornisci una sintesi precisa in italiano (massimo 3-4 frasi chiare) che:
1. Risponda direttamente alla domanda indicando la cartella, il documento, la legge o la clausola contrattuale esatta in cui si trova l'informazione.
2. Citi fedelmente gli articoli o le disposizioni pertinenti (es. Art. 4 L. 300/70, Art. 7, CCNL Sez. 4, o il verbale di stabilimento).
3. Segnali se vi sono informazioni mancanti (es. accordi integrativi ancora da verificare).
4. Non inventare documenti inesistenti.`;

      const aiRes = await askGeminiAssistant(promptSynthesis);
      if (aiRes.isFallback) {
        aiSynthesis = generateFallbackSynthesis(queryLower, formattedResults);
      } else {
        aiSynthesis = aiRes.text;
      }
      intent = `Ricerca semantica completata per "${query}"`;
    } catch (e) {
      aiSynthesis = generateFallbackSynthesis(queryLower, formattedResults);
    }
  } else {
    aiSynthesis = generateFallbackSynthesis(queryLower, formattedResults);
  }

  return {
    query,
    intent,
    aiSynthesis,
    results: formattedResults,
    foldersFound,
    totalMatches: formattedResults.length,
    userRoleApplied: currentUser.role,
    suggestedQuestions: generateSuggestedQuestions(queryLower)
  };
}

function getExplanationForMatch(query: string, item: IndexedSearchItem): string {
  if (query.includes('control') || query.includes('telecamer') || query.includes('distanza')) {
    if (item.id.includes('art4') || item.title.includes('Controlli')) {
      return 'Risultato cardine: disciplina il divieto di controllo a distanza e l obbligo di accordo RSU o autorizzazione ITL per impianti audiovisivi.';
    }
  }
  if (query.includes('preavviso')) {
    return 'Clausola contrattuale ufficiale: stabilisce i termini esatti di preavviso graduati in base a livello contrattuale e anzianità di servizio.';
  }
  if (query.includes('orario') || query.includes('slitter')) {
    return 'Documento aziendale ufficiale: contiene la disposizione formale della Direzione CSI di modifica orario della linea slitter.';
  }
  if (query.includes('verbale') || query.includes('turni')) {
    return 'Verbale formale RSU: riporta i punti concordati tra delegazione FIOM e Direzione CSI Colombella su pause fisiologiche e turni.';
  }
  if (query.includes('mansion') || query.includes('livell')) {
    return 'Fonte contrattuale/normativa: stabilisce i requisiti professionali, la declaratoria e il diritto al livello superiore ex art. 2103 c.c.';
  }
  if (query.includes('sicurezza') || query.includes('rls')) {
    return 'Normativa e procedura RLS: disciplina le attribuzioni, l accesso agli ambienti e le facoltà di ricorso ex art. 50 D.Lgs. 81/08.';
  }
  return `Corrispondenza rilevata in ${item.folderPath} sulla base delle clausole e parole chiave analizzate.`;
}

function generateFallbackSynthesis(query: string, results: AISearchResult[]): string {
  if (results.length === 0) {
    return `Nessun documento o clausola contrattuale corrispondente a "${query}" è stato trovato nell'archivio attualmente autorizzato per il tuo ruolo. Se ritieni che il documento esista, contatta i delegati RSU o verifica se è necessaria un'indicizzazione specifica.`;
  }

  const first = results[0];
  return `In merito alla richiesta "${query}", la fonte più pertinente individuata è **${first.title}** archiviata nel percorso \`${first.folderPath}\` (${first.sectionClause}). Puoi accedere direttamente al documento, all'articolo o alla clausola contrattuale tramite i pulsanti sottostanti.`;
}

function generateSuggestedQuestions(query: string): string[] {
  if (query.includes('control') || query.includes('distanza')) {
    return [
      'Quali sono i limiti di utilizzo delle registrazioni badge e telecamere?',
      'Come richiedere l intervento della RSU per impianti di videosorveglianza?',
      'Apri l articolo 4 dello Statuto dei Lavoratori'
    ];
  }
  if (query.includes('turni') || query.includes('orari')) {
    return [
      'Quali sono le maggiorazioni per il 3° turno notturno?',
      'Come si calcola la pausa di 30 minuti nei turni a ciclo continuo?',
      'Mostrami il verbale RSU sui turni e pause'
    ];
  }
  if (query.includes('preavviso')) {
    return [
      'Come si calcola l indennità sostitutiva del preavviso?',
      'Da quale giorno del mese decorre il preavviso metalmeccanici?'
    ];
  }
  return [
    'Spiegami meglio questo articolo contrattuale',
    'Mostrami i documenti aziendali correlati',
    'Prepara una bozza di richiesta alla direzione'
  ];
}
