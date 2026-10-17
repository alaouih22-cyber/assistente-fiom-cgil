import fs from 'fs';
import path from 'path';
import type { User, Ticket, DocumentItem, CalendarEvent, AuditLog, CompanyInfo, CircularItem } from '../types/index.ts';

export interface DatabaseSchema {
  users: User[];
  tickets: Ticket[];
  documents: DocumentItem[];
  circulars: CircularItem[];
  events: CalendarEvent[];
  auditLogs: AuditLog[];
  pushSubscriptions: any[];
  companyInfo: CompanyInfo;
}

const DATA_DIR = path.resolve('data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_DATA: DatabaseSchema = {
  companyInfo: {
    name: 'CSI S.r.l.',
    facility: 'Stabilimento di Colombella (Perugia)',
    group: 'Gruppo Arvedi',
    production: 'Lavorazione e commercio nastri, lamiere in acciaio al carbonio e laminati piani a freddo / decapato',
    estimatedWorkers: 120,
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'Contratto di riferimento storicamente applicato. Da riverificare con la direzione aziendale in sede di consultazione ex D.Lgs. 104/2022.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale non presente a catalogo ufficiale: ricercare archivi territoriali FIOM Perugia e verificare pattuizioni storiche di stabilimento.',
    rsuStatus: 'Rappresentanza Sindacale Unitaria costituita con delegati FIOM-CGIL.',
    rlsStatus: 'Rappresentante dei Lavoratori per la Sicurezza eletto dai lavoratori per lo stabilimento di Colombella.',
    fiomContactPerugia: {
      address: 'Via Caciolle 12 / Via Belluno 10, Perugia',
      phone: '+39 075 506981',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale Metalmeccanici Perugia'
    }
  },
  users: [
    {
      id: 'usr_operator',
      name: 'Operatore Sindacale',
      email: 'operatore@csi-colombella.it',
      role: 'rsu',
      department: 'Linee Taglio Nastri & Slitter',
      badgeNumber: 'CSI-01',
      level: 'C3 (Ex 5° liv.)',
      status: 'active',
      createdAt: '2026-01-01T08:00:00Z',
      lastLogin: new Date().toISOString()
    }
  ],
  tickets: [],
  documents: [
    {
      id: 'doc_ccnl_2024',
      title: 'CCNL Metalmeccanici Industria 2021-2024 (Federmeccanica-Assistal)',
      folderPath: '/CCNL Metalmeccanici/Testi Ufficiali/',
      category: 'ccnl',
      description: 'Testo consolidato e tabelle retributive ufficiali con minimi D1-A1 aggiornati. Clausole orari, ferie, comporto e diritti sindacali.',
      author: 'Federmeccanica / FIOM-FIM-UILM',
      visibility: 'public',
      tags: ['CCNL', 'Metalmeccanici', 'Tabelle Retributive', 'Inquadramento'],
      filename: 'ccnl_metalmeccanici_industria_sintesi.pdf',
      filesize: '1.8 MB',
      version: 'Edizione Vigente 2024-2026',
      verified: true,
      verifiedSourceUrl: 'https://www.federmeccanica.it/ccnl-metalmeccanici.html',
      sectionClause: 'Classificazione Professionale Titolo II',
      updatedAt: '2026-01-01',
      contentSummary: 'Disciplina contrattuale per industria metalmeccanica: classificazione in 9 livelli (D1 a A1), orario 40h settimanali, maggiorazioni straordinario (25%, 30%, 50%, 65%), turni avvicendati, previdenza Cometa e sanità integrativa Metasalute.'
    },
    {
      id: 'doc_controllo_distanza_art4',
      title: 'Disciplina Controlli a Distanza e Strumenti di Lavoro (Art. 4 Statuto Lavoratori L. 300/1970)',
      folderPath: '/Normativa Nazionale/Statuto Lavoratori/',
      category: 'normativa',
      description: 'Testo coordinato dell art. 4 della Legge 300/1970 con le modifiche del Jobs Act e chiarimenti del Garante Privacy e Ispettorato Nazionale del Lavoro.',
      author: 'Gazzetta Ufficiale / Normattiva',
      visibility: 'public',
      tags: ['Art. 4', 'Controlli a Distanza', 'Telecamere', 'Badge', 'Privacy', 'Statuto Lavoratori'],
      filename: 'statuto_lavoratori_art_4_controlli.pdf',
      filesize: '310 KB',
      version: 'Testo Vigente Normattiva',
      verified: true,
      verifiedSourceUrl: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1970-05-20;300',
      sectionClause: 'Articolo 4 (Impianti audiovisivi e altri strumenti di controllo)',
      updatedAt: '2026-01-05',
      contentSummary: 'Gli impianti audiovisivi e gli altri strumenti dai quali derivi anche la possibilità di controllo a distanza dell attività dei lavoratori possono essere impiegati esclusivamente per esigenze organizzative e produttive, per la sicurezza del lavoro e per la tutela del patrimonio aziendale, previo accordo collettivo stipulato dalla RSU o, in difetto, previa autorizzazione dell Ispettorato del Lavoro.',
      fullContent: `Art. 4 Legge 20 maggio 1970, n. 300:
1. Gli impianti audiovisivi e gli altri strumenti dai quali derivi anche la possibilita di controllo a distanza dell'attivita dei lavoratori possono essere impiegati esclusivamente per esigenze organizzative e produttive, per la sicurezza del lavoro e per la tutela del patrimonio aziendale e possono essere installati previo accordo collettivo stipulato dalla rappresentanza sindacale unitaria o dalle rappresentanze sindacali aziendali. In mancanza di accordo, gli impianti e gli strumenti di cui al primo periodo possono essere installati previa autorizzazione della sede territoriale dell'Ispettorato nazionale del lavoro.
2. La disposizione di cui al comma 1 non si applica agli strumenti utilizzati dal lavoratore per rendere la prestazione lavorativa e agli strumenti di registrazione degli accessi e delle presenze.
3. Le informazioni raccolte ai sensi dei commi 1 e 2 sono utilizzabili a tutti i fini connessi al rapporto di lavoro a condizione che sia data al lavoratore adeguata informazione delle modalita d'uso degli strumenti e di effettuazione dei controlli e nel rispetto di quanto disposto dal decreto legislativo 30 giugno 2003, n. 196.`
    },
    {
      id: 'doc_preavviso_ccnl',
      title: 'Clausole Contrattuali su Preavviso di Licenziamento e Dimissioni (CCNL Metalmeccanici)',
      folderPath: '/CCNL Metalmeccanici/Clausole Risoluzione/',
      category: 'ccnl',
      description: 'Tabelle contrattuali ufficiali dei termini di preavviso graduati per livello e anzianità di servizio (art. 1 Titolo VIII Sez. Quarta).',
      author: 'Federmeccanica - FIOM CGIL',
      visibility: 'public',
      tags: ['Preavviso', 'Dimissioni', 'Licenziamento', 'Livelli', 'Anzianità', 'CCNL'],
      filename: 'ccnl_termini_preavviso_tabella.pdf',
      filesize: '280 KB',
      version: 'CCNL Vigente 2024-2026',
      verified: true,
      sectionClause: 'Art. 1 Titolo VIII Sez. Quarta',
      updatedAt: '2026-01-01',
      contentSummary: 'Disciplina contrattuale dei termini di preavviso: per i livelli D1-D2 fino a 5 anni di anzianità 10 giorni di calendario; per i livelli C1-C3 da 1 mese e mezzo a 2 mesi; per i livelli B1-B3 fino a 3 mesi. In caso di mancato preavviso è dovuta l indennità sostitutiva.',
      fullContent: `CCNL Metalmeccanici Industria - Risoluzione del rapporto di lavoro e termini di preavviso:
I termini di preavviso decorrono dalla metà o dalla fine di ciascun mese.
- Livelli D1, D2: Fino a 5 anni di servizio = 10 giorni lavorativi; oltre 5 e fino a 10 anni = 15 giorni; oltre 10 anni = 20 giorni.
- Livelli C1, C2, C3: Fino a 5 anni = 1 mese e 15 giorni; oltre 5 e fino a 10 anni = 2 mesi; oltre 10 anni = 2 mesi e mezzo.
- Livelli B1, B2, B3, A1: Fino a 5 anni = 2 mesi; oltre 5 e fino a 10 anni = 3 mesi; oltre 10 anni = 4 mesi.`
    },
    {
      id: 'doc_sicurezza_81',
      title: 'D.Lgs. 9 aprile 2008, n. 81 - Testo Unico Sicurezza sul Lavoro (Guida RLS)',
      folderPath: '/Salute e Sicurezza/RLS e DVR/',
      category: 'sicurezza_rls',
      description: 'Guida operativa con focus sui compiti, poteri e diritti di consultazione del Rappresentante dei Lavoratori per la Sicurezza (RLS, artt. 47-50).',
      author: 'Ministero del Lavoro / INAIL',
      visibility: 'public',
      tags: ['D.Lgs 81/08', 'RLS', 'DVR', 'Prevenzione', 'Salute e Sicurezza'],
      filename: 'dlgs_81_2008_guida_rls.pdf',
      filesize: '2.4 MB',
      version: 'Coordinamento 2025/2026 INAIL',
      verified: true,
      verifiedSourceUrl: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2008-04-09;81',
      sectionClause: 'Artt. 47, 48, 50 (Attribuzioni RLS)',
      updatedAt: '2026-01-10',
      contentSummary: 'Obblighi di sicurezza, consultazione preventiva del RLS sulla valutazione dei rischi (DVR), accesso agli ambienti, pause videoterminali e movimentazione manuale carichi.'
    }
  ],
  circulars: [],
  events: [],
  auditLogs: [
    {
      id: 'log_001',
      timestamp: new Date().toISOString(),
      userId: 'system',
      userName: 'Inizializzazione Sistema',
      userRole: 'system',
      action: 'BOOT_SYSTEM',
      resource: 'database',
      details: 'Piattaforma Assistente Sindacale FIOM-CGIL avviata in ambiente sicuro con archivio cartelle indicizzato.'
    }
  ],
  pushSubscriptions: []
};

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If legacy mock users or mock tickets exist, purge them immediately
        const hasMockUsers = parsed.users && parsed.users.some((u: any) => u.name && (u.name.includes('Mario Rossi') || u.name.includes('Franco Vitali') || u.name.includes('Luca Moretti')));
        if (hasMockUsers) {
          console.log('[DB] Purging legacy mock data and resetting to pristine enterprise schema');
          this.save(INITIAL_DATA);
          return INITIAL_DATA;
        }

        if (!parsed.circulars) parsed.circulars = [];
        if (!parsed.pushSubscriptions) parsed.pushSubscriptions = [];
        if (!parsed.tickets) parsed.tickets = [];
        if (!parsed.events) parsed.events = [];
        return parsed;
      }
    } catch (e) {
      console.error('Error loading database, initializing fresh seed:', e);
    }
    this.save(INITIAL_DATA);
    return INITIAL_DATA;
  }

  public save(data?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const toSave = data || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database to file:', e);
    }
  }

  public getCompanyInfo() {
    return this.data.companyInfo;
  }

  public updateCompanyInfo(info: Partial<CompanyInfo>) {
    this.data.companyInfo = { ...this.data.companyInfo, ...info };
    this.save();
    return this.data.companyInfo;
  }

  public getUsers() {
    return this.data.users;
  }

  public getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public getTickets(userRole: string, userId: string) {
    if (['admin', 'rsa', 'rsu', 'rls'].includes(userRole)) {
      return this.data.tickets;
    }
    // Worker only sees tickets belonging to them
    return this.data.tickets.filter(t => t.workerId === userId);
  }

  public getTicketById(id: string, userRole: string, userId: string): Ticket | null {
    const t = this.data.tickets.find(item => item.id === id);
    if (!t) return null;
    if (!['admin', 'rsa', 'rsu', 'rls'].includes(userRole) && t.workerId !== userId) {
      return null;
    }
    if (userRole === 'lavoratore') {
      return {
        ...t,
        notes: t.notes.filter(n => !n.isPrivate)
      };
    }
    return t;
  }

  public createTicket(ticket: Omit<Ticket, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'notes'>): Ticket {
    const code = `PRAT-${new Date().getFullYear()}-${String(this.data.tickets.length + 1).padStart(3, '0')}`;
    const newTicket: Ticket = {
      ...ticket,
      id: `tkt_${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };
    this.data.tickets.unshift(newTicket);
    this.save();
    return newTicket;
  }

  public addTicketNote(ticketId: string, note: { authorName: string; authorRole: string; content: string; isPrivate: boolean }) {
    const ticket = this.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const newNote = {
      id: `note_${Date.now()}`,
      ...note,
      createdAt: new Date().toISOString()
    };
    ticket.notes.push(newNote);
    ticket.updatedAt = new Date().toISOString();
    this.save();
    return newNote;
  }

  public updateTicketStatus(ticketId: string, status: Ticket['status'], outcome?: string) {
    const ticket = this.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    ticket.status = status;
    if (outcome) ticket.outcome = outcome;
    ticket.updatedAt = new Date().toISOString();
    this.save();
    return ticket;
  }

  public getDocuments(userRole: string, userId: string): DocumentItem[] {
    if (['admin', 'rsa', 'rsu', 'rls'].includes(userRole)) {
      return this.data.documents;
    }
    // Worker: sees public documents, and documents private to themselves
    return this.data.documents.filter(d => d.visibility === 'public' || (d.visibility === 'privato_lavoratore' && d.workerId === userId));
  }

  public getDocumentById(id: string, userRole: string, userId: string): DocumentItem | null {
    const doc = this.data.documents.find(d => d.id === id);
    if (!doc) return null;
    if (['admin', 'rsa', 'rsu', 'rls'].includes(userRole)) return doc;
    if (doc.visibility === 'public') return doc;
    if (doc.visibility === 'privato_lavoratore' && doc.workerId === userId) return doc;
    return null;
  }

  public addDocument(doc: Omit<DocumentItem, 'id' | 'updatedAt'>): DocumentItem {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc_${Date.now()}`,
      folderPath: doc.folderPath || '/Archivio Generale/Documenti Vari/',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.data.documents.unshift(newDoc);
    this.save();
    return newDoc;
  }

  public getCirculars() {
    return this.data.circulars || [];
  }

  public addCircular(circular: Omit<CircularItem, 'id' | 'publishedAt'>): CircularItem {
    const newCirc: CircularItem = {
      ...circular,
      id: `circ_${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    this.data.circulars.unshift(newCirc);
    this.save();
    return newCirc;
  }

  public getEvents() {
    return this.data.events;
  }

  public addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvt: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}`
    };
    this.data.events.push(newEvt);
    this.save();
    return newEvt;
  }

  public savePushSubscription(sub: any) {
    if (!this.data.pushSubscriptions) this.data.pushSubscriptions = [];
    const exists = this.data.pushSubscriptions.some(s => JSON.stringify(s) === JSON.stringify(sub));
    if (!exists) {
      this.data.pushSubscriptions.push(sub);
      this.save();
    }
    return { count: this.data.pushSubscriptions.length };
  }

  public getPushSubscriptions() {
    return this.data.pushSubscriptions || [];
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const entry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
    return entry;
  }

  public getAuditLogs(userRole: string) {
    if (userRole !== 'admin') {
      return [];
    }
    return this.data.auditLogs;
  }
}

export const db = new Database();
