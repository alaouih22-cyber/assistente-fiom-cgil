import React from 'react';
import { UserRole } from '../../types/index.js';
import {
  Bot,
  BookOpen,
  Layers,
  Calculator,
  FileText,
  ShieldAlert,
  PenTool,
  Calendar,
  FolderLock,
  Building,
  Activity,
  Scale,
  X,
  Clock,
  Users,
  Briefcase,
  Gift
} from 'lucide-react';

export type NavTab =
  | 'salary_calc'
  | 'disciplinary'
  | 'union_rights'
  | 'rsu_rls'
  | 'appalti_filiera'
  | 'ai_assistant'
  | 'rsa_rsu'
  | 'ccnl'
  | 'doc_generator'
  | 'normativa'
  | 'tickets'
  | 'calendar'
  | 'archive'
  | 'plant_info'
  | 'admin_health';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  pendingTicketsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  userRole,
  pendingTicketsCount = 0,
}) => {
  const isDelegateOrAdmin = ['admin', 'rsa', 'rsu', 'rls'].includes(userRole);

  const mainModules = [
    {
      id: 'salary_calc' as NavTab,
      number: '1',
      label: 'Busta Paga & Tabelle CCNL',
      sublabel: 'Minimi Giugno 2026, Scatti, Straordinari +8%, Welfare',
      icon: Calculator
    },
    {
      id: 'disciplinary' as NavTab,
      number: '2',
      label: 'Gestione Disciplinare (Art. 7)',
      sublabel: 'Contestazioni, 5gg a difesa, memorie e audizione',
      icon: Scale
    },
    {
      id: 'union_rights' as NavTab,
      number: '3',
      label: 'Diritti Sindacali & Assemblee',
      sublabel: '10 ore annue, preavviso convocazione, permessi RSU',
      icon: Users
    },
    {
      id: 'rsu_rls' as NavTab,
      number: '4',
      label: 'Salute e Sicurezza (Ruolo RLS)',
      sublabel: 'Checklist macchine/carroponte, verbali 81/08',
      icon: ShieldAlert
    },
    {
      id: 'appalti_filiera' as NavTab,
      number: '5',
      label: 'Filiera & Cambio Appalti',
      sublabel: 'Verifica CCNL, clausola sociale, resp. solidale art. 29',
      icon: Briefcase
    }
  ];

  const secondaryTools = [
    {
      id: 'ai_assistant' as NavTab,
      label: 'Assistenti AI Conversazionali',
      sublabel: 'FIOM-CGIL & LexLabor (Temp 0.1)',
      icon: Bot,
      highlight: true
    },
    {
      id: 'rsa_rsu' as NavTab,
      label: 'Rappresentanze RSA & RSU',
      sublabel: 'Norme, differenze, diritti e orientamento',
      icon: Layers
    },
    {
      id: 'doc_generator' as NavTab,
      label: 'Generatore Bozze Sindacali',
      sublabel: 'Modulistica e lettere formali RSU',
      icon: PenTool
    },
    {
      id: 'ccnl' as NavTab,
      label: 'Tabelle & Declaratorie CCNL',
      sublabel: '9 livelli (D1-A1), mansioni e preavviso',
      icon: FileText
    },
    {
      id: 'normativa' as NavTab,
      label: 'Biblioteca Normativa',
      sublabel: 'Statuto Lavoratori, Costituzione, 81/08',
      icon: BookOpen
    },
    {
      id: 'plant_info' as NavTab,
      label: 'Contesto Aziendale & Sedi',
      sublabel: 'CSI Colombella, AST Terni, filiera umbra',
      icon: Building
    },
    {
      id: 'admin_health' as NavTab,
      label: 'Stato Sistema & Trasparenza',
      sublabel: 'Diagnostica API e audit log',
      icon: Activity
    }
  ];

  const handleItemClick = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white border-r border-slate-200 shadow-lg lg:shadow-none flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Inside Sidebar */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200 lg:hidden bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-700 text-white font-black text-xs flex items-center justify-center">
              FIOM
            </div>
            <span className="font-bold text-xs text-slate-900">
              Menu Strumenti RSU/RSA
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            aria-label="Chiudi menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Sezione 1: Moduli Operativi Principali */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-red-700 flex items-center justify-between">
              <span>5 Moduli Operativi RSU / RSA</span>
              <span className="text-slate-400 font-normal">CCNL Federmeccanica</span>
            </div>

            <nav className="space-y-1">
              {mainModules.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-red-700 text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-red-800 text-amber-300'
                          : 'bg-red-50 text-red-700 group-hover:bg-red-100'
                      }`}
                    >
                      {item.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight truncate ${
                          isActive ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-[10px] leading-tight truncate mt-0.5 ${
                          isActive ? 'text-red-100' : 'text-slate-500'
                        }`}
                      >
                        {item.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sezione 2: Assistenti & Strumenti Ausiliari */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assistenza AI & Fonti Giuridiche
            </div>

            <nav className="space-y-1">
              {secondaryTools.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-red-700 text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-red-700'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-tight truncate ${
                          isActive ? 'text-white font-bold' : 'text-slate-800'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-[10px] leading-tight truncate mt-0.5 ${
                          isActive ? 'text-red-100' : 'text-slate-400'
                        }`}
                      >
                        {item.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Sidebar Istituzionale */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>FIOM-CGIL Perugia / Umbria</span>
            <span className="text-red-700">CCNL 2024-2026</span>
          </div>
          <p className="text-[10px] text-slate-400">
            A tutela delle delegate, dei delegati e del lavoro metalmeccanico.
          </p>
        </div>
      </aside>
    </>
  );
};
