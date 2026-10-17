export interface MetalworkingCompany {
  id: string;
  name: string;
  facility: string;
  location: string;
  sector: string;
  group?: string;
  production: string;
  estimatedWorkers: number | string;
  ccnlApplied: string;
  ccnlStatus: string;
  integrativeAgreementStatus: string;
  rsuStatus: string;
  rlsStatus: string;
  fiomContact: {
    address: string;
    phone: string;
    email: string;
    delegatoTerritoriale: string;
  };
  isCustom?: boolean;
}

export const REFERENCE_METALWORKING_COMPANIES: MetalworkingCompany[] = [
  {
    id: 'csi_colombella',
    name: 'Centro Siderurgico Industriale (CSI S.r.l.)',
    facility: 'Stabilimento di Colombella (Perugia)',
    location: 'Strada di Colombella 12, 06134 Colombella (PG)',
    sector: 'Siderurgia & Lavorazione Nastri Acciaio',
    group: 'Gruppo Arvedi',
    production: 'Lavorazione e cesoiatura nastri in acciaio al carbonio, lamiere spianate a freddo/decapato, slitter pesanti',
    estimatedWorkers: 120,
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'Contratto collettivo nazionale di riferimento applicato a tutto il personale dipendente.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale di stabilimento (PdR, turnistiche avvicendate, indennità di reparto).',
    rsuStatus: 'Rappresentanza Sindacale Unitaria eletta con delegati FIOM-CGIL.',
    rlsStatus: 'Rappresentanti dei Lavoratori per la Sicurezza (RLS) eletti ex art. 47 D.Lgs. 81/08.',
    fiomContact: {
      address: 'Via Caciolle 12 / Via Belluno 10, 06128 Perugia',
      phone: '+39 075 506981',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM-CGIL Perugia'
    }
  },
  {
    id: 'ast_terni',
    name: 'Acciai Speciali Terni (AST S.p.A.) & Tubificio di Terni',
    facility: 'Stabilimento Siderurgico di Terni',
    location: 'Viale Benedetto Brin 218, 05100 Terni (TR)',
    sector: 'Siderurgia Pesante & Acciai Inossidabili',
    group: 'Gruppo Arvedi',
    production: 'Fabbricazione acciai inox laminati a caldo e a freddo, fucinati, tubi saldati speciali per automotive ed energia',
    estimatedWorkers: 'Circa 2.400 dipendenti diretti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL di riferimento con accordi storici di sito industriale siderurgico.',
    integrativeAgreementStatus: 'Contrattazione integrativa aziendale di secondo livello e accordo di programma di sito.',
    rsuStatus: 'Collegio RSU con forte rappresentanza FIOM-CGIL.',
    rlsStatus: 'RLS di stabilimento e RLSSA coordinati con l\'SPP.',
    fiomContact: {
      address: 'Vico San Procolo 8, 05100 Terni',
      phone: '+39 0744 4961',
      email: 'fiom.terni@umbria.cgil.it',
      delegatoTerritoriale: 'Segreteria Provinciale FIOM-CGIL Terni'
    }
  },
  {
    id: 'umbragroup',
    name: 'Umbragroup S.p.A.',
    facility: 'Stabilimento di Foligno',
    location: 'Via Valter Baldaccini 1, 06034 Foligno (PG)',
    sector: 'Aerospazio, Difesa & Meccatronica ad Alta Precisione',
    production: 'Viti a ricircolo di sfere per l\'aeronautica, attuatori elettromeccanici, cuscinetti e componentistica high-tech',
    estimatedWorkers: 'Circa 800 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL Metalmeccanici Industria applicato.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale su welfare, orari flessibili e premio di risultato.',
    rsuStatus: 'RSU FIOM-CGIL costituita.',
    rlsStatus: 'RLS aziendali regolarmente eletti.',
    fiomContact: {
      address: 'Via Caciolle 12, Perugia / Sede CGIL Foligno: Via Garibaldi 134',
      phone: '+39 0742 350280',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Foligno-Spoleto'
    }
  },
  {
    id: 'tiberina',
    name: 'Metalmeccanica Tiberina S.r.l. (Tiberina Group)',
    facility: 'Stabilimento di Umbertide',
    location: 'Zona Industriale Madonna del Moro, 06019 Umbertide (PG)',
    sector: 'Automotive Componenti & Stampaggio Lamiera',
    group: 'Tiberina Group',
    production: 'Stampaggio a freddo e a caldo, assemblaggio scocche e componenti strutturali metallici per autoveicoli',
    estimatedWorkers: 'Circa 450 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL Metalmeccanici Industria applicato.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale con articolazione turni e premio di produttività.',
    rsuStatus: 'RSU costituita con delegati FIOM-CGIL.',
    rlsStatus: 'RLS di stabilimento attivi.',
    fiomContact: {
      address: 'Camera del Lavoro di Umbertide / FIOM Perugia',
      phone: '+39 075 9413220',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Alta Valle del Tevere'
    }
  },
  {
    id: 'oma_foligno',
    name: 'O.M.A. S.p.A. (Officine Meccaniche Aeronautiche)',
    facility: 'Stabilimento di Foligno',
    location: 'Via Fiammetta 22, 06034 Foligno (PG)',
    sector: 'Aeronautica & Difesa',
    production: 'Progettazione e fabbricazione componenti per aerostrutture, sistemi idraulici ed elettromeccanici aeronautici',
    estimatedWorkers: 'Circa 600 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL applicato.',
    integrativeAgreementStatus: 'Contrattazione integrativa aziendale di secondo livello vigente.',
    rsuStatus: 'RSU FIOM-CGIL in carica.',
    rlsStatus: 'RLS aziendali eletti.',
    fiomContact: {
      address: 'Sede CGIL Foligno: Via Garibaldi 134, 06034 Foligno (PG)',
      phone: '+39 0742 350280',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Foligno'
    }
  },
  {
    id: 'ncm_foligno',
    name: 'N.C.M. S.p.A.',
    facility: 'Stabilimento di Foligno',
    location: 'Via Pasciana 48, 06034 Foligno (PG)',
    sector: 'Meccanica di Precisione & Power Generation',
    production: 'Lavorazioni meccaniche di precisione per turbine a gas, componenti aerospaziali e prototipazione industriale',
    estimatedWorkers: 'Circa 250 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL applicato.',
    integrativeAgreementStatus: 'Accordi aziendali di stabilimento.',
    rsuStatus: 'RSU eletta con delegati FIOM.',
    rlsStatus: 'RLS presenti ex art. 47 D.Lgs. 81/08.',
    fiomContact: {
      address: 'Sede CGIL Foligno: Via Garibaldi 134',
      phone: '+39 0742 350280',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Foligno'
    }
  },
  {
    id: 'faurecia_terni',
    name: 'Faurecia / Forvia S.p.A.',
    facility: 'Stabilimento di Terni',
    location: 'Strada di Sabbione 99, 05100 Terni (TR)',
    sector: 'Automotive & Sistemi di Scarico',
    group: 'Forvia Group',
    production: 'Sistemi di trattamento emissioni e marmitte catalitiche per veicoli industriali e passeggeri',
    estimatedWorkers: 'Circa 300 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL applicato.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale di secondo livello su turni e flessibilità.',
    rsuStatus: 'RSU in carica con delegati FIOM-CGIL.',
    rlsStatus: 'RLS di stabilimento attivi.',
    fiomContact: {
      address: 'Vico San Procolo 8, 05100 Terni',
      phone: '+39 0744 4961',
      email: 'fiom.terni@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Terni'
    }
  },
  {
    id: 'emmepi_group',
    name: 'Emmepi Group S.r.l.',
    facility: 'Stabilimento di Perugia',
    location: 'Via Pievaiola 166, 06132 Perugia (PG)',
    sector: 'Impianti Meccanici & Automazione Packaging',
    production: 'Macchinari e impianti automatizzati per la movimentazione e legatura nell\'industria del cartone ondulato',
    estimatedWorkers: 'Circa 90 dipendenti',
    ccnlApplied: 'CCNL Metalmeccanici Industria Federmeccanica-Assistal',
    ccnlStatus: 'CCNL applicato.',
    integrativeAgreementStatus: 'Accordo integrativo aziendale.',
    rsuStatus: 'Rappresentanza sindacale unitaria FIOM-CGIL.',
    rlsStatus: 'RLS eletto ex D.Lgs. 81/08.',
    fiomContact: {
      address: 'Via Caciolle 12, 06128 Perugia',
      phone: '+39 075 506981',
      email: 'fiom.perugia@umbria.cgil.it',
      delegatoTerritoriale: 'Funzionario Territoriale FIOM Perugia'
    }
  }
];

export const DEFAULT_PRIMARY_COMPANY = REFERENCE_METALWORKING_COMPANIES[0];
