import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import { Building2, Check, X, Plus, Edit2, Shield, MapPin, Users } from 'lucide-react';

interface CompanySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanySelectorModal: React.FC<CompanySelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentCompany, availableCompanies, selectCompany, updateCustomCompany } = useCompany();
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Custom company form
  const [customName, setCustomName] = useState('');
  const [customFacility, setCustomFacility] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customProduction, setCustomProduction] = useState('');
  const [customWorkers, setCustomWorkers] = useState('');

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    selectCompany(id);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert('Inserire la ragione sociale dell\'azienda.');
      return;
    }

    updateCustomCompany({
      name: customName.trim(),
      facility: customFacility.trim() || 'Stabilimento di produzione',
      location: customLocation.trim() || 'Umbria / Italia',
      production: customProduction.trim() || 'Lavorazioni metalmeccaniche industriali',
      estimatedWorkers: customWorkers.trim() || 'Non specificato'
    });

    setIsAddingCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-red-700 text-white">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Seleziona Contesto Aziendale & Stabilimento</h3>
              <p className="text-2xs text-red-100">Profilazione contrattuale e intestazione documenti per i delegati RSU/RSA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {!isAddingCustom ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Stabilimenti Metalmeccanici di Riferimento
                </span>
                <button
                  onClick={() => setIsAddingCustom(true)}
                  className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Altra Azienda Personalizzata
                </button>
              </div>

              <div className="space-y-2">
                {availableCompanies.map((comp) => {
                  const isSelected = comp.id === currentCompany.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleSelect(comp.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isSelected
                          ? 'border-red-600 bg-red-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{comp.name}</h4>
                          {comp.id === 'csi_colombella' && (
                            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded border border-red-200">
                              Focus Primario
                            </span>
                          )}
                          {comp.isCustom && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                              Personalizzata
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {comp.facility} ({comp.location})
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{comp.production}</p>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateCustom} className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Inserisci Nuova Ragione Sociale / Stabilimento
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ragione Sociale Azienda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Meccanica Umbra S.p.A."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stabilimento / Sede
                </label>
                <input
                  type="text"
                  placeholder="Es. Stabilimento di Todi (PG)"
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Indirizzo / Località
                </label>
                <input
                  type="text"
                  placeholder="Es. Zona Industriale Pian di Porto"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attività Produttiva Principale
                </label>
                <input
                  type="text"
                  placeholder="Es. Torneria, fresatura CNC e carpenteria metallica"
                  value={customProduction}
                  onChange={(e) => setCustomProduction(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numero Dipendenti Stimato
                </label>
                <input
                  type="text"
                  placeholder="Es. 80 lavoratori"
                  value={customWorkers}
                  onChange={(e) => setCustomWorkers(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Salva e Applica Contesto
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
