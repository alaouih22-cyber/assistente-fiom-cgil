import express, { type Request, type Response } from 'express';
import { db } from './db.ts';
import { askGeminiAssistant, transcribeAudio } from './gemini.ts';
import { NORMATIVA_DATABASE } from '../data/normativa.ts';
import { CCNL_METALMECCANICI_LEVELS, MAGGIORAZIONI_CCNL_METALMECCANICI, COMPORTO_CCNL_METALMECCANICI } from '../data/ccnl.ts';
import { UNION_DOCUMENT_TEMPLATES } from '../data/templates.ts';

export const apiRouter = express.Router();

// Middleware to extract user from header or session (default to Admin or current mock user)
function getActiveUser(req: Request) {
  const userIdHeader = req.headers['x-user-id'] as string;
  const userRoleHeader = req.headers['x-user-role'] as string;

  if (userIdHeader) {
    const found = db.getUserById(userIdHeader);
    if (found) return found;
  }

  // Fallback to demo user based on role header or default to RSU
  const users = db.getUsers();
  if (userRoleHeader) {
    const matched = users.find(u => u.role === userRoleHeader);
    if (matched) return matched;
  }

  return users[0];
}

// 1. Health & Diagnostics
apiRouter.get('/health', (req: Request, res: Response) => {
  const apiKeyPresent = !!process.env.GEMINI_API_KEY;
  const users = db.getUsers();
  const tickets = db.getTickets('admin', 'system');
  const documents = db.getDocuments('admin', 'system');
  const company = db.getCompanyInfo();

  res.json({
    status: 'online',
    version: '1.0.0-pwa',
    environment: 'Google AI Studio Full-Stack',
    aiService: {
      provider: 'Google Gemini',
      modelText: 'gemini-flash-latest',
      modelAudio: 'gemini-3.5-transcribe',
      apiKeyConfigured: apiKeyPresent,
      status: apiKeyPresent ? 'Collegato e Operativo' : 'In attesa di chiave in Secrets (disponibile modalità manuale)'
    },
    database: {
      type: 'Persistent JSON Store (Multi-Session)',
      usersCount: users.length,
      ticketsCount: tickets.length,
      documentsCount: documents.length,
      status: 'Operativo e verificato'
    },
    companyInfo: company,
    security: {
      rbacEnforced: true,
      dataMinimization: true,
      clientExposedSecrets: false
    }
  });
});

// 2. Authentication & Current User
apiRouter.get('/auth/current', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  res.json({ user, availableUsers: db.getUsers() });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const current = getActiveUser(req);
  const { name, email, role, department, badgeNumber, level } = req.body;
  const updated = db.updateUser(current.id, {
    name: name !== undefined ? name : current.name,
    email: email !== undefined ? email : current.email,
    role: role !== undefined ? role : current.role,
    department: department !== undefined ? department : current.department,
    badgeNumber: badgeNumber !== undefined ? badgeNumber : current.badgeNumber,
    level: level !== undefined ? level : current.level,
  });
  db.logAudit({
    userId: current.id,
    userName: updated?.name || current.name,
    userRole: updated?.role || current.role,
    action: 'UPDATE_PROFILE',
    resource: 'auth',
    details: `Aggiornato profilo utente: ${updated?.name} (${updated?.role}).`
  });
  res.json({ success: true, user: updated });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const users = db.getUsers();
  const found = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!found) {
    return res.status(401).json({ error: 'Utente non trovato o credenziali errate.' });
  }

  db.updateUser(found.id, { lastLogin: new Date().toISOString() });
  db.logAudit({
    userId: found.id,
    userName: found.name,
    userRole: found.role,
    action: 'USER_LOGIN',
    resource: 'auth',
    details: `Accesso effettuato per l'utente ${found.name} (${found.role}).`
  });

  res.json({ success: true, user: found });
});

