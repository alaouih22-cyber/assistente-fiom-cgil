import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types/index.js';
import { useCompany } from '../../context/CompanyContext.tsx';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Scale,
  Shield,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Square,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export type AssistantPersona = 'fiom' | 'lexlabor';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: { name: string; type: string; previewUrl?: string }[];
  timestamp: string;
  assistantType?: AssistantPersona;
}

interface AIAssistantViewProps {
  currentUser: User;
  onCreateTicketFromAI?: (title: string, description: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentUser,
  onCreateTicketFromAI,
}) => {
  const { currentCompany } = useCompany();
  const [activePersona, setActivePersona] = useState<AssistantPersona>('fiom');

  // Separate conversation history for each assistant
  const [fiomMessages, setFiomMessages] = useState<Message[]>([
    {
      id: 'welcome_fiom',
      role: 'model',
      text: `Buongiorno ${currentUser.name}. Sono l'**Assistente Digitale FIOM-CGIL** per la tutela dei lavoratori nel settore metalmeccanico (CCNL Federmeccanica-Assistal e stabilimento CSI Colombella).\n\nPosso aiutarti a esaminare:\n- **Orari, turni e maggiorazioni**: calcolo straordinario diurno (+25%/+30%), notturno (+50%), festivo (+50%), notturno festivo (+65%) e avvicendati (8%/30%);\n- **Inquadramento professionale e livelli**: declaratorie dal livello D1 al livello A1;\n- **Diritti sindacali, permessi e assemblee**: ruolo della RSU e dell'RSA ex L. 300/1970;\n- **Salute e sicurezza (RLS)**: segnalazioni rischi, sopralluoghi ex D.Lgs. 81/2008.\n\n*Puoi farmi qualsiasi domanda in linguaggio naturale o allegare foto di cedolini e comunicazioni.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantType: 'fiom'
    }
  ]);

  const [lexLaborMessages, setLexLaborMessages] = useState<Message[]>([
    {
      id: 'welcome_lexlabor',
      role: 'model',
      text: `Benvenuto. Sono **LexLabor**, consulente giuslavorista specializzato in Diritto del Lavoro, Statuto dei Lavoratori (L. 300/1970) e contrattazione collettiva metalmeccanica.\n\nFornisco analisi ad elevato rigore tecnico su:\n- **Procedimenti disciplinari ex Art. 7 L. 300/1970**: rispetto del termine perentorio di 5 giorni a difesa, preventiva contestazione scritta, audizione orale con delegato sindacale;\n- **Mansioni superiori e demansionamento (Art. 2103 c.c.)**: requisiti per l'acquisizione definitiva del livello superiore;\n- **Controlli a distanza e impianti audiovisivi (Art. 4 L. 300/1970)**: presupposti, accordo RSU o autorizzazione ITL;\n- **Licenziamenti e decadenze (L. 604/1966 e D.Lgs. 23/2015)**: impugnazione stragiudiziale entro 60 giorni.\n\n*Descrivi i fatti accaduti o incolla il testo di una lettera ricevuta per ricevere la qualificazione giuridica.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantType: 'lexlabor'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ file: File; base64: string; mimeType: string; preview?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio / Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Abort controller reference for stopping in-flight generation
  const abortControllerRef = useRef<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Current active messages list
  const currentMessages = activePersona === 'fiom' ? fiomMessages : lexLaborMessages;
  const setCurrentMessages = activePersona === 'fiom' ? setFiomMessages : setLexLaborMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  // Stop any active TTS when switching assistant or unmounting
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activePersona]);

  const quickPromptsFiom = [
    {
      title: 'Regole e maggiorazioni turno',
      text: 'Quali sono le maggiorazioni previste dal CCNL per il lavoro a turni (2° turno e 3° turno notturno) e straordinari festivi?'
    },
    {
      title: 'Passaggio di mansione e livello',
      text: 'Svolgo mansioni del livello superiore da più di 6 mesi sulla linea di taglio. Quali diritti ho secondo il CCNL Metalmeccanici?'
    },
    {
      title: 'Assemblee sindacali retribuite',
      text: 'Come funziona il diritto alle 10 ore annue di assemblea retribuita e chi può convocarle in stabilimento?'
    },
    {
      title: 'Salute, sicurezza e ruolo RLS',
      text: 'Come segnalare una situazione di pericolo o mancata aspirazione fumi al Rappresentante dei Lavoratori per la Sicurezza (RLS)?'
    }
  ];

  const quickPromptsLexLabor = [
    {
      title: 'Contestazione disciplinare (Art. 7 L. 300/70)',
      text: 'Ho ricevuto una lettera di contestazione disciplinare oggi. Quali sono i termini perentori di difesa e come richiedo l\'audizione assistita?'
    },
    {
      title: 'Telecamere e controlli a distanza (Art. 4)',
      text: 'L\'azienda può utilizzare le immagini delle telecamere o i dati del badge elettronico per sanzioni disciplinari?'
    },
    {
      title: 'Demansionamento e danno professionale',
      text: 'Mi hanno spostato a mansioni inferiori rispetto al mio inquadramento. Qual è la tutela ex art. 2103 del Codice Civile?'
    },
    {
      title: 'Calcolo periodo di comporto per malattia',
      text: 'Come si calcola il periodo di comporto per malattia nel CCNL Metalmeccanici e quando opera il comporto prolungato?'
    }
  ];

  const currentQuickPrompts = activePersona === 'fiom' ? quickPromptsFiom : quickPromptsLexLabor;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Il file selezionato supera il limite di 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const isImage = file.type.startsWith('image/');

      setSelectedFile({
        file,
        base64,
        mimeType: file.type || 'application/octet-stream',
        preview: isImage ? result : undefined
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setRecordingStatus('');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async () => {
          const result = reader.result as string;
          const base64Audio = result.split(',')[1];

          setRecordingStatus('Trascrizione in corso...');
          try {
            const res = await fetch('/api/gemini/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64Audio, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            if (data.text) {
              setInputPrompt((prev) => (prev ? `${prev} ${data.text}` : data.text));
            }
          } catch (err) {
            console.error('Audio transcription error:', err);
          } finally {
            setRecordingStatus('');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus('Registrazione audio attiva: parla chiaramente...');
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Impossibile accedere al microfono. Verifica i permessi nel browser.');
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSpeakText = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('La sintesi vocale non è supportata dal tuo browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown stars and hashes for pleasant voice reading
    const cleanText = text.replace(/[*#_`]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';
    utterance.rate = 1.0;

    // Pick Italian voice if available
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find((v) => v.lang.startsWith('it'));
    if (itVoice) {
      utterance.voice = itVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: prompt.trim() || (selectedFile ? `Allegato documento: ${selectedFile.file.name}` : ''),
      attachments: selectedFile
        ? [
            {
              name: selectedFile.file.name,
              type: selectedFile.mimeType,
              previewUrl: selectedFile.preview
            }
          ]
        : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantType: activePersona
    };

    setCurrentMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const currentAttachment = selectedFile;
    setSelectedFile(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history (skip initial welcome message)
      const history = currentMessages
        .filter((_, idx) => idx > 0)
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const attachmentsPayload = currentAttachment
        ? [
            {
              mimeType: currentAttachment.mimeType,
              base64Data: currentAttachment.base64
            }
          ]
        : [];

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          prompt: userMessage.text,
          history,
          attachments: attachmentsPayload,
          includeCompanyContext: true,
          includeCCNLContext: true,
          assistantType: activePersona,
          companyContext: currentCompany
        }),
        signal: controller.signal
      });

      const data = await response.json();

      const modelMessage: Message = {
        id: `resp_${Date.now()}`,
        role: 'model',
        text: data.text || 'Risposta non pervenuta dal server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantType: activePersona
      };

      setCurrentMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const abortedMessage: Message = {
          id: `aborted_${Date.now()}`,
          role: 'model',
          text: 'Generazione della risposta interrotta su richiesta.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assistantType: activePersona
        };
        setCurrentMessages((prev) => [...prev, abortedMessage]);
      } else {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: `err_${Date.now()}`,
          role: 'model',
          text: `Errore di connessione con l'assistente (${error.message || 'Server non raggiungibile'}). Tutte le sezioni normative, calcolatori e modulistica restano consultabili.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assistantType: activePersona
        };
        setCurrentMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (confirm(`Vuoi azzerare la sessione di ${activePersona === 'fiom' ? 'Assistente FIOM' : 'LexLabor'} e iniziare una nuova conversazione?`)) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
      }
      if (activePersona === 'fiom') {
        setFiomMessages([fiomMessages[0]]);
      } else {
        setLexLaborMessages([lexLaborMessages[0]]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] max-w-5xl mx-auto p-2 sm:p-4">
      {/* Top Header: Compact Persona Switcher (Dark Green & Gold) */}
      <div className="bg-emerald-950 text-white rounded-xl p-2.5 sm:p-3 mb-2 border border-emerald-900 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Persona selector tabs */}
          <div className="flex bg-emerald-900/80 p-0.5 rounded-lg border border-emerald-700/50">
            <button
              onClick={() => setActivePersona('fiom')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                activePersona === 'fiom'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Assistente Digitale FIOM-CGIL</span>
            </button>

            <button
              onClick={() => setActivePersona('lexlabor')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                activePersona === 'lexlabor'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>LexLabor (Giuslavorista)</span>
            </button>
          </div>
        </div>

        {/* Action: Clear / New Conversation */}
        <button
          onClick={handleResetChat}
          className="flex items-center gap-1 text-2xs sm:text-xs text-emerald-200 hover:text-white hover:bg-emerald-800/80 px-2 py-1.5 rounded-md transition"
          title="Inizia una nuova conversazione"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuova chat</span>
        </button>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-2xs mb-2">
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-900 text-white rounded-tr-none shadow-xs'
                  : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none shadow-2xs'
              }`}
            >
              {/* Message Header badge for Model */}
              {msg.role === 'model' && (
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200/60">
                  <div className="flex items-center gap-1.5 font-bold text-3xs uppercase tracking-wider text-emerald-900">
                    {msg.assistantType === 'lexlabor' ? (
                      <>
                        <Scale className="w-3 h-3 text-amber-600" />
                        <span>LexLabor • Analisi Giuridica</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 text-emerald-700" />
                        <span>Assistente FIOM-CGIL • Tutela Sindacale</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Read Aloud Button */}
                    <button
                      onClick={() => handleSpeakText(msg.id, msg.text)}
                      className={`p-1 rounded hover:bg-slate-200 transition ${
                        speakingMessageId === msg.id ? 'text-amber-600 bg-amber-50' : 'text-slate-500'
                      }`}
                      title={speakingMessageId === msg.id ? 'Ferma lettura vocale' : 'Ascolta risposta a voce'}
                    >
                      {speakingMessageId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="p-1 rounded text-slate-500 hover:bg-slate-200 transition"
                      title="Copia testo"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Attachments preview if user attached */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2 p-2 bg-black/10 rounded-lg flex items-center gap-2 text-2xs">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{msg.attachments[0].name}</span>
                </div>
              )}

              {/* Formatted Text */}
              <div className="whitespace-pre-wrap break-words">{msg.text}</div>

              {/* Timestamp */}
              <div
                className={`text-3xs mt-1.5 text-right ${
                  msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator with Stop Button */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-800 animate-ping" />
            <span>
              {activePersona === 'lexlabor'
                ? 'LexLabor sta esaminando le fonti giuridiche e la giurisprudenza...'
                : 'Assistente FIOM sta consultando il CCNL e gli accordi di stabilimento...'}
            </span>
            <button
              onClick={handleStopGeneration}
              className="ml-3 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-2xs font-bold hover:bg-rose-100 flex items-center gap-1 transition"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Interrompi</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts if conversation is fresh */}
      {currentMessages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
          {currentQuickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              className="text-left text-2xs sm:text-xs p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-slate-700 transition flex items-center justify-between group"
            >
              <span className="truncate pr-2 font-medium">{q.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-800 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Recording Status Notice */}
      {recordingStatus && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-2xs px-3 py-1.5 rounded-lg mb-1.5 flex items-center justify-between">
          <span>{recordingStatus}</span>
          <button
            onClick={handleVoiceRecord}
            className="text-rose-700 font-bold underline ml-2"
          >
            Ferma
          </button>
        </div>
      )}

      {/* Attachment Chip if file selected */}
      {selectedFile && (
        <div className="bg-slate-100 border border-slate-200 text-slate-800 text-2xs px-2.5 py-1 rounded-lg mb-1.5 flex items-center justify-between w-fit gap-2">
          <FileText className="w-3.5 h-3.5 text-emerald-800" />
          <span className="truncate max-w-xs">{selectedFile.file.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input Box - Responsive & Compact */}
      <div className="bg-white rounded-xl border border-slate-300 focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800 shadow-2xs p-1.5 flex items-end gap-1.5">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,application/pdf"
          className="hidden"
        />

        {/* Attach File Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-500 hover:text-emerald-900 hover:bg-slate-100 rounded-lg transition"
          title="Allega busta paga o documento (PDF/Immagine)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Real Microphone Recording Button */}
        <button
          onClick={handleVoiceRecord}
          className={`p-2 rounded-lg transition ${
            isRecording
              ? 'text-white bg-rose-600 animate-pulse'
              : 'text-slate-500 hover:text-emerald-900 hover:bg-slate-100'
          }`}
          title={isRecording ? 'Interrompi registrazione' : 'Ditta domanda con il microfono'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input Area */}
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            activePersona === 'lexlabor'
              ? 'Poni un quesito giuridico a LexLabor (es. contestazione, art. 7, mansioni superiori)...'
              : 'Scrivi all\'Assistente FIOM (es. orari, turni, maggiorazioni, RSU, RLS)...'
          }
          rows={1}
          className="flex-1 resize-none bg-transparent py-2 px-1 text-xs sm:text-sm text-slate-900 focus:outline-hidden max-h-28"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || (!inputPrompt.trim() && !selectedFile)}
          className={`p-2 rounded-lg text-white font-bold transition shrink-0 ${
            isLoading || (!inputPrompt.trim() && !selectedFile)
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-emerald-900 hover:bg-emerald-800'
          }`}
          title="Invia messaggio"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
