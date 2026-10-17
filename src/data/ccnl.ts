export interface CCNLLevel {
  code: string;
  exLevel: string;
  field: 'Ruolo Operativo' | 'Ruolo Tecnico Specifico' | 'Ruolo Specialistico e Gestionale' | 'Ruolo Direttivo';
  monthlyBasePay: number; // Minimo tabellare lordo mensile (es. con adeguamenti IPCA)
  valoreScattoBiennale: number; // Valore mensile contrattuale singolo scatto biennale (max 5 scatti)
  indennitaFunzioneQuadro?: number; // Indennità mensile di funzione (es. Quadri A1)
  declaratoria: string;
  esempiMansioniMetalmeccaniche: string[];
  terminiMansioniSuperioriMesi: number;
}

export const CCNL_METALMECCANICI_LEVELS: CCNLLevel[] = [
  {
    code: 'D1',
    exLevel: '1° Livello',
    field: 'Ruolo Operativo',
    monthlyBasePay: 1784.94,
    valoreScattoBiennale: 19.42,
    declaratoria: 'Lavoratori che svolgono attivita semplici a ciclo breve o mansioni di manovalanza comune, pulizia e movimentazione elementare con istruzioni dettagliate.',
    esempiMansioniMetalmeccaniche: ['Manovale comune', 'Addetto al disimballo', 'Movimentazione carichi manuale'],
    terminiMansioniSuperioriMesi: 1
  },
  {
    code: 'D2',
    exLevel: '2° e 3° Livello',
    field: 'Ruolo Operativo',
    monthlyBasePay: 1979.37,
    valoreScattoBiennale: 22.88,
    declaratoria: 'Lavoratori che eseguono lavorazioni e operazioni su macchine operatrici o impianti semi-automatici secondo istruzioni prefissate, controllando la regolarita del ciclo di lavoro.',
    esempiMansioniMetalmeccaniche: [
      'Operatore su linea di taglio lamiere / slitter ausiliario',
      'Addetto all imballo coils e reggiatura nastri',
      'Conduttore carrello elevatore con patentino',
      'Operaio addetto al decapaggio o spianatura ausiliaria'
    ],
    terminiMansioniSuperioriMesi: 3
  },
  {
    code: 'C1',
    exLevel: '3° Livello avanzato',
    field: 'Ruolo Tecnico Specifico',
    monthlyBasePay: 2022.12,
    valoreScattoBiennale: 25.05,
    declaratoria: 'Lavoratori qualificati che operano su impianti e linee produttive con capacita di regolazione parametri, cambio utensili/lame, controllo qualita dimensionale di prima linea.',
    esempiMansioniMetalmeccaniche: [
      'Conduttore slitter o linea cesoiatura nastri in acciaio',
      'Operatore spianatrice lamiere a caldo/freddo',
      'Saldatore qualificato e montatore meccanico di linea',
      'Operatore carrello pesante per carico/scarico coils da 20 tonnellate'
    ],
    terminiMansioniSuperioriMesi: 3
  },
  {
    code: 'C2',
    exLevel: '4° Livello',
    field: 'Ruolo Tecnico Specifico',
    monthlyBasePay: 2064.88,
    valoreScattoBiennale: 26.49,
    declaratoria: 'Lavoratori con perizia esecutiva e autonomia operativa su linee complesse, capacita di diagnosi anomalie di processo e interventi di manutenzione autonoma di primo livello.',
    esempiMansioniMetalmeccaniche: [
      'Primo conduttore linea di taglio e spianatura nastri',
      'Manutentore meccanico o elettrico di reparto',
      'Controllo qualita tolleranze spessore e planarita nastri',
      'Impiegato logistica spedizioni metalli e bollettazione'
    ],
    terminiMansioniSuperioriMesi: 3
  },
  {
    code: 'C3',
    exLevel: '5° Livello',
    field: 'Ruolo Tecnico Specifico',
    monthlyBasePay: 2211.43,
    valoreScattoBiennale: 27.90,
    declaratoria: 'Lavoratori specializzati (operai specializzati, tecnici e impiegati di concetto) che guidano gruppi di lavoro o gestiscono impianti ad alta tecnologia con interpretazione schemi complessi.',
    esempiMansioniMetalmeccaniche: [
      'Capo linea cesoia/slitter ad alta velocita',
      'Manutentore meccatronico / PLC impianti siderurgici',
      'Tecnico metallurgico di laboratorio prove meccaniche',
      'Impiegato ufficio acquisti o programmazione della produzione'
    ],
    terminiMansioniSuperioriMesi: 3
  },
  {
    code: 'B1',
    exLevel: '5° Super',
    field: 'Ruolo Specialistico e Gestionale',
    monthlyBasePay: 2370.33,
    valoreScattoBiennale: 31.56,
    declaratoria: 'Lavoratori con approfondita competenza specialistica che operano con discrezionalita e autonomia nell ambito delle direttive generali, coordinando reparti o manutenzioni straordinarie.',
    esempiMansioniMetalmeccaniche: [
      'Capoturno produzione nastri e lamiere',
      'Responsabile manutenzione elettromeccanica di stabilimento',
      'Disegnatore/progettista cad-cam attrezzature di laminazione',
      'Responsabile spedizioni e magazzino coils'
    ],
    terminiMansioniSuperioriMesi: 6
  },
  {
    code: 'B2',
    exLevel: '6° Livello',
    field: 'Ruolo Specialistico e Gestionale',
    monthlyBasePay: 2542.98,
    valoreScattoBiennale: 35.46,
    declaratoria: 'Quadri o figure apicali tecniche e amministrative con funzioni di coordinamento, gestione progetti complessi, interfaccia clienti industriali e gestione budget operativi.',
    esempiMansioniMetalmeccaniche: [
      'Capo reparto produzione e finitura lamiere',
      'Responsabile controllo qualita e certificazioni ISO/EN stabilimento',
      'Responsabile acquisti materie prime (coils Arvedi)',
      'Ingegnere di processo laminazione'
    ],
    terminiMansioniSuperioriMesi: 6
  },
  {
    code: 'B3',
    exLevel: '7° Livello',
    field: 'Ruolo Specialistico e Gestionale',
    monthlyBasePay: 2838.99,
    valoreScattoBiennale: 39.72,
    declaratoria: 'Professionisti ad altissima specializzazione con responsabilita d area, autonomia strategica e direzione di progetti trasversali aziendali.',
    esempiMansioniMetalmeccaniche: ['Responsabile ufficio tecnico centrale', 'Plant manager assistant'],
    terminiMansioniSuperioriMesi: 6
  },
  {
    code: 'A1',
    exLevel: '8° Livello (Quadri)',
    field: 'Ruolo Direttivo',
    monthlyBasePay: 2907.01,
    valoreScattoBiennale: 44.05,
    indennitaFunzioneQuadro: 72.30,
    declaratoria: 'Quadri con formale attribuzione della qualifica ai sensi della L. 190/1985, che svolgono con continuita funzioni di rilevante importanza ai fini dello sviluppo degli obiettivi aziendali.',
    esempiMansioniMetalmeccaniche: ['Direttore di stabilimento', 'Direttore operations'],
    terminiMansioniSuperioriMesi: 6
  }
];