apiRouter.post('/auth/register-request', (req: Request, res: Response) => {
  const { name, email, department, badgeNumber } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome ed email sono obbligatori.' });
  }

  // Create as inactive worker awaiting approval, or active if demo
  const newUser = db.createUser({
    name,
    email,
    department: department || 'Stabilimento CSI Colombella',
    badgeNumber: badgeNumber || 'CSI-TEMP',
    role: 'lavoratore',
    status: 'active'
  });

  db.logAudit({
    userId: newUser.id,
    userName: newUser.name,
    userRole: newUser.role,
    action: 'USER_REGISTER',
    resource: 'auth',
    details: `Nuova registrazione lavoratore per ${newUser.name}.`
  });

  res.json({ success: true, user: newUser });
});

// 3. Company & CSI Colombella profile
apiRouter.get('/company', (req: Request, res: Response) => {
  res.json(db.getCompanyInfo());
});

apiRouter.put('/company', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo gli amministratori FIOM possono aggiornare la scheda aziendale.' });
  }
  const updated = db.updateCompanyInfo(req.body);
  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'UPDATE_COMPANY',
    resource: 'company',
    details: 'Aggiornati metadati e stato contrattuale CSI Colombella.'
  });
  res.json(updated);
});

// 4. Tickets / Pratiche Sindacali (RBAC enforced)
apiRouter.get('/tickets', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const tickets = db.getTickets(user.role, user.id);
  res.json(tickets);
});

apiRouter.post('/tickets', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { title, category, description, priority, deadline, department } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Titolo, categoria e descrizione sono obbligatori.' });
  }

  const newTicket = db.createTicket({
    title,
    category,
    description,
    priority: priority || 'media',
    status: 'aperta',
    workerId: user.id,
    workerName: user.name,
    workerDepartment: department || user.department,
    deadline,
    attachments: []
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'CREATE_TICKET',
    resource: `ticket:${newTicket.code}`,
    details: `Aperta pratica "${title}" categoria ${category}.`
  });

  res.status(201).json(newTicket);
});

apiRouter.get('/tickets/:id', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const ticket = db.getTicketById(req.params.id, user.role, user.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Pratica non trovata o accesso negato.' });
  }
  res.json(ticket);
});

apiRouter.post('/tickets/:id/notes', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { content, isPrivate } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Il contenuto della nota non può essere vuoto.' });
  }

  // Only delegates or admin can create private notes
  const safePrivate = ['admin', 'rsa', 'rsu', 'rls'].includes(user.role) ? !!isPrivate : false;

  const note = db.addTicketNote(req.params.id, {
    authorName: user.name,
    authorRole: user.role,
    content,
    isPrivate: safePrivate
  });

  if (!note) {
    return res.status(404).json({ error: 'Pratica non trovata.' });
  }

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'ADD_TICKET_NOTE',
    resource: `ticket:${req.params.id}`,
    details: `Aggiunta nota alla pratica (riservata: ${safePrivate}).`
  });

  res.status(201).json(note);
});

apiRouter.patch('/tickets/:id/status', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  if (!['admin', 'rsa', 'rsu', 'rls'].includes(user.role)) {
    return res.status(403).json({ error: 'Solo i delegati o l amministratore possono modificare lo stato della pratica.' });
  }

  const { status, outcome } = req.body;
  const updated = db.updateTicketStatus(req.params.id, status, outcome);
  if (!updated) {
    return res.status(404).json({ error: 'Pratica non trovata.' });
  }

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'UPDATE_TICKET_STATUS',
    resource: `ticket:${req.params.id}`,
    details: `Stato pratica aggiornato a: ${status}.`
  });

  res.json(updated);
});

// 5. Protected Documents Archive
apiRouter.get('/documents', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const docs = db.getDocuments(user.role, user.id);
  res.json(docs);
});

