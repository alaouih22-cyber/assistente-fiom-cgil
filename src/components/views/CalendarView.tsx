import React, { useState, useEffect } from 'react';
import { CalendarEvent, User } from '../../types/index.js';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertOctagon,
  Plus,
  ShieldCheck,
  Download,
  CheckCircle,
  FileText
} from 'lucide-react';

export const CalendarView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newLocation, setNewLocation] = useState('Stabilimento CSI Colombella');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('termine_legale');
  const [newPriority, setNewPriority] = useState<CalendarEvent['priority']>('alta');
  const [newSource, setNewSource] = useState('');

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newSource.trim()) {
      alert('Inserisci titolo, data e fonte giuridica della scadenza.');
      return;
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          title: newTitle,
          date: newDate,
          time: newTime,
          location: newLocation,
          category: newCategory,
          priority: newPriority,
          sourceOfDeadline: newSource
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewDate('');
        setNewSource('');
        fetchEvents();
      }
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const getPriorityBadge = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'perentoria':
        return <span className="bg-red-100 text-red-800 text-3xs font-black uppercase px-2 py-0.5 rounded-full border border-red-300">Termine Perentorio</span>;
      case 'alta':
        return <span className="bg-amber-100 text-amber-800 text-3xs font-bold px-2 py-0.5 rounded-full border border-amber-300">Priorità Alta</span>;
      case 'media':
      default:
        return <span className="bg-blue-100 text-blue-800 text-3xs font-medium px-2 py-0.5 rounded-full border border-blue-200">Ordinaria</span>;
    }
  };

  const exportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//FIOM-CGIL//CSI Colombella//IT\n";
    events.forEach(evt => {
      const dateClean = evt.date.replaceAll('-', '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${evt.title}\nDESCRIPTION:${evt.sourceOfDeadline}\nLOCATION:${evt.location || ''}\nDTSTART;VALUE=DATE:${dateClean}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const element = document.createElement('a');
    const file = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "calendario_scadenze_fiom.ics";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Scadenzario Legale & Calendario Sindacale
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracciamento perentorio di termini a difesa, visite periodiche di sicurezza e assemblee di stabilimento.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={exportICS}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            title="Esporta per Google Calendar / Outlook"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Esporta .ICS</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Scadenza</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:border-red-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getPriorityBadge(evt.priority)}
                <span className="text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                  {evt.category.replace('_', ' ')}
                </span>
                {evt.isConfirmed && (
                  <span className="text-2xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Confermato
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {evt.title}
              </h3>

              {/* Legal source */}
              <div className="text-xs text-red-950 bg-red-50/60 p-2 rounded-xl border border-red-100">
                <strong>Fonte Giuridica del Termine:</strong> {evt.sourceOfDeadline}
              </div>
            </div>

            {/* Date time and location */}
            <div className="flex flex-col md:items-end justify-center text-xs text-slate-600 space-y-1 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <CalendarIcon className="w-4 h-4 text-red-700" />
                <span>{new Date(evt.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              {evt.time && (
                <div className="flex items-center gap-1 text-2xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ore {evt.time}</span>
                </div>
              )}
              {evt.location && (
                <div className="flex items-center gap-1 text-2xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
            Nessun evento o scadenza programmata in calendario.
          </div>
        )}
      </div>

      {/* Add event modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Aggiungi Nuova Scadenza o Incontro
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Titolo Scadenza o Convocazione
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Scadenza memorie disciplinari o incontro RSU"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Data Scadenza
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Ora
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Tipologia
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="termine_legale">Termine Legale Perentorio</option>
                    <option value="incontro_direzione">Incontro con Direzione</option>
                    <option value="assemblea">Assemblea Sindacale</option>
                    <option value="visita_rls">Visita Sicurezza RLS</option>
                    <option value="scadenza_pratica">Scadenza Pratica</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Priorità
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="perentoria">Perentoria (decadenza)</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="bassa">Bassa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Luogo
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Fonte Giuridica del Termine (Obbligatoria)
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Art. 7 c. 5 L. 300/1970 o Art. 35 D.Lgs. 81/2008"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800"
                >
                  Salva Scadenza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