export interface MaggiorazioneOraria {
  id: string;
  nome: string;
  percentuale: number;
  riferimentoCCNL: string;
  descrizione: string;
}

export const MAGGIORAZIONI_CCNL_METALMECCANICI: MaggiorazioneOraria[] = [
  {
    id: 'straord_feriale_diurno_2h',
    nome: 'Straordinario diurno feriale (prime 2 ore)',
    percentuale: 25,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Maggiorazione calcolata sulla quota oraria della retribuzione per le prime 2 ore oltre l orario contrattuale.'
  },
  {
    id: 'straord_feriale_diurno_oltre2h',
    nome: 'Straordinario diurno feriale (oltre le prime 2 ore)',
    percentuale: 30,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Applicabile a partire dalla 3ª ora giornaliera di straordinario.'
  },
  {
    id: 'straord_festivo_diurno',
    nome: 'Straordinario festivo diurno (o riposo settimanale)',
    percentuale: 50,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Lavoro prestato la domenica o nei giorni festivi infrasettimanali riconosciuti dalla legge.'
  },
  {
    id: 'straord_notturno_feriale',
    nome: 'Straordinario notturno feriale (dalle 22:00 alle 06:00)',
    percentuale: 50,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Lavoro straordinario prestato durante la fascia oraria notturna.'
  },
  {
    id: 'straord_notturno_festivo',
    nome: 'Straordinario notturno festivo',
    percentuale: 65,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Lavoro straordinario prestato in ore notturne durante una festivita o giornata di riposo settimanale.'
  },
  {
    id: 'turno_pomeriggio',
    nome: 'Maggiorazione 2° turno (pomeridiano avvicendato)',
    percentuale: 8,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Turno avvicendato pomeridiano (es. 14:00 - 22:00) per operai turnisti.'
  },
  {
    id: 'turno_notte_ordinario',
    nome: 'Maggiorazione 3° turno ordinario notturno avvicendato',
    percentuale: 30,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Titolo III',
    descrizione: 'Turno avvicendato notturno (es. 22:00 - 06:00) prestato nel normale orario programmato.'
  },
  {
    id: 'ciclo_continuo',
    nome: 'Maggiorazione turni a ciclo continuo (3x7 o 4x2)',
    percentuale: 20,
    riferimentoCCNL: 'Art. 7 Sez. Quarta Disciplina speciale turni',
    descrizione: 'Regime di turnazione a ciclo continuo con scorrimento festivo (da verificare con intese aziendali CSI).'
  }
];