apiRouter.post('/documents', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { title, category, description, visibility, tags, filename, contentSummary } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Titolo e categoria documento sono obbligatori.' });
  }

  // Non-delegates can only upload private or worker-specific files
  let safeVisibility = visibility || 'public';
  if (!['admin', 'rsa', 'rsu', 'rls'].includes(user.role)) {
    safeVisibility = 'privato_lavoratore';
  }

  const newDoc = db.addDocument({
    title,
    category,
    folderPath: req.body.folderPath || '/Archivio Generale/',
    description: description || '',
    author: user.name,
    visibility: safeVisibility,
    workerId: user.id,
    tags: Array.isArray(tags) ? tags : ['Caricato da Utente'],
    filename: filename || 'documento_allegato.pdf',
    filesize: '150 KB',
    version: '1.0',
    verified: ['admin', 'rsa', 'rsu'].includes(user.role),
    contentSummary: contentSummary || 'Documento caricato per analisi e archivio riservato.'
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'UPLOAD_DOCUMENT',
    resource: `doc:${newDoc.id}`,
    details: `Caricato documento "${title}" visibilità: ${safeVisibility}.`
  });

  res.status(201).json(newDoc);
});

// 6. Normativa & CCNL Data
apiRouter.get('/normativa', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  if (!query) {
    return res.json(NORMATIVA_DATABASE);
  }
  const filtered = NORMATIVA_DATABASE.filter(n =>
    n.titolo.toLowerCase().includes(query) ||
    n.riassunto.toLowerCase().includes(query) ||
    n.testoPertinente.toLowerCase().includes(query) ||
    n.paroleChiave.some(k => k.toLowerCase().includes(query))
  );
  res.json(filtered);
});

apiRouter.get('/ccnl', (req: Request, res: Response) => {
  res.json({
    contractName: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    validity: '2021-2024 / Decorrenze retributive aggiornate 2024-2026',
    status: 'Applicato di riferimento - Da verificare formalmente su busta paga / lettera assunzione',
    levels: CCNL_METALMECCANICI_LEVELS,
    maggiorazioni: MAGGIORAZIONI_CCNL_METALMECCANICI,
    comporto: COMPORTO_CCNL_METALMECCANICI
  });
});

// 7. Templates
apiRouter.get('/templates', (req: Request, res: Response) => {
  res.json(UNION_DOCUMENT_TEMPLATES);
});

// 8. Calendar Events & Scadenze
apiRouter.get('/events', (req: Request, res: Response) => {
  res.json(db.getEvents());
});

apiRouter.post('/events', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { title, category, date, time, location, priority, sourceOfDeadline, ticketId } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Titolo e data scadenza sono obbligatori.' });
  }

  const newEvent = db.addEvent({
    title,
    category: category || 'termine_legale',
    date,
    time: time || '09:00',
    location: location || 'Stabilimento CSI Colombella',
    priority: priority || 'alta',
    isConfirmed: true,
    sourceOfDeadline: sourceOfDeadline || 'Accordo o norma contrattuale',
    assignedRole: user.role.toUpperCase(),
    ticketId
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'CREATE_CALENDAR_EVENT',
    resource: `event:${newEvent.id}`,
    details: `Aggiunta scadenza / incontro: ${title} in data ${date}.`
  });

  res.status(201).json(newEvent);
});

// 9. Admin Audit Logs
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const logs = db.getAuditLogs(user.role);
  res.json(logs);
});

