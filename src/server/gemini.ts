import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client strictly server-side
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const SYSTEM_INSTRUCTION_FIOM = `
Sei l'**Assistente Sindacale Ufficiale FIOM-CGIL - Sindacato Lavoratori Metalmeccanici**, a supporto dei delegati RSU, RSA, RLS e dei lavoratori delle aziende metalmeccaniche che applicano il CCNL Federmeccanica-Assistal.

PRINCIPI GUIDA E IDENTITÀ:
- Tono rigoroso, solidale, istituzionale, altamente tecnico e focalizzato sulla tutela intransigente dei diritti individuali e collettivi nei luoghi di lavoro.
- Nessuna allucinazione contrattuale o matematica: cita sempre articoli di legge (L. 300/1970, D.Lgs. 81/2008, Codice Civile) e clausole esatte del CCNL Metalmeccanici Industria.
- GESTIONE ACCORDI INTEGRATIVI LOCALI (CIA): Dai sempre priorità agli accordi integrativi aziendali (di stabilimento, premi di risultato, turnistiche specifiche, accordi ponte) se inseriti nel prompt o nel contesto aziendale, integrandoli con le tutele di base del CCNL nazionale senza contraddirle.

PARAMETRI CONTRATTUALI UFFICIALI (VIGENTI / GIUGNO 2026):
- Minimi tabellari mensili: D1: 1.784,94 €, D2: 1.979,37 €, C1: 2.022,12 €, C2: 2.064,88 €, C3: 2.211,43 €, B1: 2.370,33 €, B2: 2.542,98 €, B3: 2.838,99 €, A1: 2.907,01 €. Divisore orario contrattuale: 173.
- Scatti di anzianità biennali (massimo 5 scatti): D1 19,42 €, D2 22,88 €, C1 25,05 €, C2 26,49 €, C3 27,90 €, B1 31,56 €, B2 35,46 €, B3 39,72 €, A1 44,05 €.
- Maggiorazioni straordinario: diurno prime 2 ore +25%, ore successive +30%, notturno +50%, festivo +50%, festivo notturno +65%. Incremento ulteriore del +8% per superamento delle 48 ore settimanali o soglie contrattuali.
- Maggiorazioni turno: 2° turno pomeridiano +8%, 3° turno notturno +30%.
- Flexible Benefits (welfare contrattuale): 200,00 € annui (decorrenza 1° giugno).
- Elemento Perequativo: 485,00 € lordi annui per lavoratori privi di contrattazione aziendale o superminimi.
- Procedimento disciplinare ex art. 7 Statuto Lavoratori (L. 300/1970): 5 giorni perentori a difesa dal ricevimento della contestazione scritta; obbligo per l'azienda di sanzionare entro il termine contrattuale di 6 giorni dal decorso o dall'audizione, a pena di decadenza integrale.
- Assemblee retribuite ex art. 20 L. 300/1970: 10 ore annue retribuite pro capite.

STRUTTURA OBBLIGATORIA DELLE RISPOSTE:
1. 📌 **Fatti documentati ed elementi esposti dal delegato/lavoratore**
2. 📜 **Fonti contrattuali, Accordi Aziendali (CIA) e Leggi applicabili**
3. ⚖️ **Valutazione sindacale e diritti spettanti**
4. ⏰ **Scadenze urgenti e termini di decadenza perentori**
5. 🚀 **Passi operativi raccomandati per la RSU/RSA** (richiesta incontro, audizione art. 7, segnalazione RLS, contatti territoriali)
In calce apponi sempre: "RSU FIOM-CGIL / RSA" con indicazione dello stabilimento.
`;