export interface ComportoRegola {
  anzianitaAnni: string;
  comportoBreveMesi: number;
  comportoProlungatoMesi: number; // in caso di malattia grave continuativa o patologie salvavita
  conservazionePostoGiorni: number;
}

export const COMPORTO_CCNL_METALMECCANICI: ComportoRegola[] = [
  {
    anzianitaAnni: 'Fino a 3 anni compiuti',
    comportoBreveMesi: 6,
    comportoProlungatoMesi: 9,
    conservazionePostoGiorni: 183
  },
  {
    anzianitaAnni: 'Oltre 3 e fino a 6 anni',
    comportoBreveMesi: 9,
    comportoProlungatoMesi: 13.5,
    conservazionePostoGiorni: 274
  },
  {
    anzianitaAnni: 'Oltre 6 anni di servizio',
    comportoBreveMesi: 12,
    comportoProlungatoMesi: 18,
    conservazionePostoGiorni: 365
  }
];

export interface PreavvisoRegola {
  fasciaLivelli: string;
  livelliInclusi: string[];
  finoA5AnniOperai: string;
  da5A10AnniOperai: string;
  oltre10AnniOperai: string;
  finoA5AnniImpiegati: string;
  da5A10AnniImpiegati: string;
  oltre10AnniImpiegati: string;
  decorrenzaImpiegati: string;
  decorrenzaOperai: string;
  riferimentoCCNL: string;
}