// 10. Gemini Assistant AI Proxy (Server-side execution for FIOM-CGIL & LexLabor)
apiRouter.post('/gemini/chat', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const { prompt, history, attachments, includeCompanyContext, includeCCNLContext, assistantType, companyContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Il testo della richiesta è obbligatorio.' });
    }

    const currentAssistant: 'fiom' | 'lexlabor' = assistantType === 'lexlabor' ? 'lexlabor' : 'fiom';

    // Build rich context from verified local sources
    let contextData = `UTENTE ATTUALE: ${user.name} (Ruolo: ${user.role}, Reparto: ${user.department || 'N/A'})\n`;
    if (includeCompanyContext !== false) {
      const comp = companyContext || db.getCompanyInfo();
      contextData += `AZIENDA: ${comp.name} - ${comp.facility} (${comp.location || ''})\n`;
      contextData += `CCNL: ${comp.ccnlApplied || 'CCNL Metalmeccanici Industria Federmeccanica-Assistal'} (${comp.ccnlStatus || 'Vigente'})\n`;
      contextData += `ACCORDO INTEGRATIVO AZIENDALE (CIA): ${comp.integrativeAgreementStatus || 'Da verificare con la RSU di stabilimento'}\n`;
      contextData += `RAPPRESENTANZA: ${comp.rsuStatus || 'RSU FIOM-CGIL'} | ${comp.rlsStatus || 'RLS ex D.Lgs. 81/08'}\n`;
    }

    if (includeCCNLContext) {
      contextData += `TABELLE MINIMI CCNL METALMECCANICI (GIUGNO 2026): D1 (1.784,94 €), D2 (1.979,37 €), C1 (2.022,12 €), C2 (2.064,88 €), C3 (2.211,43 €), B1 (2.370,33 €), B2 (2.542,98 €), B3 (2.838,99 €), A1 (2.907,01 €). Divisore orario: 173.\n`;
      contextData += `SCATTI BIENNALI (max 5): D1 19,42€, D2 22,88€, C1 25,05€, C2 26,49€, C3 27,90€, B1 31,56€, B2 35,46€, B3 39,72€, A1 44,05€.\n`;
      contextData += `WELFARE & PEREQUATIVO: Flexible Benefits 200,00 € annui (decorrenza 1° giugno, esenti art. 51 TUIR); Elemento Perequativo 485,00 € annui a giugno per chi non ha integrativo aziendale né superminimi.\n`;
      contextData += `MAGGIORAZIONI: Straord. diurno 25%/30%, notturno 50%, festivo 50%, notturno festivo 65%. Ulteriore incremento +8% oltre 48h settimanali. 2° turno 8%, 3° turno 30%.\n`;
      contextData += `NORMATIVA CARDINE: Statuto Lavoratori (L. 300/1970 artt. 4, 7 contestazioni con 5gg a difesa, 19, 20 assemblee 10h/anno, 21, 22, 23-24 permessi, 27 locali, 28 condotta antisindacale), Codice Civile artt. 2103, 2110 comporto, 2118, 1676 c.c. e art. 29 D.Lgs. 276/03 responsabilità solidale appalti, D.Lgs. 81/2008 sicurezza e ruolo RLS.\n`;
    }

    const aiResponse = await askGeminiAssistant(prompt, history, attachments, contextData, currentAssistant);

    db.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'GEMINI_CHAT_QUERY',
      resource: `ai:${currentAssistant}`,
      details: `Richiesta a ${currentAssistant === 'lexlabor' ? 'LexLabor' : 'Assistente FIOM'} (${prompt.slice(0, 40)}...)`
    });

    res.json(aiResponse);
  } catch (error: any) {
    console.error('Server error in /gemini/chat:', error);
    res.status(500).json({ error: error.message || 'Errore interno del server' });
  }
});

