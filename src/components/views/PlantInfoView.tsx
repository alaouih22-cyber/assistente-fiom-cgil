import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Shield,
  Layers,
  FileText,
  AlertCircle,
  Check,
  Plus,
  ArrowRight
} from 'lucide-react';

export const PlantInfoView: React.FC = () => {
  const { currentCompany, availableCompanies, selectCompany } = useCompany();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Istituzionale FIOM */}
      <div className="bg-white border-l-4 border-red-700 shadow-xs rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
              Contesto Aziendale & Stabilimenti Metalmeccanici
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {currentCompany.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {currentCompany.facility} • {currentCompany.sector}
          </p>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs shrink-0 self-start md:self-auto">
          <span className="text-red-700 block text-2xs uppercase font-bold">Riferimento Sindacale Territoriale</span>
          <span className="font-extrabold text-slate-900 text-xs">{currentCompany.fiomContact.delegatoTerritoriale}</span>
        </div>
      </div>

      {/* Grid: Plant details + Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Plant Details */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-red-700" />
            Inquadramento Industriale & Produzione di Sito
          </h2>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>Attività principale di stabilimento:</strong> {currentCompany.production}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Unità e Organico</span>
                <span className="text-slate-600">{currentCompany.estimatedWorkers}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">CCNL Applicato</span>
                <span className="text-slate-600">{currentCompany.ccnlApplied}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Rappresentanza RSU</span>
                <span className="text-slate-600">{currentCompany.rsuStatus}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Salute & Sicurezza (RLS)</span>
                <span className="text-slate-600">{currentCompany.rlsStatus}</span>
              </div>
            </div>

            <div className="bg-red-50/60 border border-red-200 rounded-lg p-3.5 text-xs text-red-950 space-y-1 mt-2">
              <strong className="block text-red-900 font-bold">Stato della Contrattazione Collettiva & Accordi Locali (CIA):</strong>
              <p className="text-red-900 leading-relaxed">{currentCompany.integrativeAgreementStatus}</p>
            </div>
          </div>
        </div>

        {/* Union Contacts & Territorial Headquarter */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Shield className="w-4 h-4 text-red-700" />
              Presidio Territoriale FIOM-CGIL
            </h2>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Indirizzo Sede Sindacale:</span>
                  <span>{currentCompany.fiomContact.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-700 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 block">Telefono:</span>
                  <a href={`tel:${currentCompany.fiomContact.phone}`} className="text-red-700 hover:underline font-mono">
                    {currentCompany.fiomContact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-700 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 block">Posta Elettronica:</span>
                  <a href={`mailto:${currentCompany.fiomContact.email}`} className="text-red-700 hover:underline font-mono">
                    {currentCompany.fiomContact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Selettore Rapido Altri Stabilimenti */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Seleziona Altro Stabilimento di Riferimento
            </h3>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {availableCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCompany(c.id)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${
                    c.id === currentCompany.id
                      ? 'bg-red-50 border-red-300 font-bold text-red-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {c.id === currentCompany.id && (
                    <Check className="w-4 h-4 text-red-700 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
