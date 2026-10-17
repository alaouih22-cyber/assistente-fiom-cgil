import React, { useState } from 'react';
import { User, UserRole } from '../../types/index.js';
import { CCNL_METALMECCANICI_LEVELS } from '../../data/ccnl.js';
import { UserCheck, X, Shield, Building2, Save, Check } from 'lucide-react';

interface ProfileModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUpdateUser
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [department, setDepartment] = useState(currentUser.department);
  const [badgeNumber, setBadgeNumber] = useState(currentUser.badgeNumber || '');
  const [level, setLevel] = useState(currentUser.level || 'C3 (Ex 5° liv.)');
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedOk(false);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          name: name.trim() || 'Operatore',
          email: email.trim() || 'operatore@csi-colombella.it',
          role,
          department: department.trim() || 'Stabilimento CSI Colombella',
          badgeNumber: badgeNumber.trim(),
          level
        })
      });

      const data = await res.json();
      if (data.user) {
        onUpdateUser(data.user);
        setSavedOk(true);
        setTimeout(() => {
          setSavedOk(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-800 text-amber-300 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Profilo Operatore Reale</h2>
              <p className="text-2xs text-emerald-200">
                Configura i tuoi dati effettivi per pratiche, calcoli e modulistica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nome e Cognome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Marco Bianchi"
              className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ruolo Sindacale / Operativo
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              >
                <option value="lavoratore">Lavoratore Metalmeccanico</option>
                <option value="rsu">Delegato RSU (Eletto)</option>
                <option value="rsa">Delegato RSA (Nominato FIOM)</option>
                <option value="rls">RLS (Sicurezza Lavoro)</option>
                <option value="admin">Funzionario Sindacale / Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Livello Contrattuale
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              >
                {CCNL_METALMECCANICI_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={`${lvl.code} (${lvl.exLevel})`}>
                    {lvl.code} ({lvl.exLevel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reparto / Linea di Stabilimento
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="es. Linee Taglio Nastri & Slitter / Manutenzione"
              className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Matricola / ID Aziendale (Opzionale)
              </label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="es. CSI-0842"
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Operativa
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.cognome@email.it"
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-2xs text-slate-500">
            Nessun dato fittizio: i dati inseriti vengono utilizzati esclusivamente per intestare correttamente le bozze formali, le segnalazioni e le verifiche retributive.
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              {savedOk ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Salvato!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Salva Profilo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