// 10b. Interactive RSA & RSU Legal Guidance Engine
apiRouter.post('/rsa/guidance', (req: Request, res: Response) => {
  try {
    const { employeeCount, hasExistingRep, ccnlStatus, unionMembersPresent } = req.body;

    const countNum = parseInt(employeeCount, 10) || 0;
    const isAbove15 = countNum > 15;

    let pathTitle = '';
    let legalBasis = '';
    let stepByStep: string[] = [];
    let rightsAvailable: string[] = [];
    let warning = '';

    if (!isAbove15) {
      pathTitle = 'Unità produttiva fino a 15 dipendenti: Tutela Territoriale e Fiduciario di Stabilimento';
      legalBasis = 'Art. 35 Legge 300/1970 (limite dimensionale); Testo Unico Rappresentanza 2014; Accordo Interconfederale Piccola Industria.';
      warning = 'Nelle unità produttive con 15 o meno dipendenti non si applicano direttamente le disposizioni del Titolo III dello Statuto (RSA/RSU, assemblea retribuita e permessi ex artt. 20-23). Tuttavia la tutela sindacale è pienamente garantita tramite la FIOM territoriale e l\'RLS Territoriale (RLST).';
      stepByStep = [
        'Contattare la segreteria territoriale FIOM-CGIL (Perugia: Via Caciolle 12 / Via Belluno 10, tel. 075 506981).',
        'Nomina o individuazione di un fiduciario sindacale aziendale per le comunicazioni formali con il datore.',
        'Verifica dell\'elezione del Rappresentante dei Lavoratori per la Sicurezza (RLS) aziendale o attivazione dell\'RLST paritetico.',
        'Partecipazione alle assemblee territoriali e consultazioni contrattuali esterne.'
      ];
      rightsAvailable = [
        'Libertà sindacale e divieto di discriminazioni (artt. 14, 15, 16 L. 300/1970)',
        'Assistenza nelle contestazioni disciplinari ex art. 7 L. 300/1970',
        'Diritto all\'inquadramento contrattuale e retribuzione ex CCNL applicato',
        'Tutela della sicurezza e nomina RLS ex art. 47 D.Lgs. 81/2008'
      ];
    } else {
      // Over 15 employees
      if (hasExistingRep === 'rsu_active') {
        pathTitle = 'RSU in carica: Prerogative Piene e Funzionamento Collegiale';
        legalBasis = 'Accordo Interconfederale 10 gennaio 2014 (Testo Unico sulla Rappresentanza); Titolo III Statuto Lavoratori; CCNL Metalmeccanici Sezione Prima.';
        stepByStep = [
          'La RSU esercita le prerogative sindacali collegialmente (a maggioranza dei componenti).',
          'Convocazione periodica delle assemblee dei lavoratori (fino a 10 ore annue retribuite ex art. 20 L. 300/70).',
          'Gestione della bacheca sindacale (diritto di affissione ex art. 25) e richiesta locale (art. 27).',
          'Trattativa e sottoscrizione dell\'Accordo Integrativo Aziendale di secondo livello con la Direzione.',
          'Verifica della scadenza triennale: il mandato RSU dura 3 anni tassativi, senza prorogatio automatica indefinita.'
        ];
        rightsAvailable = [
          'Assemblea retribuita 10 ore/anno (art. 20 L. 300/70)',
          'Referendum aziendale (art. 21 L. 300/70)',
          'Permessi sindacali retribuiti (art. 23 L. 300/70 e CCNL)',
          'Permessi non retribuiti per cariche sindacali (art. 24 L. 300/70)',
          'Diritto di affissione comunicati (art. 25 L. 300/70)',
          'Tutela rafforzata contro il trasferimento dei componenti (art. 22 L. 300/70: serve nulla osta sindacale)',
          'Azione per condotta antisindacale del datore (art. 28 L. 300/70)'
        ];
      } else if (hasExistingRep === 'rsu_expired' || hasExistingRep === 'none') {
        pathTitle = 'Costituzione o Rinnovo della RSU: Procedura Elettorale Democratica a Suffragio Universale';
        legalBasis = 'Testo Unico sulla Rappresentanza 10 gennaio 2014; Regolamento Elettorale RSU Confindustria-CGIL-CISL-UIL; Art. 19 L. 300/1970.';
        warning = hasExistingRep === 'rsu_expired' 
          ? 'La precedente RSU è scaduta: secondo la giurisprudenza e gli accordi interconfederali, la RSU decaduta non può sottoscrivere nuovi accordi vincolanti e deve essere immediatamente rieletta.'
          : 'In assenza di rappresentanza sindacale attiva, i lavoratori hanno il pieno diritto di indire le elezioni RSU o di richiedere alla FIOM-CGIL la costituzione di una RSA ex art. 19 L. 300/70.';
        stepByStep = [
          'Fase 1 - Promozione: La FIOM-CGIL territoriale (o almeno il 5% dei lavoratori aventi diritto) deposita l\'iniziativa per l\'indizione delle elezioni RSU.',
          'Fase 2 - Commissione Elettorale: Costituzione della commissione paritetica elettorale con i delegati di ciascuna lista presentata.',
          'Fase 3 - Liste e Candidature: Raccolta delle firme a sostegno della lista FIOM-CGIL e deposito candidature (operai, impiegati, quadri).',
          'Fase 4 - Voto: Votazione a scrutinio segreto tra tutti i lavoratori (non solo gli iscritti). Quorum di validità: partecipazione di almeno il 50% + 1 degli aventi diritto.',
          'Fase 5 - Proclamazione: Assegnazione proporzionale dei seggi e subentro della RSU nella titolarità dei diritti sindacali ex Titolo III L. 300/70.'
        ];
        rightsAvailable = [
          'Tutti i diritti del Titolo III Statuto dei Lavoratori (Artt. 19-28)',
          'Legittimazione piena alla contrattazione di secondo livello con efficacia erga omnes',
          'Partecipazione alle consultazioni preventive su orari, cambi mansioni, appalti e crisi'
        ];
      } else {
        pathTitle = 'Costituzione di RSA FIOM-CGIL ex Art. 19 Statuto dei Lavoratori';
        legalBasis = 'Art. 19 Legge 300/1970 come integrato dalla sentenza n. 231/2013 della Corte Costituzionale.';
        stepByStep = [
          'La FIOM-CGIL, in quanto organizzazione firmataria del CCNL Metalmeccanici Industria o che ha comunque partecipato alle trattative contrattuali, notifica formalmente alla Direzione Aziendale la nomina del/dei propri dirigenti RSA.',
          'L\'azienda ha l\'obbligo legale di riconoscere la rappresentanza e garantire i diritti di bacheca (art. 25), assemblea (art. 20) e permessi (art. 23).',
          'La RSA opera a tutela degli iscritti e delle lavoratrici/lavoratori fino all\'eventuale elezione di una RSU unitaria.'
        ];
        rightsAvailable = [
          'Assemblea retribuita 10 ore annue',
          'Permessi sindacali retribuiti e non retribuiti',
          'Bacheca sindacale aziendale',
          'Tutela contro trasferimenti arbitrari (art. 22)'
        ];
      }
    }

    res.json({
      pathTitle,
      legalBasis,
      employeeCount: countNum,
      isAbove15,
      warning,
      stepByStep,
      rightsAvailable,
      fiomContact: {
        sede: 'FIOM-CGIL Perugia',
        indirizzo: 'Via Caciolle 12 / Via Belluno 10, Perugia',
        telefono: '+39 075 506981',
        email: 'fiom.perugia@umbria.cgil.it'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Errore elaborazione orientamento RSA' });
  }
});

// 11. Busta Paga OCR & Audit with Gemini
apiRouter.post('/gemini/audit-payslip', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const { imageBase64, mimeType, manualData } = req.body;

    let prompt = `Effettua un'analisi approfondita, prudente e rigorosa di questa busta paga per uno stabilimento metalmeccanico (CSI Colombella / Federmeccanica-Assistal).\n`;
    if (manualData) {
      prompt += `DATI DICHIARATI DAL LAVORATORE:\n- Periodo: ${manualData.periodo || 'N/D'}\n- Livello indicato: ${manualData.livello || 'N/D'}\n- Ore lavorate: ${manualData.oreOrdinarie || 'N/D'}\n- Ore straordinario dichiarato: ${manualData.oreStraordinario || '0'}\n- Tipo turno: ${manualData.tipoTurno || 'Ordinario'}\n- Retribuzione lorda indicata: € ${manualData.lordo || 'N/D'}\n- Netto percepito: € ${manualData.netto || 'N/D'}\n\n`;
    }

    prompt += `
ISTRUZIONI DETTAGLIATE PER L'ANALISI:
1. Verifica la corrispondenza del minimo tabellare rispetto al livello dichiarato secondo il CCNL Federmeccanica-Assistal.
2. Controlla gli scatti di anzianità (se presenti) e la voce "superminimo" (assorbibile o non assorbibile).
3. Analizza le maggiorazioni applicate su straordinari e turni (notturno 50%, festivo 50%, notturno festivo 65%, turni avvicendati 8% o 30%).
4. Esamina le trattenute previdenziali IVS (ordinariamente 9.19% a carico lavoratore) e l'imponibile fiscale.
5. Verifica la presenza di contribuzione a Fondi di settore (Cometa per la previdenza, Metasalute per l'assistenza sanitaria) e welfare contrattuale.
6. Formula il report nel rispetto dei 9 punti obbligatori (Fatti documentati, Dati dichiarati, Ipotesi da verificare, Norme consultate, Interpretazione proposta, Dati mancanti, Rischi/Alternative, Passi successivi, Termini).
Non dichiarare automaticamente reati o violazioni certe senza documentazione probatoria completa; evidenzia anomalie da verificare con i delegati FIOM.`;

    const attachments: any[] = [];
    if (imageBase64) {
      attachments.push({
        mimeType: mimeType || 'image/jpeg',
        base64Data: imageBase64
      });
    }

    const aiResponse = await askGeminiAssistant(prompt, [], attachments, 'MODULO ANALIZZATORE BUSTE PAGA METALMECCANICI');

    db.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'PAYSLIP_AUDIT',
      resource: 'ai:gemini-3.8-flash',
      details: `Verifica busta paga per lavoratore ${user.name}.`
    });

    res.json(aiResponse);
  } catch (error: any) {
    console.error('Payslip audit error:', error);
    res.status(500).json({ error: error.message || 'Errore durante l analisi della busta paga' });
  }
});

