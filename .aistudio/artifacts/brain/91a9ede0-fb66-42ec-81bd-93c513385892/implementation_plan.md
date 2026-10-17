# Piano di Ottimizzazione Enterprise & Rimozione Mock Data

Applicazione: **Guida CCNL Metalmeccanici – Assistente FIOM-CGIL**

## 1. Architettura & Modifiche Proposte

### A. Eliminazione Totale dei Mock Data (Zero Fictitious Data)
- **Database & Seed (`src/server/db.ts`)**:
  - Rimozione di tutti i profili fittizi (`Mario Rossi`, `Franco Vitali`, `Luca Moretti`) e credenziali inventate.
  - Rimozione di ticket fittizi (`PRAT-2026-001`, `PRAT-2026-002`) e note simulate.
  - Rimozione di documenti inventati nell'archivio interno: conservazione esclusiva dei documenti normativi e contrattuali ufficiali e verificati (Testo CCNL Metalmeccanici Industria, Statuto dei Lavoratori L. 300/1970, Testo Unico Rappresentanza 2014, D.Lgs. 81/2008).
  - Rimozione di eventi o scadenze inventate nel calendario.

### B. Gestione Reale dell'Identità Utente / Profilo Operatore
- Sostituzione del selettore con nomi inventati nell'Header con un **Profilo Operatore Reale**:
  - L'operatore può configurare il proprio profilo reale (Nome e Cognome, Ruolo: Lavoratore / RSU / RSA / RLS / Funzionario Sindacale, Stabilimento, Reparto, Matricola).
  - Il profilo viene salvato nella sessione locale e nel backend, garantendo che ogni ticket aperto, lettera generata o documento caricato riporti i dati effettivi dell'utente senza nomi inventati.

### C. Stati Vuoti Puliti e Professionali (Empty States)
- **Pratiche & Vertenze (`TicketsView.tsx`)**:
  - Stato vuoto professionale quando non ci sono dossier: *"Nessun dossier o pratica registrata. Clicca su 'Nuova Pratica' per avviare l'istruttoria di una vertenza reale o richiedere assistenza sindacale."*
  - Modale di creazione pratica 100% operativo con validazione dei campi reali (categoria, oggetto, descrizione fatti, priorità, termini).
- **Archivio Documentale (`ArchiveView.tsx`)**:
  - Visualizzazione esclusiva dei testi normativi ufficiali. Nessun file fittizio.
  - Stato vuoto per cartelle senza documenti utente con pulsante di upload reale funzionante.
- **Scadenze & Calendario (`CalendarView.tsx`)**:
  - Stato iniziale pulito. Possibilità di registrare scadenze perentorie reali (es. termine 5 giorni contestazione disciplinare, 20 giorni collegio arbitrale ITL, 60 giorni impugnazione licenziamento).
- **Circolari & Bacheca Sindacale**:
  - Stato iniziale: *"Nessuna circolare urgente pubblicata. Le comunicazioni ufficiali della RSU/RSA appariranno in questa bacheca."* con form di pubblicazione attivo per i soli delegati/admin.

### D. UI/UX Pulito, Essenziale e SaaS Enterprise (Linee Guida `frontend-design`)
- **Top Bar Contract**:
  - Brand zone pulita a singola riga: `FIOM-CGIL Perugia` · `CCNL Metalmeccanici`.
  - Rimozione di badge pill multipli e decorativi.
  - Profilo operatore compatto e configurabile.
- **Raffinamento Tipografico e Spaziale**:
  - Allineamento numerico tabellare (`tabular-nums`) per tutti i calcolatori contrattuali, percentuali di maggiorazione e scatti biennali.
  - Eliminazione di bordi spessi o asimmetrici e card nidificate dentro altre card.
  - Contrasto cromatico sobrio (verde bosco scuro `emerald-950`, ambra/oro `amber-500` per call-to-action primarie, grigi neutri `slate-50` / `slate-200` per superfici e bordi).
- **100% Funzionalità**:
  - Verifica di tutti i bottoni, filtri, campi di ricerca e download testi. Nessun elemento decorativo privo di handler.

---

## 2. Piano di Verifica & Test

1. **Audit di Pulizia Dati**:
   - Ispezione di `data/database.json` e `src/server/db.ts` per confermare l'azzeramento di qualsiasi nome o dossier fittizio.
2. **Test Profilo Utente**:
   - Configurazione di un profilo operatore con dati reali e verifica che le lettere generate e i ticket creati ereditino tali dati in modo trasparente.
3. **Test Flussi Operativi**:
   - Creazione di una nuova pratica reale, aggiunta di una memoria difensiva o nota, cambio stato (aperta / in lavorazione / chiusa) e verifica persistenza.
   - Simulatore contrattuale: verifica calcoli con formule esatte del CCNL Metalmeccanici.
   - Generatore modulistica: test di esportazione e salvataggio delle bozze legali.
4. **Verifica Build e Linter**:
   - Esecuzione di `lint_applet` (`tsc --noEmit`) e `compile_applet` per assicurare 0 errori di compilazione e rispetto delle regole di runtime.