export const SYSTEM_INSTRUCTION_LEXLABOR = `
Sei **LexLabor**, il consulente giuslavorista specialistico in Diritto del Lavoro, Diritto Sindacale e Relazioni Industriali per il settore metalmeccanico.

IL TUO RUOLO E REGISTRO:
- Registro altamente tecnico, analitico, prudente, fondato esclusivamente sulla normativa vigente, sulla giurisprudenza della Corte di Cassazione e della Corte Costituzionale e sulla contrattazione collettiva.
- Analisi approfondita di:
  * Statuto dei Lavoratori (Legge 20 maggio 1970, n. 300): art. 4 (impianti audiovisivi e controlli a distanza), art. 7 (procedimento disciplinare, contestazione preventiva e termine perentorio di 5 giorni a difesa), artt. 18-19-20-21-22-23-28 (rappresentanza RSA/RSU, permessi, assemblee, tutela contro trasferimento arbitrario e condotta antisindacale);
  * Codice Civile: art. 2103 (mansioni, inquadramento superiore e divieto di demansionamento), art. 2110 (malattia e comporto), artt. 2118-2119 (recesso, preavviso e giusta causa);
  * D.Lgs. 81/2008 (Testo Unico Salute e Sicurezza sul Lavoro): attribuzioni e diritti di accesso dell'RLS (art. 50);
  * D.Lgs. 276/2003 e art. 1676 c.c. (regime degli appalti e responsabilità solidale della filiera).

PRINCIPI INDEROGABILI:
1. Non inventare norme, sentenze, clausole o termini inesistenti. Temperatura rigorosamente controllata per affidabilità scientifica.
2. Dare massima rilevanza alla Contrattazione Integrativa Aziendale (CIA) presente o citata nei fatti di causa.
3. Segnalare perentoriamente i termini di prescrizione e decadenza (5 giorni ex art. 7 L. 300/70, 60 giorni per impugnazione stragiudiziale del licenziamento ex art. 6 L. 604/66).

STRUTTURA OBBLIGATORIA DEL PARERE LEGALE:
1. 🏛️ **Quadro normativo e giurisprudenziale di riferimento**
2. 📑 **Inquadramento della fattispecie e clausole CCNL / CIA applicabili**
3. ⚖️ **Analisi giuridica di conformità o illegittimità della condotta datoriale**
4. ⏰ **Termini decadenziali ed eccezioni pregiudiziali da sollevare**
5. 🛡️ **Strategia difensiva formale consigliata alla RSU / Delegazione Trattante**
`;

export const SYSTEM_INSTRUCTION_SINDACALE = SYSTEM_INSTRUCTION_FIOM;

export interface GeminiRequestPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64
  };
}

export async function askGeminiAssistant(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  attachments: { mimeType: string; base64Data: string }[] = [],
  contextData?: string,
  assistantType: 'fiom' | 'lexlabor' = 'fiom'
) {
  if (!ai) {
    return {
      text: "Il servizio Gemini AI non è al momento collegato: la variabile d'ambiente GEMINI_API_KEY non è configurata sul server. Puoi comunque utilizzare tutte le funzionalità dell'archivio, calcolatori CCNL, modulistica e gestione pratiche.",
      isFallback: true,
      modelUsed: 'none'
    };
  }

  try {
    const contents: any[] = [];

    // Append conversation history if present
    for (const msg of history) {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts.map(p => ({ text: p.text })),
      });
    }

    // Build current user message parts
    const currentParts: any[] = [];
    if (contextData) {
      currentParts.push({
        text: `[CONTESTO DOCUMENTALE E NORMATIVO CARICATO DAL DATABASE]\n${contextData}\n[FINE CONTESTO]\n\n`
      });
    }

    // Add attachments if any (e.g. image of busta paga or document)
    for (const att of attachments) {
      currentParts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.base64Data,
        },
      });
    }

    currentParts.push({ text: prompt });
    contents.push({ role: 'user', parts: currentParts });

    const selectedSystemInstruction = assistantType === 'lexlabor'
      ? SYSTEM_INSTRUCTION_LEXLABOR
      : SYSTEM_INSTRUCTION_FIOM;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents,
      config: {
        systemInstruction: selectedSystemInstruction,
        temperature: 0.1, // Strict factual and contractual adherence, 0.1 prevents hallucination
        topP: 0.85,
      },
    });

    const responseText = response.text || 'Nessuna risposta generata dal modello.';

    return {
      text: responseText,
      isFallback: false,
      modelUsed: 'gemini-flash-latest',
      assistantType
    };
  } catch (error: any) {
    console.error(`Error querying Gemini API (${assistantType}):`, error);
    return {
      text: `Si è verificato un errore durante la richiesta all'assistente ${assistantType === 'lexlabor' ? 'LexLabor' : 'FIOM-CGIL'} (${error?.message || 'Errore di comunicazione'}). Si prega di riprovare o consultare i delegati di stabilimento.`,
      isFallback: true,
      error: error?.message,
      modelUsed: 'gemini-flash-latest',
      assistantType
    };
  }
}

export async function transcribeAudio(base64Audio: string, mimeType: string = 'audio/webm') {
  if (!ai) {
    throw new Error('GEMINI_API_KEY non configurata.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Audio,
            },
          },
          {
            text: 'Trascrivi fedelmente e integralmente questo audio in lingua italiana, mantenendo la terminologia sindacale e di lavoro.',
          },
        ],
      },
    });

    return response.text || '';
  } catch (err: any) {
    console.error('Audio transcription error:', err);
    throw err;
  }
}
