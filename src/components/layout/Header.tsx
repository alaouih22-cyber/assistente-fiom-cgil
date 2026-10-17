import React, { useState } from 'react';
import { User, UserRole, AISearchResult, CircularItem } from '../../types/index.js';
import { useCompany } from '../../context/CompanyContext.tsx';
import { PWAInstallButton } from '../pwa/PWAInstallButton.js';
import { PushNotificationManager } from '../notifications/PushNotificationManager.js';
import { UniversalAISearchBar } from '../search/UniversalAISearchBar.js';
import { ProfileModal } from '../profile/ProfileModal.js';
import { CompanySelectorModal } from './CompanySelectorModal.tsx';
import { Shield, Menu, UserCheck, Building2, ChevronDown, Flame } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (user: User) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onNavigateToTarget: (target: AISearchResult['navigationTarget']) => void;
  onOpenCircular?: (circular: CircularItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onToggleSidebar,
  onNavigateToTarget,
  onOpenCircular
}) => {
  const { currentCompany } = useCompany();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin / Territorio';
      case 'rsu':
        return 'Delegato RSU';
      case 'rsa':
        return 'Delegato RSA';
      case 'rls':
        return 'RLS Sicurezza';
      case 'consulente':
        return 'Consulente';
      case 'lavoratore':
      default:
        return 'Lavoratore';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Institutional FIOM Red Bar */}
        <div className="bg-red-700 h-1.5 w-full" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Zone 1: Brand Wordmark FIOM-CGIL */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
                aria-label="Apri menu di navigazione"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-xs border border-red-800 shrink-0 font-black text-xs sm:text-sm tracking-tight">
                  FIOM
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight">
                      FIOM-CGIL
                    </span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                      CCNL Metalmeccanici
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sindacato Lavoratori Metalmeccanici
                  </p>
                </div>
              </div>
            </div>

            {/* Zone 2: Universal AI Search Bar */}
            <div className="flex-1 flex justify-center max-w-md mx-1 sm:mx-2">
              <UniversalAISearchBar
                currentUser={currentUser}
                onNavigateToTarget={onNavigateToTarget}
                compact
              />
            </div>

            {/* Zone 3: Company Selector, Push Notifications, Profile Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Plant / Company Context Switcher Button */}
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-red-50 hover:text-red-800 rounded-lg border border-slate-200 transition-colors"
                title="Cambia stabilimento o seleziona altra azienda metalmeccanica"
              >
                <Building2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[160px] truncate">
                  {currentCompany.name.replace('Centro Siderurgico Industriale (CSI S.r.l.)', 'CSI Colombella').replace('Acciai Speciali Terni (AST S.p.A.) & Tubificio di Terni', 'AST Terni')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Push Notification Manager */}
              <PushNotificationManager
                currentUser={currentUser}
                onOpenCircular={onOpenCircular}
              />

              {/* Real Operator Profile Trigger */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-left cursor-pointer"
                title="Profilo Operatore Sindacale"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="hidden md:block leading-none">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-red-700 font-semibold">
                    {getRoleLabel(currentUser.role)}
                  </p>
                </div>
              </button>

              {/* PWA Install */}
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        currentUser={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdateUser={onSwitchUser}
      />

      {/* Company Selector Modal */}
      <CompanySelectorModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </>
  );
};
