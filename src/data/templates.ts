export interface DocumentTemplate {
  id: string;
  titolo: string;
  categoria: 'disciplinare' | 'inquadramento' | 'relazioni_sindacali' | 'sicurezza_rls' | 'trasparenza' | 'verbali';
  destinatario: string;
  descrizione: string;
  campiRichiesti: {
    nome: string;
    chiave: string;
    tipo: 'testo' | 'data' | 'textarea' | 'numero';
    placeholder: string;
    valoreDefault: string;
  }[];
  corpoTesto: string; // contiene placeholder {{chiave}}
  normativaRiferimento: string;
  avvertenzaSindacale: string;
}

export const UNION_DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tmpl-risposta-disciplinare',
    titolo: 'Lettera di giustificazioni e richiesta audizione assistita (Art. 7 L. 300/1970)',
    categoria: 'disciplinare',
    destinatario: 'Alla Direzione Aziendale CSI S.r.l. - Stabilimento di Colombella (PG)',
    descrizione: 'Risposta formale a contestazione disciplinare entro il termine perentorio di 5 giorni, con contestazione dei fatti e richiesta di incontro con delegato sindacale FIOM-CGIL.',
    normativaRiferimento: 'Art. 7 Legge 300/1970 e Art. 9 Sez. Quarta Titolo V CCNL Metalmeccanici Industria',
    avvertenzaSindacale: 'ATTENZIONE: La presente risposta deve pervenire all azienda ENTRO 5 GIORNI di calendario dalla ricezione della contestazione (o diverso maggior termine previsto). Farsi rilasciare copia firmata per ricevuta o inviare a mezzo PEC/Raccomandata.',
    campiRichiesti: [
      { nome: 'Nome e Cognome Lavoratore', chiave: 'nomeLavoratore', tipo: 'testo', placeholder: 'es. Mario Rossi', valoreDefault: '' },
      { nome: 'Reparto / Linea', chiave: 'reparto', tipo: 'testo', placeholder: 'es. Taglio Nastri Slitter', valoreDefault: 'Reparto Nastri e Lamiere' },
      { nome: 'Data Ricezione Lettera di Addebito', chiave: 'dataRicezione', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' },
      { nome: 'Protocollo/Riferimento Lettera Aziendale', chiave: 'protocolloLettera', tipo: 'testo', placeholder: 'es. Racc. a mano del 10/02/2026', valoreDefault: 'Lettera di contestazione del ' },
      { nome: 'Sintesi dei Fatti e Giustificazioni', chiave: 'giustificazioni', tipo: 'textarea', placeholder: 'Descrivere dettagliatamente come si sono svolti realmente i fatti, orari, testimoni, assenza di dolo o colpa...', valoreDefault: 'In merito all episodio contestato, rappresento che i fatti si sono svolti in modo del tutto differente da quanto sommariamente addebitato...' },
      { nome: 'Delegato FIOM che assisterà al colloquio', chiave: 'nomeDelegato', tipo: 'testo', placeholder: 'es. Mario Rossi (RSU FIOM-CGIL)', valoreDefault: 'dal delegato della RSU / Rappresentante Territoriale FIOM-CGIL Perugia' }
    ],
    corpoTesto: `Spett.le Direzione Aziendale
CSI S.r.l. - Gruppo Arvedi
Stabilimento di Colombella (PG)
Ufficio Risorse Umane e Relazioni Industriali

Oggetto: Riscontro e giustificazioni a contestazione disciplinare del {{dataRicezione}} (Rif: {{protocolloLettera}}) - Esercizio facoltà ex art. 7 L. 300/1970 e CCNL Metalmeccanici Industria.

Il/La sottoscritto/a {{nomeLavoratore}}, dipendente in forza presso codesto stabilimento di Colombella, inquadrato/a nel reparto {{reparto}};

PREMESSO CHE
- In data {{dataRicezione}} ha ricevuto formale comunicazione di contestazione disciplinare con la quale gli/le vengono addebitati presunti inadempimenti;
- Ai sensi e per gli effetti dell'art. 7 della Legge 20 maggio 1970 n. 300 (Statuto dei Lavoratori) e dell'art. 9 della Sezione Quarta del CCNL Metalmeccanici Industria, il lavoratore ha pieno diritto di rendere le proprie deduzioni a difesa e di essere sentito personalmente;

TUTTO CIÒ PREMESSO, FORMALMENTE RAPPRESENTA E GIUSTIFICA:
{{giustificazioni}}

I fatti sopra esposti dimostrano la totale insussistenza di negligenza o violazione dei doveri contrattuali da parte dello scrivente.

In ogni caso, a maggior chiarimento e a tutela delle proprie ragioni, ai sensi dell'art. 7, comma 2, L. 300/1970, lo scrivente

CHIEDE ESPRESSAMENTE DI ESSERE SENTITO/A A PROPRIA DIFESA
con l'assistenza di {{nomeDelegato}}, riservandosi in tale sede di produrre ulteriore documentazione probatoria e dichiarazioni testimoniali.

Si confida pertanto nella tempestiva archiviazione della procedura senza adozione di alcun provvedimento disciplinare.

Distinti saluti.

Data: ____________________
Firma del Lavoratore: ____________________________________

Per ricevuta e contestuale presa d'atto da parte dell'Azienda:
Firma e Timbro CSI S.r.l.: ________________________________`
  },
  {
    id: 'tmpl-richiesta-mansioni',
    titolo: 'Richiesta formale di verifica inquadramento e mansioni superiori (Art. 2103 c.c.)',
    categoria: 'inquadramento',
    destinatario: 'Alla Direzione Aziendale CSI S.r.l. - Colombella (PG)',
    descrizione: 'Istanza del lavoratore assistito dalla FIOM per la rideterminazione del livello contrattuale sulla base delle mansioni effettivamente svolte.',
    normativaRiferimento: 'Art. 2103 Codice Civile e declaratorie professionali CCNL Metalmeccanici Industria',
    avvertenzaSindacale: 'Prima dell invio, verificare accuratamente la declaratoria contrattuale del livello superiore e raccogliere ordini di lavoro, timbrature e ordini di produzione a supporto.',
    campiRichiesti: [
      { nome: 'Nome Lavoratore', chiave: 'nomeLavoratore', tipo: 'testo', placeholder: 'Nome e Cognome', valoreDefault: '' },
      { nome: 'Livello Attuale', chiave: 'livelloAttuale', tipo: 'testo', placeholder: 'es. Livello D2 (ex 3°)', valoreDefault: 'Livello D2' },
      { nome: 'Livello Superiore Rivendicato', chiave: 'livelloRivendicato', tipo: 'testo', placeholder: 'es. Livello C2 o C3', valoreDefault: 'Livello C2' },
      { nome: 'Data Inizio Svolgimento Mansioni Superiori', chiave: 'dataInizio', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' },
      { nome: 'Elenco Dettagliato Attività e Responsabilità Superiori', chiave: 'elencoAttivita', tipo: 'textarea', placeholder: 'es. programmazione autonoma slitter, cambio lame, diagnosi allarmi, coordinamento addetti imballo...', valoreDefault: 'Conduzione e regolazione autonoma delle linee di taglio, controllo tolleranze dimensionali, interventi di riparazione di prima linea e gestione dei parametri di processo...' }
    ],
    corpoTesto: `Spett.le Direzione Aziendale
CSI S.r.l.
Stabilimento di Colombella (Perugia)

Oggetto: Richiesta di verifica inquadramento professionale e riconoscimento livello superiore ex art. 2103 Codice Civile e CCNL Metalmeccanici Industria.

Il/La sottoscritto/a {{nomeLavoratore}}, dipendente con qualifica contrattuale attualmente inquadrata al {{livelloAttuale}};

ESPONE QUANTO SEGUE:
1. Sin dalla data del {{dataInizio}}, lo scrivente e stato adibito con carattere di continuita e prevalenza a mansioni notevolmente piu complesse e di maggior rilievo rispetto alla declaratoria del livello attualmente riconosciuto.
2. Nello specifico, le mansioni ordinarie svolte consistono in:
{{elencoAttivita}}
3. Tali mansioni integrano pienamente i requisiti di perizia, autonomia operativa e responsabilita tecnica previsti dalla declaratoria del {{livelloRivendicato}} del vigente CCNL Metalmeccanici Industria.
4. Essendo ampiamente decorsi i termini previsti dall'art. 2103 c.c. e dal CCNL per il consolidamento automatico del livello superiore;

CHIEDE
il formale inquadramento al {{livelloRivendicato}} del CCNL Metalmeccanici Industria con decorrenza retroattiva dal maturato e la corresponsione delle relative differenze retributive maturate, sia sui minimi tabellari che sui riflessi di legge e di contratto.

In attesa di un positivo e sollecito riscontro, si riserva ogni ulteriore tutela in sede sindacale e giudiziale con il patrocinio della FIOM-CGIL Perugia.

Distinti saluti.

Data: ____________________
Firma del Lavoratore: ____________________________________`
  },
  {
    id: 'tmpl-segnalazione-rls',
    titolo: 'Segnalazione formale criticità salute e sicurezza RLS (Art. 50 D.Lgs. 81/2008)',
    categoria: 'sicurezza_rls',
    destinatario: 'Al Datore di Lavoro, al RSPP e al Medico Competente CSI S.r.l. Colombella',
    descrizione: 'Comunicazione ufficiale del Rappresentante dei Lavoratori per la Sicurezza per segnalare rischi, mancata manutenzione o pericolo negli ambienti di lavoro.',
    normativaRiferimento: 'Artt. 18, 28, 35 e 50 D.Lgs. 9 aprile 2008 n. 81 e s.m.i.',
    avvertenzaSindacale: 'Se la criticità comporta pericolo grave e immediato, richiedere l immediata sospensione delle lavorazioni o l isolamento dell area e informare subito le autorità se l azienda non interviene.',
    campiRichiesti: [
      { nome: 'Nome RLS Segnalante', chiave: 'nomeRls', tipo: 'testo', placeholder: 'Nome RLS', valoreDefault: 'Franco Vitali (RLS FIOM-CGIL)' },
      { nome: 'Reparto Interessato', chiave: 'reparto', tipo: 'testo', placeholder: 'es. Linea Spianatura / Impianto Aspirazione', valoreDefault: 'Reparto Produzione Lamiere' },
      { nome: 'Descrizione Rischio / Pericolo Rilevato', chiave: 'descrizioneRischio', tipo: 'textarea', placeholder: 'Descrivere il difetto, malfunzionamento, assenza DPI, nebbie, rumore...', valoreDefault: 'Si riscontra grave inefficienza dei filtri di captazione fumi/nebbie oleose e polveri metalliche, nonche usura dei ripari di protezione...' },
      { nome: 'Misure Correttive Richieste', chiave: 'misureRichieste', tipo: 'textarea', placeholder: 'Intervento manutentivo immediato, sostituzione filtri, fornitura DPI idonei...', valoreDefault: '1. Immediata ispezione e bonifica impianto di estrazione fumi; 2. Convocazione urgente di incontro tecnico con RSPP e Medico Competente; 3. Aggiornamento della scheda del DVR.' }
    ],
    corpoTesto: `Al Datore di Lavoro di CSI S.r.l. - Stabilimento di Colombella
Al Responsabile del Servizio di Prevenzione e Protezione (RSPP)
Al Medico Competente
e p.c. Alla RSU di Stabilimento / FIOM-CGIL Perugia

Oggetto: Segnalazione formale criticità salute e sicurezza ex art. 50 c. 1 lett. b), d), m) D.Lgs. 81/2008 - Reparto {{reparto}}.

Il sottoscritto {{nomeRls}}, nella sua qualita di Rappresentante dei Lavoratori per la Sicurezza (RLS) debitamente eletto, nell'esercizio delle prerogative di cui al D.Lgs. 81/2008;

SEGNALA FORMALMENTE QUANTO SEGUE:
Nel corso dei sopralluoghi svolti e a seguito di motivate e ripetute segnalazioni pervenute dalle maestranze del reparto {{reparto}}, e emersa una condizione di potenziale rischio per l'integrita psico-fisica dei lavoratori:
{{descrizioneRischio}}

CONSIDERATO CHE
- Il Datore di Lavoro e i Dirigenti hanno l'obbligo giuridico inderogabile (art. 18 D.Lgs. 81/08) di garantire ambienti salubri, manutenzione periodica degli impianti e dispositivi di protezione;
- Ai sensi dell'art. 50 c. 1 lett. m) D.Lgs. 81/08, il RLS promuove l'elaborazione, l'individuazione e l'attuazione delle misure di prevenzione idonee;

RICHIEDE CON URGENZA:
{{misureRichieste}}

Si richiede formale riscontro scritto entro e non oltre 5 giorni lavorativi, riservandosi in difetto di attivare le facolta di cui all'art. 50 c. 1 lett. o) D.Lgs. 81/2008 (segnalazione all'Organo di Vigilanza ASL Umbria 1 e INAIL).

Colombella, lì ____________________
Firma del Rappresentante dei Lavoratori per la Sicurezza (RLS):
____________________________________________________`
  },
  {
    id: 'tmpl-richiesta-incontro-rsu',
    titolo: 'Richiesta incontro urgente RSU/RSA con Direzione Aziendale CSI',
    categoria: 'relazioni_sindacali',
    destinatario: 'Alla Direzione Aziendale CSI S.r.l. - Colombella',
    descrizione: 'Convocazione formale di incontro bilaterale per trattazione straordinari, carichi di lavoro, organizzazione turni e accordo integrativo.',
    normativaRiferimento: 'Accordo Interconfederale RSU e Sezione Prima CCNL Metalmeccanici Industria',
    avvertenzaSindacale: 'Specificare l ordine del giorno per vincolare l azienda alla discussione formale.',
    campiRichiesti: [
      { nome: 'Oggetto e Materie da Trattare', chiave: 'ordineGiorno', tipo: 'textarea', placeholder: 'es. 1. Andamento turni a ciclo continuo; 2. Sicurezza linee taglio; 3. Ricerca accordi integrativi storici', valoreDefault: '1. Verifica applicazione turni e rispetto pause fisiologiche;\n2. Carichi di lavoro e straordinari comandati nel reparto cesoie;\n3. Trasparenza sulle condizioni contrattuali dei lavoratori somministrati;\n4. Ricognizione dell accordo integrativo aziendale di stabilimento.' },
      { nome: 'Data proposta per l incontro', chiave: 'dataProposta', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' }
    ],
    corpoTesto: `Spett.le Direzione Aziendale
CSI S.r.l.
Stabilimento di Colombella (Perugia)

Oggetto: Richiesta urgente di incontro sindacale tra Direzione Aziendale e Rappresentanza Sindacale Unitaria (RSU / RSA FIOM-CGIL).

La RSU / RSA FIOM-CGIL dello stabilimento di Colombella richiede formale e tempestiva convocazione per esaminare congiuntamente le seguenti materie d'urgenza:

ORDINE DEL GIORNO:
{{ordineGiorno}}

Al fine di garantire il corretto svolgimento delle relazioni sindacali e la tempestiva risoluzione delle criticita segnalate dai lavoratori, si propone che l'incontro abbia luogo in data {{dataProposta}} o comunque entro e non oltre 7 giorni dalla ricezione della presente.

Si resta in attesa di conferma scritta.

Colombella, lì ____________________
La RSU / RSA FIOM-CGIL CSI Colombella:
____________________________________________________`
  },
  {
    id: 'tmpl-convocazione-assemblea',
    titolo: 'Convocazione assemblea retribuita dei lavoratori (Art. 20 L. 300/1970)',
    categoria: 'relazioni_sindacali',
    destinatario: 'Alla Direzione Aziendale CSI S.r.l. e a tutti i lavoratori',
    descrizione: 'Indizione formale di assemblea sindacale retribuita (monte ore 10 ore annue) all\'interno dello stabilimento con preavviso contrattuale.',
    normativaRiferimento: 'Art. 20 Legge 300/1970 e Art. 2 Sez. Prima CCNL Metalmeccanici Industria',
    avvertenzaSindacale: 'La comunicazione all\'azienda deve essere inviata nel rispetto del termine di preavviso previsto dal CCNL (di norma almeno 48 o 72 ore prima salvo casi urgenti).',
    campiRichiesti: [
      { nome: 'Data Assemblea', chiave: 'dataAssemblea', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' },
      { nome: 'Orario di Svolgimento', chiave: 'orarioAssemblea', tipo: 'testo', placeholder: 'es. dalle 14:00 alle 16:00 (fine 1° turno / inizio 2°)', valoreDefault: 'dalle ore 14:00 alle ore 16:00' },
      { nome: 'Locale / Spazio Richiesto', chiave: 'localeAssemblea', tipo: 'testo', placeholder: 'es. Sala Mensa Stabilimento Colombella', valoreDefault: 'Sala Mensa aziendale' },
      { nome: 'Ordine del Giorno', chiave: 'ordineGiorno', tipo: 'textarea', placeholder: 'Elenco argomenti da discutere...', valoreDefault: '1. Andamento produttivo e carichi di lavoro;\n2. Verifica applicazione maggiorazioni straordinari e turni;\n3. Piattaforma per il rinnovo contrattuale e tesseramento FIOM-CGIL.' },
      { nome: 'Eventuali Dirigenti Esterni FIOM', chiave: 'dirigentiEsterni', tipo: 'testo', placeholder: 'Nome e carica sindacale', valoreDefault: 'Dirigente della FIOM-CGIL Territoriale di Perugia' }
    ],
    corpoTesto: `Spett.le Direzione Aziendale
CSI S.r.l. - Stabilimento di Colombella (PG)
e p.c. A tutte le Lavoratrici e i Lavoratori

Oggetto: Indizione di assemblea sindacale retribuita ex art. 20 Legge 300/1970 e CCNL Metalmeccanici Industria.

La scrivente Rappresentanza Sindacale (RSU / RSA FIOM-CGIL), nell'esercizio dei diritti garantiti dallo Statuto dei Lavoratori;

COMUNICA
che per il giorno {{dataAssemblea}}, {{orarioAssemblea}}, e indetta un'assemblea retribuita di tutto il personale dipendente presso {{localeAssemblea}}, con il seguente:

ORDINE DEL GIORNO:
{{ordineGiorno}}

All'assemblea partecipera, ai sensi dell'art. 20 c. 3 L. 300/1970, {{dirigentiEsterni}}.
Si richiede alla Direzione Aziendale di predisporre i locali idonei e di assicurare l'agibilita dell'accesso per i partecipanti.

Colombella, lì ____________________
Per la RSU / RSA FIOM-CGIL:
____________________________________________________`
  },
  {
    id: 'tmpl-richiesta-bacheca-locale',
    titolo: 'Richiesta bacheca sindacale e locale RSU/RSA (Artt. 25 e 27 L. 300/1970)',
    categoria: 'relazioni_sindacali',
    destinatario: 'Alla Direzione Aziendale CSI S.r.l.',
    descrizione: 'Istanza formale per l\'assegnazione di apposito spazio per affissione comunicati e di locale permanente idoneo all\'esercizio dell\'attività sindacale.',
    normativaRiferimento: 'Artt. 25 e 27 Legge 20 maggio 1970 n. 300 e CCNL Metalmeccanici',
    avvertenzaSindacale: 'Nelle unita produttive con oltre 200 dipendenti il datore ha l\'obbligo di mettere a disposizione permanente un locale comune idoneo; sotto i 200 dipendenti, su richiesta, per le riunioni.',
    campiRichiesti: [
      { nome: 'Posizione Bacheca Richiesta', chiave: 'ubicazioneBacheca', tipo: 'testo', placeholder: 'es. Ingresso spogliatoi / corridoio timbratrici', valoreDefault: 'Ingresso spogliatoi e zona timbratrici' },
      { nome: 'Locale Richiesto', chiave: 'dettagliLocale', tipo: 'textarea', placeholder: 'Specificare esigenze operative...', valoreDefault: 'Locale idoneo dotato di tavolo, sedie e punto rete/elettrico per le riunioni della rappresentanza e il ricevimento dei lavoratori.' }
    ],
    corpoTesto: `Spett.le Direzione Aziendale
CSI S.r.l. - Stabilimento di Colombella

Oggetto: Esercizio diritti di affissione (Art. 25 L. 300/1970) e richiesta locale per la rappresentanza sindacale (Art. 27 L. 300/1970).

La scrivente Rappresentanza Sindacale (RSU / RSA FIOM-CGIL);

RICHIAMA
- L'art. 25 della Legge 300/1970, il quale sancisce il diritto inderogabile delle rappresentanze sindacali aziendali di affiggere, su appositi spazi che il datore di lavoro ha l'obbligo di predisporre in luoghi accessibili a tutti i lavoratori all'interno dell'unita produttiva, pubblicazioni, testi e comunicati inerenti a materie di interesse sindacale e del lavoro;
- L'art. 27 della medesima legge in ordine alla messa a disposizione di idoneo locale comune per l'esercizio delle funzioni sindacali;

RICHIEDE FORMALMENTE:
1. L'installazione di una bacheca sindacale protetta ad uso esclusivo della FIOM-CGIL presso {{ubicazioneBacheca}};
2. L'individuazione del locale aziendale destinato all'attivita della RSU: {{dettagliLocale}}.

Si resta in attesa di formale comunicazione circa la messa a disposizione degli spazi entro 7 giorni.

Colombella, lì ____________________
Per la RSU / RSA FIOM-CGIL:
____________________________________________________`
  },
  {
    id: 'tmpl-permessi-sindacali',
    titolo: 'Richiesta fruizione permessi sindacali retribuiti (Art. 23 L. 300/1970)',
    categoria: 'relazioni_sindacali',
    destinatario: 'All\'Ufficio Personale CSI S.r.l.',
    descrizione: 'Comunicazione preventiva di assentarsi per lo svolgimento del mandato sindacale nel rispetto del monte ore contrattuale.',
    normativaRiferimento: 'Art. 23 Legge 300/1970 e Sezione Prima CCNL Metalmeccanici Industria',
    avvertenzaSindacale: 'La comunicazione deve essere data per iscritto di norma con almeno 24 ore di anticipo alla Direzione aziendale.',
    campiRichiesti: [
      { nome: 'Nome Componente RSU/RSA', chiave: 'nomeDelegato', tipo: 'testo', placeholder: 'Nome e Cognome delegato', valoreDefault: '' },
      { nome: 'Giorno del Permesso', chiave: 'dataPermesso', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' },
      { nome: 'Orario di Inizio e Fine', chiave: 'orarioPermesso', tipo: 'testo', placeholder: 'es. dalle 10:00 alle 14:00 (4 ore)', valoreDefault: 'dalle ore 10:00 alle ore 14:00' },
      { nome: 'Motivazione Generale', chiave: 'motivazione', tipo: 'testo', placeholder: 'es. Espletamento del mandato sindacale', valoreDefault: 'Espletamento del mandato sindacale e assistenza alle maestranze' }
    ],
    corpoTesto: `Spett.le Ufficio Personale
CSI S.r.l. - Stabilimento di Colombella

Oggetto: Fruizione permesso sindacale retribuito ex art. 23 Legge 300/1970 e CCNL Metalmeccanici Industria.

Il/La sottoscritto/a {{nomeDelegato}}, in qualita di componente della RSU / dirigente RSA FIOM-CGIL;

COMUNICA
che nella giornata del {{dataPermesso}}, {{orarioPermesso}}, usufruira di un permesso sindacale retribuito a carico del monte ore spettante per:
{{motivazione}}.

La presente e inoltrata nel pieno rispetto del preavviso contrattuale.

Colombella, lì ____________________
Firma del Delegato Sindacale:
____________________________________________________`
  },
  {
    id: 'tmpl-impugnazione-sanzione',
    titolo: 'Impugnazione formale sanzione disciplinare ex Art. 7 L. 300/1970',
    categoria: 'disciplinare',
    destinatario: 'All\'Ispettorato Territoriale del Lavoro di Perugia e a CSI S.r.l.',
    descrizione: 'Ricorso per la costituzione del collegio di conciliazione e arbitrato ex art. 7 c. 6 L. 300/70 con immediata sospensione cautelare della sanzione irrogata.',
    normativaRiferimento: 'Art. 7 commi 6, 7 e 8 Legge 300/1970',
    avvertenzaSindacale: 'TERMINE PERENTORIO: L\'impugnazione deve essere promossa entro 20 giorni dalla comunicazione della sanzione. La sanzione resta sospesa fino alla pronuncia del collegio.',
    campiRichiesti: [
      { nome: 'Nome Lavoratore Sanzionato', chiave: 'nomeLavoratore', tipo: 'testo', placeholder: 'Nome e Cognome', valoreDefault: '' },
      { nome: 'Tipo di Sanzione Irrogata', chiave: 'tipoSanzione', tipo: 'testo', placeholder: 'es. Multa di 3 ore / Sospensione dal lavoro per 2 giorni', valoreDefault: 'Sospensione dal lavoro e dalla retribuzione per giorni ' },
      { nome: 'Data Notifica Provvedimento', chiave: 'dataNotifica', tipo: 'data', placeholder: 'GG/MM/AAAA', valoreDefault: '' },
      { nome: 'Rappresentante di Parte Lavoratore designato per il Collegio', chiave: 'arbitroLavoratore', tipo: 'testo', placeholder: 'Nome dirigente sindacale FIOM', valoreDefault: 'Funzionario Territoriale FIOM-CGIL Perugia' },
      { nome: 'Motivi di Nullità / Illegittimità', chiave: 'motiviRicorso', tipo: 'textarea', placeholder: 'Violazione termini, sproporzione, insussistenza dei fatti...', valoreDefault: '1. Totale insussistenza materiale dei fatti contestati;\n2. Palese sproporzione della sanzione rispetto al principio di gradualita ex art. 2106 c.c.;\n3. Mancata considerazione delle giustificazioni rese in sede di audizione orale.' }
    ],
    corpoTesto: `All'Ispettorato Territoriale del Lavoro di Perugia
Servizio Politiche del Lavoro e Conciliazioni
Via Caciolle / Via Belluno - Perugia
e p.c. Spett.le Direzione Aziendale CSI S.r.l. - Colombella

Oggetto: Promozione di collegio di conciliazione ed arbitrato ai sensi dell'art. 7, commi 6 e 7, della Legge 20 maggio 1970, n. 300 - Impugnazione del provvedimento disciplinare del {{dataNotifica}}.

Il/La sottoscritto/a {{nomeLavoratore}}, dipendente di CSI S.r.l., assistito dalla FIOM-CGIL Perugia;

PREMESSO CHE
- In data {{dataNotifica}} gli/le e stato notificato il provvedimento disciplinare recante: {{tipoSanzione}};
- Il lavoratore contesta integralmente la legittimita sostanziale e procedimentale del provvedimento adottato per i seguenti motivi:
{{motiviRicorso}}

TUTTO CIÒ PREMESSO, AI SENSI DELL'ART. 7 L. 300/1970
CHIEDE
la costituzione del Collegio di Conciliazione ed Arbitrato presso codesto spettabile Ispettorato Territoriale del Lavoro di Perugia, nominando quale proprio rappresentante di fiducia nel collegio:
{{arbitroLavoratore}}.

DIFFIDA
l'azienda datrice di lavoro dall'eseguire o dare efficacia alla sanzione, ricordando che, a norma dell'art. 7 c. 6 L. 300/1970, la sanzione resta sospesa fino alla pronuncia del collegio.

Perugia/Colombella, lì ____________________
Firma del Lavoratore: ____________________________________
Per adesione e assistenza FIOM-CGIL: _____________________`
  },
  {
    id: 'tmpl-richiesta-chiarimenti-busta',
    titolo: 'Richiesta chiarimenti e differenze retributive in busta paga',
    categoria: 'trasparenza',
    destinatario: 'Alla Direzione Amministrativa e del Personale CSI S.r.l.',
    descrizione: 'Istanza del lavoratore per ottenere la specifica dei calcoli di maggiorazioni turni, superminimo o trattenute non chiare.',
    normativaRiferimento: 'Legge 4 gennaio 1953 n. 4 (obbligo di consegna del prospetto paga) e D.Lgs. 104/2022 (Decreto Trasparenza)',
    avvertenzaSindacale: 'Allegare sempre copia del cedolino contestato evidenziando le voci difformi rispetto alle timbrature orarie.',
    campiRichiesti: [
      { nome: 'Nome Lavoratore', chiave: 'nomeLavoratore', tipo: 'testo', placeholder: 'Nome e Cognome', valoreDefault: '' },
      { nome: 'Mese del Cedolino Contestato', chiave: 'meseCedolino', tipo: 'testo', placeholder: 'es. Busta paga del mese di Gennaio 2026', valoreDefault: 'Cedolino del mese di ' },
      { nome: 'Voci Difformi o Omesse', chiave: 'vociAnomale', tipo: 'textarea', placeholder: 'Descrizione delle discrepanze...', valoreDefault: '1. Mancata corresponsione della maggiorazione del 30% per le ore lavorate in 3° turno notturno;\n2. Discrepanza nel calcolo degli scatti di anzianita rispetto alla tabella del CCNL Metalmeccanici;\n3. Errata quantificazione del residuo ferie e permessi ROL.' }
    ],
    corpoTesto: `Spett.le Ufficio Risorse Umane e Amministrazione del Personale
CSI S.r.l. - Stabilimento di Colombella

Oggetto: Richiesta formale di chiarimenti e rettifica del conteggio retributivo - {{meseCedolino}}.

Il/La sottoscritto/a {{nomeLavoratore}}, dipendente in forza presso lo stabilimento di Colombella;

ESAMINA
il prospetto paga relativo al periodo in oggetto e rileva le seguenti discordanze rispetto alle prestazioni effettivamente svolte e alle tariffe contrattuali del CCNL Metalmeccanici Industria:
{{vociAnomale}}

CONSIDERATO CHE
ai sensi della L. 4/1953 e del D.Lgs. 104/2022 il lavoratore ha diritto a prospetti paga chiari, veritieri e conformi alle tabelle contrattuali applicabili;

CHIEDE
un dettagliato prospetto esplicativo dei conteggi operati e la tempestiva corresponsione delle differenze retributive spettanti con la prima busta paga utile.

Colombella, lì ____________________
Firma del Lavoratore:
____________________________________________________`
  }
];
