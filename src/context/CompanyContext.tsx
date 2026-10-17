import React, { createContext, useContext, useState, useEffect } from 'react';
import { MetalworkingCompany, REFERENCE_METALWORKING_COMPANIES, DEFAULT_PRIMARY_COMPANY } from '../data/companies.ts';

interface CompanyContextType {
  currentCompany: MetalworkingCompany;
  availableCompanies: MetalworkingCompany[];
  selectCompany: (companyId: string) => void;
  updateCustomCompany: (customData: Partial<MetalworkingCompany>) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'fiom_selected_company';
const CUSTOM_COMPANIES_KEY = 'fiom_custom_companies';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<MetalworkingCompany[]>(() => {
    try {
      const savedCustom = localStorage.getItem(CUSTOM_COMPANIES_KEY);
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        return [...REFERENCE_METALWORKING_COMPANIES, ...parsed];
      }
    } catch (e) {
      console.warn('Error reading custom companies from localStorage', e);
    }
    return REFERENCE_METALWORKING_COMPANIES;
  });

  const [currentCompany, setCurrentCompany] = useState<MetalworkingCompany>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = REFERENCE_METALWORKING_COMPANIES.find(c => c.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      console.warn('Error reading saved company from localStorage', e);
    }
    return DEFAULT_PRIMARY_COMPANY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentCompany.id);
    } catch (e) {
      console.error('Error saving company to localStorage', e);
    }
  }, [currentCompany]);

  const selectCompany = (companyId: string) => {
    const found = companies.find(c => c.id === companyId);
    if (found) {
      setCurrentCompany(found);
    }
  };

  const updateCustomCompany = (customData: Partial<MetalworkingCompany>) => {
    const newId = customData.id || `custom_${Date.now()}`;
    const customComp: MetalworkingCompany = {
      id: newId,
      name: customData.name || 'Nuova Azienda Metalmeccanica',
      facility: customData.facility || 'Stabilimento di produzione',
      location: customData.location || 'Umbria / Italia',
      sector: customData.sector || 'Metalmeccanica & Meccatronica',
      production: customData.production || 'Lavorazioni meccaniche industriali',
      estimatedWorkers: customData.estimatedWorkers || 'Non specificato',
      ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
      ccnlStatus: 'Applicato di riferimento',
      integrativeAgreementStatus: customData.integrativeAgreementStatus || 'Da verificare archivio RSU',
      rsuStatus: customData.rsuStatus || 'RSU FIOM-CGIL',
      rlsStatus: customData.rlsStatus || 'RLS ex D.Lgs. 81/08',
      fiomContact: customData.fiomContact || {
        address: 'Camera del Lavoro Territoriale',
        phone: 'Centralino Sindacale',
        email: 'fiom@cgil.it',
        delegatoTerritoriale: 'Funzionario Territoriale'
      },
      isCustom: true
    };

    setCompanies(prev => {
      const filtered = prev.filter(c => c.id !== newId);
      const updated = [...filtered, customComp];
      try {
        const customsOnly = updated.filter(c => c.isCustom);
        localStorage.setItem(CUSTOM_COMPANIES_KEY, JSON.stringify(customsOnly));
      } catch (e) {
        console.error('Error saving custom company', e);
      }
      return updated;
    });

    setCurrentCompany(customComp);
  };

  const resetToDefault = () => {
    setCurrentCompany(DEFAULT_PRIMARY_COMPANY);
  };

  return (
    <CompanyContext.Provider
      value={{
        currentCompany,
        availableCompanies: companies,
        selectCompany,
        updateCustomCompany,
        resetToDefault
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
