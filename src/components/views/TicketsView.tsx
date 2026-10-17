import React, { useState, useEffect } from 'react';
import { User, Ticket, TicketCategory, TicketPriority, TicketStatus } from '../../types/index.js';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  User as UserIcon,
  MessageSquare,
  Search,
  Filter,
  Paperclip,
  Calendar,
  Send,
  Building,
  ShieldAlert
} from 'lucide-react';

interface TicketsViewProps {
  currentUser: User;
  onRefreshStats?: () => void;
  initialTicketId?: string;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ currentUser, onRefreshStats, initialTicketId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal create ticket
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('retribuzione');
  const [newPriority, setNewPriority] = useState<TicketPriority>('media');
  const [newDescription, setNewDescription] = useState('');
  const [newDepartment, setNewDepartment] = useState(currentUser.department || 'CSI Colombella');
  const [newDeadline, setNewDeadline] = useState('');

  // Add note form
  const [noteContent, setNoteContent] = useState('');
  const [isNotePrivate, setIsNotePrivate] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const isDelegateOrAdmin = ['admin', 'rsa', 'rsu', 'rls'].includes(currentUser.role);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        }
      });
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
      if (selectedTicket) {
        const refreshed = data.find((t: Ticket) => t.id === selectedTicket.id);
        if (refreshed) setSelectedTicket(refreshed);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  useEffect(() => {
    if (initialTicketId && tickets.length > 0) {
      const match = tickets.find(t => t.id === initialTicketId);
      if (match) setSelectedTicket(match);
    }
  }, [initialTicketId, tickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Inserisci titolo e descrizione della pratica.');
      return;
    }

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          priority: newPriority,
          description: newDescription,
          department: newDepartment,
          deadline: newDeadline || undefined
        })
      });

      if (res.ok) {
        const created = await res.json();
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        await fetchTickets();
        setSelectedTicket(created);
        if (onRefreshStats) onRefreshStats();
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          content: noteContent,
          isPrivate: isDelegateOrAdmin ? isNotePrivate : false
        })
      });

      if (res.ok) {
        setNoteContent('');
        setIsNotePrivate(false);
        await fetchTickets();
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleUpdateStatus = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchTickets();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgente':
        return <span className="bg-red-100 text-red-800 text-3xs font-extrabold px-2 py-0.5 rounded-full border border-red-300">Urgente</span>;
      case 'alta':
        return <span className="bg-amber-100 text-amber-800 text-3xs font-bold px-2 py-0.5 rounded-full border border-amber-300">Alta</span>;
      case 'media':
        return <span className="bg-blue-100 text-blue-800 text-3xs font-medium px-2 py-0.5 rounded-full border border-blue-200">Media</span>;
      case 'bassa':
      default:
        return <span className="bg-slate-100 text-slate-700 text-3xs font-medium px-2 py-0.5 rounded-full border border-slate-200">Bassa</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'aperta':
        return <span className="bg-blue-50 text-blue-700 text-2xs font-bold px-2 py-0.5 rounded-md border border-blue-200">Aperta</span>;
      case 'in_lavorazione':
        return <span className="bg-amber-50 text-amber-800 text-2xs font-bold px-2 py-0.5 rounded-md border border-amber-200">In Lavorazione</span>;
      case 'incontro_convocato':
        return <span className="bg-purple-50 text-purple-700 text-2xs font-bold px-2 py-0.5 rounded-md border border-purple-200">Incontro Convocato</span>;
      case 'chiusa_successo':
        return <span className="bg-emerald-50 text-emerald-700 text-2xs font-bold px-2 py-0.5 rounded-md border border-emerald-200">Chiusa con Risoluzione</span>;
      case 'archiviata':
      default:
        return <span className="bg-slate-100 text-slate-600 text-2xs font-medium px-2 py-0.5 rounded-md border border-slate-200">Archiviata</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Gestione Pratiche & Vertenze Sindacali
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Istruttoria ticket, note riservate RSU/RSA, tracciamento scadenze e vertenze di stabilimento.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-800 transition flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apri Nuova Pratica</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per codice pratica (PRAT-...), titolo o lavoratore..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            aria-label="Filtra pratiche per stato"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          >
            <option value="all">Tutti gli stati</option>
            <option value="aperta">Aperte</option>
            <option value="in_lavorazione">In Lavorazione</option>
            <option value="incontro_convocato">Incontro Convocato</option>
            <option value="chiusa_successo">Chiuse con Successo</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Ticket list + Ticket details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTickets.map((ticket) => {
            const isSelected = selectedTicket?.id === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-red-50/80 border-red-500 shadow-xs ring-1 ring-red-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-2xs font-extrabold text-red-700 bg-red-100/60 px-2 py-0.5 rounded">
                    {ticket.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                  {ticket.title}
                </h4>

                <p className="text-2xs text-slate-500 line-clamp-2 mt-1">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between text-3xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium text-slate-600 truncate max-w-[150px]">
                    <UserIcon className="w-3 h-3 text-slate-400" />
                    {ticket.workerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
              Nessuna pratica trovata con i filtri correnti.
            </div>
          )}
        </div>

        {/* Selected Ticket Details */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-5">
              {/* Top details */}
              <div className="pb-4 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                    {selectedTicket.code}
                  </span>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedTicket.title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-2xs text-slate-500 pt-1">
                  <div>
                    <span className="block text-slate-400 uppercase text-3xs font-bold">Lavoratore</span>
                    <span className="font-semibold text-slate-800">{selectedTicket.workerName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase text-3xs font-bold">Reparto</span>
                    <span className="font-semibold text-slate-800">{selectedTicket.workerDepartment}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase text-3xs font-bold">Categoria</span>
                    <span className="font-semibold text-slate-800 uppercase">{selectedTicket.category}</span>
                  </div>
                </div>
              </div>

              {/* Status Update bar (Delegates only) */}
              {isDelegateOrAdmin && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700">Avanzamento Stato:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus('in_lavorazione')}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-2xs font-semibold hover:bg-slate-100"
                    >
                      In Lavorazione
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('incontro_convocato')}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-2xs font-semibold hover:bg-purple-100"
                    >
                      Incontro Convocato
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('chiusa_successo')}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-2xs font-semibold hover:bg-emerald-100"
                    >
                      Risolta
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-2xs font-bold uppercase text-slate-400 mb-1">
                  Descrizione del Caso e Fatti Riferiti
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Notes & Timeline */}
              <div>
                <h4 className="text-2xs font-bold uppercase text-slate-400 mb-2 flex items-center justify-between">
                  <span>Cronologia Note & Istruttoria ({selectedTicket.notes?.length || 0})</span>
                  {isDelegateOrAdmin && (
                    <span className="text-3xs text-purple-700 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Note private visibili solo a RSA/RSU/RLS
                    </span>
                  )}
                </h4>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                    selectedTicket.notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          note.isPrivate
                            ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-2xs mb-1 font-semibold">
                          <span className="flex items-center gap-1">
                            {note.isPrivate && <Lock className="w-3 h-3 text-purple-600" />}
                            <strong>{note.authorName}</strong> ({note.authorRole.toUpperCase()})
                          </span>
                          <span className="text-slate-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-2xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      Nessuna nota presente. Aggiungi il primo aggiornamento di istruttoria.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Scrivi una nota di aggiornamento, verbale dell'incontro o chiarimento..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                />

                <div className="flex items-center justify-between">
                  {isDelegateOrAdmin ? (
                    <label className="flex items-center gap-2 text-2xs font-semibold text-purple-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNotePrivate}
                        onChange={(e) => setIsNotePrivate(e.target.checked)}
                        className="rounded text-purple-700 focus:ring-purple-500"
                      />
                      <span>Nota riservata (visibile solo ai delegati e coordinamento FIOM)</span>
                    </label>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={isSubmittingNote || !noteContent.trim()}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Aggiungi Nota</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Seleziona una pratica dall'elenco a sinistra</p>
              <p className="text-xs">Potrai esaminare la cronologia, allegati e aggiungere note.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Open New Ticket */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Apertura Nuova Pratica Sindacale
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Titolo Pratica / Oggetto Vertenza
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Verifica orari turno festivo notturno o contestazione disciplinare"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="retribuzione">Retribuzione & Straordinari</option>
                    <option value="disciplinare">Contestazione Disciplinare</option>
                    <option value="inquadramento">Mansioni & Livello (art. 2103)</option>
                    <option value="orario_turni">Orari & Turni Riposo</option>
                    <option value="sicurezza">Salute e Sicurezza (RLS)</option>
                    <option value="assenze">Malattia / Congedi / L.104</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Priorità
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="bassa">Bassa</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente (Termini perentori)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Reparto Stabilimento CSI
                </label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Descrizione dei fatti e documenti disponibili
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descrivi dettagliatamente date, turni lavorati, comunicazioni ricevute..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Termine o scadenza (se noto)
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800"
                >
                  Registra Pratica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
