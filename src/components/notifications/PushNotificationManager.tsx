import React, { useState, useEffect } from 'react';
import { User, CircularItem } from '../../types/index.js';
import {
  Bell,
  BellRing,
  BellOff,
  Send,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Megaphone,
  X
} from 'lucide-react';

interface PushNotificationManagerProps {
  currentUser: User;
  onOpenCircular?: (circular: CircularItem) => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  currentUser,
  onOpenCircular
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  // Delegate broadcast modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastSummary, setBroadcastSummary] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<CircularItem['category']>('urgente');
  const [isSending, setIsSending] = useState(false);

  const isDelegateOrAdmin = ['admin', 'rsa', 'rsu', 'rls'].includes(currentUser.role);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    fetch('/api/notifications/circulars')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCirculars(data);
      })
      .catch((err) => console.log('Error fetching circulars:', err));
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Il tuo browser non supporta le Notifiche Web API.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Trigger test welcome push
        showLocalPushNotification(
          'Notifiche FIOM-CGIL Attivate',
          'Riceverai avvisi in tempo reale per circolari urgenti, convocazioni assemblea e scadenze contrattuali CSI Colombella.'
        );

        // Register push subscription to backend
        fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            userRole: currentUser.role,
            timestamp: new Date().toISOString()
          })
        }).catch(e => console.error(e));
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  const showLocalPushNotification = (title: string, body: string, isUrgent: boolean = false) => {
    // Show in-app banner toast
    setActiveToast({ title, body });
    setTimeout(() => setActiveToast(null), 7000);

    // Try service worker notification first
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'fiom-urgent-update',
          vibrate: isUrgent ? [200, 100, 200, 100, 200] : [200, 100, 200],
          data: { url: window.location.href }
        } as any);
      }).catch(() => {
        // Fallback to standard Notification API
        if (Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/pwa-192x192.png' });
        }
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/pwa-192x192.png' });
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastSummary.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          title: broadcastTitle,
          summary: broadcastSummary,
          category: broadcastCategory,
          isUrgent: true
        })
      });

      if (res.ok) {
        const newCirc = await res.json();
        setCirculars(prev => [newCirc, ...prev]);
        setIsBroadcastModalOpen(false);
        setBroadcastTitle('');
        setBroadcastSummary('');

        // Trigger local notification for testing feedback
        showLocalPushNotification(
          `🔴 COMUNICAZIONE URGENTE: ${newCirc.title}`,
          newCirc.summary,
          true
        );
      }
    } catch (err) {
      console.error('Error broadcasting circular:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Push Notification Toast */}
      {activeToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-red-500/40 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-red-600 rounded-xl shrink-0 mt-0.5">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-xs text-amber-300 uppercase tracking-wide">
                  FIOM-CGIL CSI Colombella
                </div>
                <h4 className="font-bold text-sm text-white mt-0.5">{activeToast.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeToast.body}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bell Button with badge in header */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setUnreadCount(0);
          }}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-hidden"
          title="Notifiche e Circolari Sindacali"
        >
          {permission === 'granted' ? (
            <BellRing className="w-5 h-5 text-red-700" />
          ) : (
            <Bell className="w-5 h-5 text-slate-600" />
          )}

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-3xs font-extrabold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Megaphone className="w-4 h-4 text-red-700" />
                <span>Circolari & Avvisi Sindacali</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Permission State */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase text-slate-500 block">
                  Stato Notifiche Web Push
                </span>
                <span className="font-semibold text-slate-800">
                  {permission === 'granted'
                    ? 'Attive e Funzionanti'
                    : permission === 'denied'
                    ? 'Bloccate nel Browser'
                    : 'Non ancora attivate'}
                </span>
              </div>

              {permission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-2.5 py-1.5 bg-red-700 text-white rounded-lg text-2xs font-bold hover:bg-red-800 transition"
                >
                  Attiva Notifiche
                </button>
              )}

              {permission === 'granted' && (
                <button
                  onClick={() =>
                    showLocalPushNotification(
                      'Prova Notifica Push FIOM',
                      'Connessione Service Worker e Notification API verificata con successo.',
                      true
                    )
                  }
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-3xs font-bold transition"
                >
                  Invia Prova
                </button>
              )}
            </div>

            {/* Circulars list */}
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
              {circulars.map((circ) => (
                <div
                  key={circ.id}
                  onClick={() => {
                    if (onOpenCircular) onOpenCircular(circ);
                    setIsOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    circ.isUrgent
                      ? 'bg-red-50/70 border-red-200 hover:bg-red-100/70'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-3xs font-mono font-bold text-red-700 bg-red-100/60 px-1.5 py-0.5 rounded">
                      {circ.code}
                    </span>
                    {circ.isUrgent && (
                      <span className="text-3xs font-black uppercase text-red-700 bg-red-200 px-1.5 py-0.5 rounded">
                        Urgente
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{circ.title}</h5>
                  <p className="text-2xs text-slate-600 line-clamp-2 mt-0.5">{circ.summary}</p>
                </div>
              ))}
            </div>

            {/* Broadcast action for delegates */}
            {isDelegateOrAdmin && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-3xs text-slate-400">Pannello Delegati RSU/RSA</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsBroadcastModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-2xs font-bold hover:bg-slate-800 transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Invia Circolare Urgente</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Broadcast for delegates */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-red-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Trasmetti Circolare Urgente con Push Notification
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Titolo Avviso / Circolare
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Convocazione Assemblea Salari o Modifica Turni Slitter"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Sommario della Notifica Push
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Testo sintetico inviato come notifica push ai lavoratori..."
                  value={broadcastSummary}
                  onChange={(e) => setBroadcastSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Invio in corso...' : 'Invia Notifica a Tutti'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
