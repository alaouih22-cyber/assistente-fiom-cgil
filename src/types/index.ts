export type UserRole = 'admin' | 'rsa' | 'rsu' | 'rls' | 'lavoratore' | 'consulente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  badgeNumber?: string;
  level?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export type TicketCategory =
  | 'disciplinare'
  | 'inquadramento'
  | 'retribuzione'
  | 'orario_turni'
  | 'sicurezza'
  | 'assenze'
  | 'altro';

export type TicketPriority = 'bassa' | 'media' | 'alta' | 'urgente';

export type TicketStatus =
  | 'aperta'
  | 'in_lavorazione'
  | 'attesa_documenti'
  | 'incontro_convocato'
  | 'chiusa_successo'
  | 'archiviata';

export interface TicketNote {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  fileUrl: string;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  category: TicketCategory;
  description: string;
  workerId: string;
  workerName: string;
  workerDepartment: string;
  assignedToId?: string;
  assignedToName?: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  notes: TicketNote[];
  attachments: TicketAttachment[];
  outcome?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  folderPath: string; // e.g. "/Archivio RSU/Verbali Riunioni/"
  category: 'ccnl' | 'accordo_aziendale' | 'sicurezza_rls' | 'normativa' | 'verbale' | 'comunicazione_direzione' | 'buste_paga' | 'modulistica';
  description: string;
  author: string;
  visibility: 'public' | 'sindacale' | 'confidenziale' | 'privato_lavoratore';
  workerId?: string;
  tags: string[];
  filename: string;
  filesize: string;
  version: string;
  verified: boolean;
  verifiedSourceUrl?: string;
  updatedAt: string;
  contentSummary: string;
  fullContent?: string;
  pageCount?: number;
  sectionClause?: string;
}

export interface CircularItem {
  id: string;
  code: string;
  title: string;
  category: 'urgente' | 'ccnl' | 'assemblea' | 'sicurezza' | 'circolare_fiom';
  summary: string;
  content: string;
  publishedAt: string;
  isUrgent: boolean;
  author: string;
  targetRole?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'termine_legale' | 'incontro_direzione' | 'assemblea' | 'visita_rls' | 'scadenza_pratica';
  date: string;
  time?: string;
  location?: string;
  ticketId?: string;
  priority: 'bassa' | 'media' | 'alta' | 'perentoria';
  isConfirmed: boolean;
  sourceOfDeadline: string;
  assignedRole: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
}

export interface CompanyInfo {
  name: string;
  facility: string;
  group: string;
  production: string;
  estimatedWorkers: number;
  ccnlApplied: string;
  ccnlStatus: string;
  integrativeAgreementStatus: string;
  rsuStatus: string;
  rlsStatus: string;
  fiomContactPerugia: {
    address: string;
    phone: string;
    email: string;
    delegatoTerritoriale: string;
  };
}

export interface AISearchResult {
  id: string;
  title: string;
  folderPath: string;
  sourceType: 'legge' | 'ccnl' | 'accordo_aziendale' | 'verbale' | 'comunicazione_direzione' | 'modello' | 'pratica' | 'circolare';
  sectionClause: string;
  extract: string;
  explanation: string;
  version: string;
  lastVerified: string;
  officialUrl?: string;
  relevanceScore: number;
  navigationTarget: {
    tab: 'normativa' | 'ccnl' | 'archive' | 'tickets' | 'doc_generator' | 'calendar' | 'rsu_rls' | 'plant_info' | 'admin_health';
    targetId?: string;
    targetFolder?: string;
    subTab?: string;
    actionLabel: string;
  };
}

export interface AISearchResponse {
  query: string;
  intent: string;
  aiSynthesis: string;
  results: AISearchResult[];
  foldersFound: string[];
  totalMatches: number;
  limitationsNotice?: string;
  userRoleApplied: UserRole;
  requiresClarification?: boolean;
  suggestedQuestions?: string[];
}
