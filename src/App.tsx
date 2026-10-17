import React, { useState, useEffect } from 'react';
import { User, AISearchResult, CircularItem } from './types/index.js';
import { CompanyProvider } from './context/CompanyContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Sidebar, NavTab } from './components/layout/Sidebar.tsx';
import { SalaryCalculatorView } from './components/views/SalaryCalculatorView.tsx';
import { DisciplinaryContestationsView } from './components/views/DisciplinaryContestationsView.tsx';
import { UnionRightsAssemblyView } from './components/views/UnionRightsAssemblyView.tsx';
import { RsuRlsToolkitView } from './components/views/RsuRlsToolkitView.tsx';
import { AppaltiFilieraView } from './components/views/AppaltiFilieraView.tsx';
import { AIAssistantView } from './components/views/AIAssistantView.tsx';
import { NormativaView } from './components/views/NormativaView.tsx';
import { CCNLView } from './components/views/CCNLView.tsx';
import { TicketsView } from './components/views/TicketsView.tsx';
import { DocumentGeneratorView } from './components/views/DocumentGeneratorView.tsx';
import { CalendarView } from './components/views/CalendarView.tsx';
import { ArchiveView } from './components/views/ArchiveView.tsx';
import { PlantInfoView } from './components/views/PlantInfoView.tsx';
import { AdminDashboardView } from './components/views/AdminDashboardView.tsx';
import { RsaRsuView } from './components/views/RsaRsuView.tsx';
import { OfflineIndicator } from './components/pwa/OfflineIndicator.tsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_operator',
    name: 'Operatore Sindacale',
    email: 'operatore@csi-colombella.it',
    role: 'rsu',
    department: 'Stabilimento CSI Colombella',
    badgeNumber: 'CSI-01',
    level: 'C3 (Ex 5° liv.)',
    status: 'active',
    createdAt: new Date().toISOString()
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [currentTab, setCurrentTab] = useState<NavTab>('salary_calc');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Target navigation state for direct AI search jumps
  const [navTarget, setNavTarget] = useState<AISearchResult['navigationTarget'] | null>(null);
  const [generatorTemplateId, setGeneratorTemplateId] = useState<string | undefined>(undefined);

  // Fetch current user from backend
  useEffect(() => {
    fetch('/api/auth/current')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
        if (data.availableUsers) setAvailableUsers(data.availableUsers);
      })
      .catch((err) => console.log('Auth current load error (using initial seed):', err));
  }, []);

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    }).catch((e) => console.error('Switch user error:', e));
  };

  const handleCreateTicketFromAI = () => {
    setCurrentTab('tickets');
  };

  const handleOpenDocGenerator = (templateId: string) => {
    setGeneratorTemplateId(templateId);
    setCurrentTab('doc_generator');
  };

  const handleNavigateToTarget = (target: AISearchResult['navigationTarget']) => {
    setNavTarget(target);
    if (target.tab === 'doc_generator' && target.targetId) {
      setGeneratorTemplateId(target.targetId);
    }
    setCurrentTab(target.tab as NavTab);
  };

  const handleOpenCircular = () => {
    setCurrentTab('plant_info');
  };

  return (
    <CompanyProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-700 selection:text-white">
        {/* PWA Offline Banner */}
        <OfflineIndicator />

        {/* Institutional FIOM Header */}
        <Header
          currentUser={currentUser}
          availableUsers={availableUsers}
          onSwitchUser={handleSwitchUser}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
          onNavigateToTarget={handleNavigateToTarget}
          onOpenCircular={handleOpenCircular}
        />

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setNavTarget(null);
              setCurrentTab(tab);
            }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userRole={currentUser.role}
          />

          {/* Content View Container */}
          <main className="flex-1 overflow-y-auto">
            {/* 1. Modulo Verifica Busta Paga & Tabelle CCNL */}
            {currentTab === 'salary_calc' && <SalaryCalculatorView />}

            {/* 2. Modulo Gestione Disciplinare (Art. 7) */}
            {currentTab === 'disciplinary' && <DisciplinaryContestationsView />}

            {/* 3. Modulo Diritti Sindacali & Assemblee */}
            {currentTab === 'union_rights' && <UnionRightsAssemblyView />}

            {/* 4. Modulo Salute e Sicurezza RLS */}
            {currentTab === 'rsu_rls' && <RsuRlsToolkitView />}

            {/* 5. Modulo Filiera & Cambio Appalti */}
            {currentTab === 'appalti_filiera' && <AppaltiFilieraView />}

            {/* Assistenti AI Conversazionali (FIOM & LexLabor) */}
            {currentTab === 'ai_assistant' && (
              <AIAssistantView
                currentUser={currentUser}
                onCreateTicketFromAI={handleCreateTicketFromAI}
              />
            )}

            {/* Rappresentanze RSA & RSU */}
            {currentTab === 'rsa_rsu' && (
              <RsaRsuView
                currentUser={currentUser}
                onOpenDocGenerator={handleOpenDocGenerator}
              />
            )}

            {/* Biblioteca Normativa */}
            {currentTab === 'normativa' && (
              <NormativaView
                initialSelectedNormaId={navTarget?.tab === 'normativa' ? navTarget.targetId : undefined}
              />
            )}

            {/* Tabelle CCNL Metalmeccanici */}
            {currentTab === 'ccnl' && (
              <CCNLView
                initialSubTab={navTarget?.tab === 'ccnl' && navTarget.subTab ? (navTarget.subTab as any) : undefined}
                initialLevelCode={navTarget?.tab === 'ccnl' ? navTarget.targetId : undefined}
              />
            )}

            {/* Generatore Bozze Sindacali */}
            {currentTab === 'doc_generator' && (
              <DocumentGeneratorView
                currentUser={currentUser}
                initialTemplateId={generatorTemplateId}
              />
            )}

            {/* Pratiche & Vertenze */}
            {currentTab === 'tickets' && (
              <TicketsView
                currentUser={currentUser}
                initialTicketId={navTarget?.tab === 'tickets' ? navTarget.targetId : undefined}
              />
            )}

            {/* Calendario & Scadenze */}
            {currentTab === 'calendar' && <CalendarView currentUser={currentUser} />}

            {/* Archivio Accordi e Documenti */}
            {currentTab === 'archive' && (
              <ArchiveView
                currentUser={currentUser}
                initialSelectedDocId={navTarget?.tab === 'archive' ? navTarget.targetId : undefined}
                initialFolderFilter={navTarget?.tab === 'archive' ? navTarget.targetFolder : undefined}
              />
            )}

            {/* Contesto Aziendale & Stabilimenti */}
            {currentTab === 'plant_info' && <PlantInfoView />}

            {/* Diagnostica Sistema & Audit */}
            {currentTab === 'admin_health' && (
              <AdminDashboardView currentUser={currentUser} />
            )}
          </main>
        </div>
      </div>
    </CompanyProvider>
  );
}
