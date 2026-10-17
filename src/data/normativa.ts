export interface NormativaItem {
  id: string;
  titolo: string;
  enteUfficiale: string;
  urlVerificato: string;
  articoloSezione: string;
  decorrenza: string;
  ultimaVerifica: string;
  statoVerifica: 'Vigente e verificato' | 'In aggiornamento' | 'Da verificare in sede aziendale';
  riassunto: string;
  testoPertinente: string;
  paroleChiave: string[];
}

export const NORMATIVA_DATABASE: NormativaItem[] = [
  {
    id: 'cost-1-35-36',
    titolo: 'Costituzione della Repubblica Italiana - Artt. 1, 35, 36, 39, 40',
    enteUfficiale: 'Quirinale / Senato della Repubblica',
    urlVerificato: 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali',
    articoloSezione: 'Articoli 1, 35, 36, 39, 40',
    decorrenza: '01/01/1948',
    ultimaVerifica: '15/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Fondamento della Repubblica sul lavoro, tutela del lavoro in tutte le sue forme, diritto a retribuzione proporzionata e sufficiente, libertà di organizzazione sindacale e diritto di sciopero.',
    testoPertinente: 'Art. 36: Il lavoratore ha diritto ad una retribuzione proporzionata alla quantita e qualita del suo lavoro e in ogni caso sufficiente ad assicurare a se e alla famiglia un esistenza libera e dignitosa. La durata massima della giornata lavorativa e stabilita dalla legge. Il lavoratore ha diritto al riposo settimanale e a ferie annuali retribuite, e non puo rinunziarvi. Art. 39: L organizzazione sindacale e libera. Art. 40: Il diritto di sciopero si esercita nell ambito delle leggi che lo regolano.',
    paroleChiave: ['Costituzione', 'Retribuzione sufficiente', 'Ferie irrinunciabili', 'Libertà sindacale', 'Diritto di sciopero']
  },
  {
    id: 'l-300-1970-art7',
    titolo: 'Legge 20 maggio 1970, n. 300 - Statuto dei Lavoratori (Art. 7 Sanzioni Disciplinari)',
    enteUfficiale: 'Normattiva / Gazzetta Ufficiale n. 131 del 27/05/1970',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1970-05-20;300!vig=',
    articoloSezione: 'Articolo 7 (Sanzioni disciplinari)',
    decorrenza: '11/06/1970',
    ultimaVerifica: '10/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Regola la contestazione di addebito, la tempestività, la specificità dei fatti, il termine minimo perentorio a difesa del lavoratore (almeno 5 giorni prima di qualsiasi sanzione) e l assistenza sindacale.',
    testoPertinente: 'Il datore di lavoro non puo adottare alcun provvedimento disciplinare nei confronti del lavoratore senza avergli preventivamente contestato l addebito e senza averlo sentito a sua difesa. Il lavoratore puo farsi assistere da un rappresentante dell associazione sindacale cui aderisce o conferisce mandato. Non possono essere disposte sanzioni disciplinari prima che siano trascorsi cinque giorni dalla contestazione per iscritto del fatto.',
    paroleChiave: ['Art. 7', 'Statuto Lavoratori', 'Contestazione disciplinare', '5 giorni', 'Diritto di difesa', 'Assistenza sindacale']
  },
  {
    id: 'l-300-1970-rsu-rsa',
    titolo: 'Legge 20 maggio 1970, n. 300 - Titolo III Attività Sindacale (Artt. 19-28)',
    enteUfficiale: 'Normattiva',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1970-05-20;300!vig=',
    articoloSezione: 'Articoli 19, 20, 21, 23, 24, 25, 28',
    decorrenza: '11/06/1970',
    ultimaVerifica: '10/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Diritto di assemblea (10 ore annue retribuite), referendum, permessi retribuiti e non retribuiti per dirigenti RSA/RSU, bacheca sindacale (art. 25) e repressione della condotta antisindacale con ricorso d urgenza (art. 28).',
    testoPertinente: 'Art. 20: I lavoratori hanno diritto di riunirsi, nella unita produttiva in cui prestano la loro opera, fuori dell orario di lavoro, nonche nei limiti di dieci ore annue durante l orario di lavoro, per le quali verra corrisposta la normale retribuzione. Art. 28: Qualora il datore di lavoro ponga in essere comportamenti diretti ad impedire o limitare l esercizio della liberta e della attivita sindacale nonche del diritto di sciopero, il giudice del lavoro ordina la cessazione del comportamento illegittimo.',
    paroleChiave: ['Assemblea', 'Bacheca sindacale', 'Permessi RSU', 'Condotta antisindacale', 'Art. 28']
  },
  {
    id: 'dlgs-81-2008-rls',
    titolo: 'D.Lgs. 9 aprile 2008, n. 81 - Tutela della salute e della sicurezza nei luoghi di lavoro',
    enteUfficiale: 'Ministero del Lavoro / INAIL / Normattiva',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2008-04-09;81',
    articoloSezione: 'Articoli 47, 48, 50 (RLS - Rappresentante dei Lavoratori per la Sicurezza)',
    decorrenza: '15/05/2008 (con s.m.i.)',
    ultimaVerifica: '20/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Attribuzioni dell RLS: accesso agli ambienti di lavoro, consultazione preventiva e tempestiva sul DVR e designazione addetti emergenza, ricezione delle informazioni e formazione specifica (min. 32 ore), facoltà di ricorso alle autorità competenti (ASL/INAIL).',
    testoPertinente: 'Art. 50 c. 1: L RLS: a) accede ai luoghi di lavoro in cui si svolgono le lavorazioni; b) e consultato preventivamente e tempestivamente in ordine alla valutazione dei rischi...; c) e consultato sulla designazione del RSPP e addetti antincendio/primo soccorso; e) riceve le informazioni e la documentazione aziendale inerente alla valutazione dei rischi; o) puo fare ricorso alle autorita competenti qualora ritenga che le misure di prevenzione e protezione siano inidonee.',
    paroleChiave: ['D.Lgs 81/08', 'RLS', 'DVR', 'Valutazione Rischi', 'Salute e Sicurezza', 'Sopralluoghi', 'Filtri aspirazione', 'DPI']
  },
  {
    id: 'dlgs-66-2003-orario',
    titolo: 'D.Lgs. 8 aprile 2003, n. 66 - Attuazione delle direttive UE su organizzazione orario di lavoro',
    enteUfficiale: 'Normattiva / Gazzetta Ufficiale n. 87 del 14/04/2003',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-04-08;66',
    articoloSezione: 'Articoli 3, 4, 7, 8, 9, 10, 11 (Orario normale, straordinario, riposo giornaliero, pause, ferie)',
    decorrenza: '29/04/2003 (con s.m.i.)',
    ultimaVerifica: '12/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Orario normale 40h/settimana, limite massimo medio 48h con straordinari, diritto irrinunciabile a 11 ore consecutive di riposo ogni 24 ore, pausa di almeno 10 minuti per turni superiori a 6 ore, riposo settimanale di 24 ore consecutive ogni 7 giorni.',
    testoPertinente: 'Art. 7: Il lavoratore ha diritto a undici ore di riposo consecutivo ogni ventiquattro ore. Art. 8: Qualora l orario di lavoro giornaliero ecceda il limite di sei ore il lavoratore deve beneficiare di un intervallo per pausa. Art. 10: Il prestatore di lavoro ha diritto ad un periodo annuale di ferie retribuite non inferiore a quattro settimane.',
    paroleChiave: ['Orario di lavoro', '11 ore riposo', 'Turni a ciclo continuo', 'Straordinari', 'Pausa mensa', 'Ferie 4 settimane']
  },
  {
    id: 'cc-2103-mansioni',
    titolo: 'Codice Civile - Articolo 2103 (Prestazione del lavoro e variazione di mansioni)',
    enteUfficiale: 'Normattiva - Regio Decreto 16 marzo 1942, n. 262 (aggiornato dal D.Lgs. 81/2015)',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:regio.decreto:1942-03-16;262:art2103',
    articoloSezione: 'Art. 2103 c.c.',
    decorrenza: '25/06/2015 (Riforma D.Lgs. 81/2015)',
    ultimaVerifica: '10/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Diritto all inquadramento corrispondente alle mansioni svolte. Assegnazione a mansioni superiori: diritto al trattamento economico corrispondente e acquisizione definitiva del livello superiore dopo il periodo fissato dal CCNL (o max 6 mesi continuativi).',
    testoPertinente: 'Nel caso di assegnazione a mansioni superiori il lavoratore ha diritto al trattamento corrispondente all attivita svolta e l assegnazione diviene definitiva, salva diversa volonta del lavoratore, ove la medesima non abbia avuto luogo per ragioni di sostituzione di altro lavoratore in servizio, dopo il periodo fissato dai contratti collettivi o, in mancanza, dopo sei mesi continuativi.',
    paroleChiave: ['Art. 2103 cc', 'Mansioni superiori', 'Passaggio di livello', 'Demansionamento', 'Inquadramento contrattuale']
  },
  {
    id: 'dlgs-104-2022-trasparenza',
    titolo: 'D.Lgs. 27 giugno 2022, n. 104 - Trasparenza condizioni di lavoro (Decreto Trasparenza)',
    enteUfficiale: 'Ministero del Lavoro / Gazzetta Ufficiale n. 176 del 29/07/2022',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2022-06-27;104',
    articoloSezione: 'Articoli 1, 3, 4',
    decorrenza: '13/08/2022 (con chiarimenti Circ. Min. Lavoro 19/2022 e Circ. 4/2023)',
    ultimaVerifica: '15/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Obbligo del datore di comunicare per iscritto: CCNL e contratti aziendali applicati, inquadramento e livello, durata prova, orario programmato, condizioni dello straordinario e turni.',
    testoPertinente: 'Il datore di lavoro e tenuto a comunicare al lavoratore in modo trasparente e chiaro le informazioni relative al rapporto di lavoro, compreso il contratto collettivo applicato al rapporto di lavoro, con l indicazione delle parti che lo hanno sottoscritto.',
    paroleChiave: ['Decreto Trasparenza', 'CCNL applicato', 'Accordo integrativo', 'Condizioni di lavoro', 'Lettera assunzione']
  },
  {
    id: 'l-104-1992-permessi',
    titolo: 'Legge 5 febbraio 1992, n. 104 - Assistenza, integrazione sociale e diritti delle persone handicappate',
    enteUfficiale: 'INPS / Normattiva',
    urlVerificato: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1992-02-05;104',
    articoloSezione: 'Articolo 33 (Agevolazioni e permessi retribuiti)',
    decorrenza: '18/02/1992 (aggiornato dal D.Lgs. 105/2022)',
    ultimaVerifica: '08/01/2026',
    statoVerifica: 'Vigente e verificato',
    riassunto: 'Diritto a 3 giorni di permesso mensile retribuito (frazionabili a ore) per assistenza a familiare con disabilità in situazione di gravità, eliminazione del referente unico.',
    testoPertinente: 'Il lavoratore dipendente ha diritto a fruire di tre giorni di permesso mensile retribuito coperto da contribuzione figurativa per assistere una persona con disabilita in situazione di gravita. Il lavoratore non puo essere trasferito senza il suo consenso ad altra sede.',
    paroleChiave: ['Legge 104', 'Permessi disabilità', 'Frazionamento ore', 'Tutela caregiver', 'Divieto trasferimento']
  }
];