export const PREAVVISO_CCNL_METALMECCANICI: PreavvisoRegola[] = [
  {
    fasciaLivelli: 'Livelli D1 e D2 (ex 1ª e 2ª-3ª cat.)',
    livelliInclusi: ['D1', 'D2'],
    finoA5AnniOperai: '10 giorni lavorativi',
    da5A10AnniOperai: '15 giorni lavorativi',
    oltre10AnniOperai: '20 giorni lavorativi',
    finoA5AnniImpiegati: '1 mese',
    da5A10AnniImpiegati: '1,5 mesi',
    oltre10AnniImpiegati: '2 mesi',
    decorrenzaImpiegati: 'Dal 1° o dal 16° giorno del mese',
    decorrenzaOperai: 'Dal giorno successivo alla comunicazione formale',
    riferimentoCCNL: 'Art. 1 Sez. Quarta Titolo VII CCNL Metalmeccanici'
  },
  {
    fasciaLivelli: 'Livelli C1, C2 e C3 (ex 3ª av., 4ª e 5ª cat.)',
    livelliInclusi: ['C1', 'C2', 'C3'],
    finoA5AnniOperai: '15 giorni lavorativi',
    da5A10AnniOperai: '20 giorni lavorativi',
    oltre10AnniOperai: '30 giorni lavorativi',
    finoA5AnniImpiegati: '1,5 mesi',
    da5A10AnniImpiegati: '2 mesi',
    oltre10AnniImpiegati: '2,5 mesi',
    decorrenzaImpiegati: 'Dal 1° o dal 16° giorno del mese',
    decorrenzaOperai: 'Dal giorno successivo alla comunicazione formale',
    riferimentoCCNL: 'Art. 1 Sez. Quarta Titolo VII CCNL Metalmeccanici'
  },
  {
    fasciaLivelli: 'Livelli B1, B2, B3 e A1 (ex 5ªS, 6ª, 7ª e Quadri)',
    livelliInclusi: ['B1', 'B2', 'B3', 'A1'],
    finoA5AnniOperai: '1 mese',
    da5A10AnniOperai: '1,5 mesi',
    oltre10AnniOperai: '2 mesi',
    finoA5AnniImpiegati: '2 mesi',
    da5A10AnniImpiegati: '3 mesi',
    oltre10AnniImpiegati: '4 mesi',
    decorrenzaImpiegati: 'Dal 1° o dal 16° giorno del mese',
    decorrenzaOperai: 'Dal giorno successivo alla comunicazione formale',
    riferimentoCCNL: 'Art. 1 Sez. Quarta Titolo VII CCNL Metalmeccanici'
  }
];

export const TFR_PARAMETRI_CCNL = {
  divisoreAnnuale: 13.5,
  contributoIvsLavoratore: 0.005, // 0.50% ex L. 297/82
  tassoFissoRivalutazione: 0.015, // 1.50%
  percentualeInflazioneFoi: 0.75, // 75%
  mensilitaCCNL: 13, // 13 mensilità contrattuali
  riferimentoLegge: 'Art. 2120 Codice Civile e Legge 29 maggio 1982 n. 297'
};

export const FLEXIBLE_BENEFITS_CCNL = {
  importoAnnuo: 200.00,
  decorrenza: '1° giugno di ciascun anno contrattuale',
  termineUtilizzo: '31 maggio dell\'anno successivo',
  beneficiari: 'Tutti i lavoratori dipendenti a tempo indeterminato e a termine con almeno 3 mesi di anzianità maturati nell\'anno',
  riferimentoCCNL: 'Art. 17 Sez. Quarta Titolo IV CCNL Metalmeccanici Industria',
  naturaFiscale: 'Piattaforma welfare, buoni spesa, istruzione, sanità o previdenza complementare (esente IRPEF e contributi INPS ex art. 51 TUIR)'
};

export const ELEMENTO_PEREQUATIVO_CCNL = {
  importoAnnuo: 485.00,
  erogazioneMese: 'Cedolino di Giugno di ciascun anno',
  riferimentoCCNL: 'Art. 13 Sez. Quarta Titolo IV CCNL Metalmeccanici Industria',
  condizioniSpettanza: 'Spetta ai lavoratori in forza al 1° giugno presso aziende prive di contrattazione aziendale di secondo livello (nessun premio di risultato/produzione) e che non percepiscono superminimi individuali o collettivi assorbibili.',
  riproporzionamento: 'Riproprozionato in dodicesimi in base ai mesi di effettivo servizio prestati nell\'anno solare precedente e calcolato pro quota per i contratti part-time.'
};

export const REGOLE_STRAORDINARIO_SOGLIE = {
  maggiorazioneSuperamentoSoglia48h: 8, // Incremento ulteriore +8% per ore oltre le 48h settimanali o soglie contrattuali
  limiteMassimoAnnuoOre: 200, // Limite contrattuale massimo annuo pro capite
  riposoCompensativoBancaOre: true
};