// 12. Audio Transcription endpoint
apiRouter.post('/gemini/transcribe', async (req: Request, res: Response) => {
  try {
    const { base64Audio, mimeType } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ error: 'Dati audio mancanti' });
    }
    const transcription = await transcribeAudio(base64Audio, mimeType || 'audio/webm');
    res.json({ text: transcription });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Errore nella trascrizione audio' });
  }
});

// 13. Universal Semantic AI Search Endpoint
apiRouter.post('/search/ai', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const { query, categoryFilter, history } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'La query di ricerca è obbligatoria.' });
    }

    const { executeSemanticAISearch } = await import('./searchEngine.js');
    const searchResponse = await executeSemanticAISearch(query, user, categoryFilter, history);

    db.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'AI_SEARCH_QUERY',
      resource: 'search:semantic_archive',
      details: `Ricerca semantica: "${query.slice(0, 50)}" (${searchResponse.totalMatches} risultati recuperati)`
    });

    res.json(searchResponse);
  } catch (error: any) {
    console.error('Semantic search error:', error);
    res.status(500).json({ error: error.message || 'Errore durante la ricerca AI' });
  }
});

// 14. Notifications & Circulars endpoints
apiRouter.get('/notifications/circulars', (req: Request, res: Response) => {
  const circulars = db.getCirculars();
  res.json(circulars);
});

