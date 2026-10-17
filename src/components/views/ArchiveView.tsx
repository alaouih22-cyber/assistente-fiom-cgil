import React, { useState, useEffect } from 'react';
import { DocumentItem, User } from '../../types/index.js';
import {
  FolderLock,
  Search,
  Upload,
  FileText,
  Lock,
  Eye,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Tag,
  Filter,
  Folder,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

interface ArchiveViewProps {
  currentUser: User;
  initialSelectedDocId?: string;
  initialFolderFilter?: string;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  currentUser,
  initialSelectedDocId,
  initialFolderFilter
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeFolderFilter, setActiveFolderFilter] = useState<string | null>(initialFolderFilter || null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New doc form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('accordo_aziendale');
  const [newDescription, setNewDescription] = useState('');
  const [newVisibility, setNewVisibility] = useState<DocumentItem['visibility']>('sindacale');
  const [newTags, setNewTags] = useState('CSI Colombella, FIOM');
  const [newFolder, setNewFolder] = useState('/Archivio RSU/Verbali Riunioni/');

  const isDelegateOrAdmin = ['admin', 'rsa', 'rsu', 'rls'].includes(currentUser.role);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents', {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        }
      });
      const data = await res.json();
      const docsList: DocumentItem[] = Array.isArray(data) ? data : [];
      setDocuments(docsList);

      // Deep linking handler from search
      if (initialSelectedDocId) {
        const found = docsList.find(d => d.id === initialSelectedDocId);
        if (found) setSelectedDoc(found);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentUser]);

  useEffect(() => {
    if (initialFolderFilter) {
      setActiveFolderFilter(initialFolderFilter);
    }
  }, [initialFolderFilter]);

  useEffect(() => {
    if (initialSelectedDocId && documents.length > 0) {
      const found = documents.find(d => d.id === initialSelectedDocId);
      if (found) setSelectedDoc(found);
    }
  }, [initialSelectedDocId, documents]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          folderPath: newFolder || '/Archivio Generale/',
          description: newDescription,
          visibility: isDelegateOrAdmin ? newVisibility : 'privato_lavoratore',
          tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
          filename: `${newTitle.toLowerCase().replaceAll(' ', '_')}.pdf`,
          contentSummary: newDescription || 'Documento archiviato nel repository sindacale.'
        })
      });

      if (res.ok) {
        setIsUploadModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        fetchDocuments();
      }
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  // Distinct folders from authorized documents
  const allFolders = Array.from(new Set(documents.map(d => d.folderPath).filter(Boolean)));

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.folderPath && doc.folderPath.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesFolder = !activeFolderFilter || doc.folderPath === activeFolderFilter;

    return matchesSearch && matchesCategory && matchesFolder;
  });

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <FolderLock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Archivio Documentale & Cartelle Sindacali CSI Colombella
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accesso regolato in base al ruolo (RBAC). Documenti sindacali, verbali RSU, accordi di secondo livello e circolari protette.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-800 transition flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Carica Documento</span>
        </button>
      </div>

      {/* Security alert */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>
            Politica di Riservatezza Attiva: Solo i delegati autorizzati possono visualizzare fascicoli confidenziali e verbali di trattativa.
          </span>
        </div>
        <span className="text-3xs uppercase font-extrabold bg-white/10 px-2 py-0.5 rounded text-amber-300">
          RBAC ENFORCED
        </span>
      </div>

      {/* Folders navigation bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-2xs text-slate-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-red-700" />
            Cartelle dell'Archivio Sindacale ({allFolders.length})
          </span>
          {activeFolderFilter && (
            <button
              onClick={() => setActiveFolderFilter(null)}
              className="text-red-700 hover:underline normal-case font-semibold"
            >
              Mostra tutte le cartelle ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFolderFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition flex items-center gap-1 ${
              activeFolderFilter === null
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Tutte le Cartelle</span>
            <span className="text-3xs opacity-80">({documents.length})</span>
          </button>

          {allFolders.map((f, idx) => {
            const count = documents.filter(d => d.folderPath === f).length;
            const isSelected = activeFolderFilter === f;

            return (
              <button
                key={idx}
                onClick={() => setActiveFolderFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-2xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                <span className="truncate max-w-[200px]">{f.replace(/^\/|\/$/g, '')}</span>
                <span className="text-3xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per titolo, tag o testo contenuto..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            aria-label="Filtra documenti per categoria"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          >
            <option value="all">Tutte le categorie</option>
            <option value="accordo_aziendale">Accordi Aziendali CSI</option>
            <option value="verbale">Verbali RSU</option>
            <option value="comunicazione_direzione">Comunicazioni Direzione</option>
            <option value="ccnl">CCNL Metalmeccanici</option>
            <option value="sicurezza_rls">Sicurezza RLS</option>
            <option value="normativa">Normativa</option>
            <option value="modulistica">Modulistica & Bozze</option>
          </select>
        </div>
      </div>

      {/* Active Folder Indicator Banner */}
      {activeFolderFilter && (
        <div className="bg-red-50 border border-red-200 text-red-950 p-2.5 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <FolderOpen className="w-4 h-4 text-red-700" />
            Cartella Attiva: <code className="bg-white px-2 py-0.5 rounded border border-red-300 font-mono text-2xs">{activeFolderFilter}</code>
          </span>
          <span className="text-2xs text-red-700">
            {filteredDocs.length} documenti contenuti
          </span>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-red-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {doc.category.replace('_', ' ')}
                </span>

                <span
                  className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                    doc.visibility === 'public'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                >
                  {doc.visibility === 'public' ? 'Pubblico' : 'Sindacale'}
                </span>
              </div>

              {/* Folder Path badge */}
              <div className="text-3xs text-slate-400 font-mono flex items-center gap-1 mb-1">
                <Folder className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">{doc.folderPath}</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1">
                {doc.title}
              </h3>

              <p className="text-2xs text-slate-500 line-clamp-3 leading-relaxed mb-3">
                {doc.contentSummary || doc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {doc.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-3xs bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
              <span className="text-3xs">{doc.filesize} • {doc.version}</span>

              <button
                onClick={() => setSelectedDoc(doc)}
                className="text-xs font-bold text-red-700 hover:text-red-900 transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Apri Scheda</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
            Nessun documento corrisponde ai criteri di ricerca nella cartella selezionata.
          </div>
        )}
      </div>

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[88vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    {selectedDoc.category.replace('_', ' ')}
                  </span>
                  <span className="text-2xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedDoc.folderPath}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong>Percorso Cartella:</strong> <code>{selectedDoc.folderPath}</code></div>
                <div><strong>Autore / Ente:</strong> {selectedDoc.author}</div>
                <div><strong>Versione / Data:</strong> {selectedDoc.version} ({selectedDoc.updatedAt})</div>
                <div><strong>File:</strong> {selectedDoc.filename} ({selectedDoc.filesize})</div>
                <div><strong>Stato di verifica:</strong> {selectedDoc.verified ? 'Verificato' : 'Da verificare'}</div>
              </div>

              <div>
                <div className="text-2xs font-bold uppercase text-slate-500 mb-1">
                  Sintesi del Documento
                </div>
                <p className="bg-white p-3 rounded-xl border border-slate-200 leading-relaxed text-xs">
                  {selectedDoc.contentSummary || selectedDoc.description}
                </p>
              </div>

              {selectedDoc.fullContent && (
                <div>
                  <div className="text-2xs font-bold uppercase text-slate-500 mb-1">
                    Estratto Integrale del Testo Archiviato
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedDoc.fullContent}
                  </div>
                </div>
              )}

              {selectedDoc.verifiedSourceUrl && (
                <div className="pt-2">
                  <a
                    href={selectedDoc.verifiedSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1.5"
                  >
                    <span>Apri Fonte Istituzionale Ufficiale</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Chiudi Scheda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Carica Documento nell'Archivio Riservato
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Titolo del Documento
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Accordo turnazione reparto spianatura"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Percorso Cartella di Archiviazione
                </label>
                <input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  placeholder="es. /Archivio RSU/Verbali Riunioni/"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="accordo_aziendale">Accordo Aziendale</option>
                    <option value="verbale">Verbale RSU / Trattativa</option>
                    <option value="comunicazione_direzione">Comunicazione Direzione</option>
                    <option value="ccnl">CCNL Metalmeccanici</option>
                    <option value="sicurezza_rls">Sicurezza RLS / DVR</option>
                    <option value="normativa">Normativa</option>
                    <option value="modulistica">Modulistica</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    Visibilità
                  </label>
                  <select
                    value={newVisibility}
                    onChange={(e) => setNewVisibility(e.target.value as any)}
                    disabled={!isDelegateOrAdmin}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    <option value="sindacale">Riservato Sindacale</option>
                    <option value="public">Pubblico Lavoratori</option>
                    <option value="privato_lavoratore">Personale Privato</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Tag (separati da virgola)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  Descrizione o Sommario
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Note sul contenuto del documento..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800"
                >
                  Salva Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