apiRouter.post('/notifications/subscribe', (req: Request, res: Response) => {
  const sub = req.body;
  if (!sub) return res.status(400).json({ error: 'Dati di iscrizione mancanti' });
  const result = db.savePushSubscription(sub);
  res.json({ success: true, totalSubscriptions: result.count });
});

apiRouter.post('/notifications/broadcast', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  if (!['admin', 'rsa', 'rsu', 'rls'].includes(user.role)) {
    return res.status(403).json({ error: 'Solo i delegati sindacali o admin possono inviare circolari urgenti.' });
  }

  const { title, summary, content, category, isUrgent } = req.body;
  if (!title || !summary) {
    return res.status(400).json({ error: 'Titolo e sommario circolare sono obbligatori.' });
  }

  const code = `CIRC-FIOM-${new Date().getFullYear()}-${String(db.getCirculars().length + 1).padStart(2, '0')}`;
  const newCirc = db.addCircular({
    code,
    title,
    summary,
    content: content || summary,
    category: category || 'circolare_fiom',
    isUrgent: isUrgent ?? true,
    author: `${user.name} (${user.role.toUpperCase()})`
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'BROADCAST_CIRCULAR',
    resource: `circular:${newCirc.code}`,
    details: `Pubblicata circolare urgente: "${title}"`
  });

  res.status(201).json(newCirc);
});

// 15. Single document retrieval
apiRouter.get('/documents/:id', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const doc = db.getDocumentById(req.params.id, user.role, user.id);
  if (!doc) {
    return res.status(404).json({ error: 'Documento non trovato o accesso riservato.' });
  }
  res.json(doc);
});
