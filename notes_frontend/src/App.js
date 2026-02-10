import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import NoteList from './components/NoteList';
import Modal from './components/Modal';
import NoteEditor from './components/NoteEditor';
import { notesService } from './services/notesService';

function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await notesService.listNotes();
      setNotes(list);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { notes, setNotes, isLoading, refresh };
}

// PUBLIC_INTERFACE
function App() {
  /** Main Notes app entrypoint: list/create/edit/delete notes with local persistence. */
  const { notes, setNotes, isLoading, refresh } = useNotes();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create'); // 'create' | 'edit'
  const [activeNote, setActiveNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const config = useMemo(() => notesService.getConfig(), []);

  const openCreate = () => {
    setActiveNote(null);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setActiveNote(note);
    setEditorMode('edit');
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (isSaving) return;
    setEditorOpen(false);
  };

  const saveFromEditor = async ({ title, content }) => {
    setIsSaving(true);
    try {
      if (editorMode === 'edit' && activeNote?.id) {
        const updated = await notesService.updateNote(activeNote.id, { title, content });
        // Update optimistically in UI without needing full refresh.
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await notesService.createNote({ title, content });
        setNotes((prev) => [created, ...prev]);
      }
      setEditorOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (note) => {
    const ok = window.confirm(`Delete "${note.title || 'Untitled'}"? This cannot be undone.`);
    if (!ok) return;

    // Optimistic UI remove.
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    try {
      await notesService.deleteNote(note.id);
    } catch {
      // If something goes wrong later when backend is added, recover by refreshing.
      await refresh();
    }
  };

  return (
    <div className="App">
      <Header noteCount={notes.length} onNewNote={openCreate} />

      <main className="container">
        <div className="toolbar" role="region" aria-label="Toolbar">
          <div className="toolbarLeft">
            <div className="pill" title="Persistence layer">
              <span className="pillLabel">Persistence</span>
              <span className="pillValue">localStorage</span>
            </div>

            {config.backendConfigured ? (
              <div className="pill" title="Backend configured but not used yet">
                <span className="pillLabel">Backend</span>
                <span className="pillValue">configured</span>
              </div>
            ) : (
              <div className="pill" title="No backend configured">
                <span className="pillLabel">Backend</span>
                <span className="pillValue">none</span>
              </div>
            )}
          </div>

          <div className="toolbarRight">
            <button className="btn btnGhost" type="button" onClick={refresh} disabled={isLoading}>
              {isLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        <NoteList notes={notes} isLoading={isLoading} onEdit={openEdit} onDelete={deleteNote} />
      </main>

      <Modal
        title={editorMode === 'edit' ? 'Edit note' : 'New note'}
        isOpen={editorOpen}
        onClose={closeEditor}
      >
        <NoteEditor
          initialNote={activeNote}
          mode={editorMode}
          onCancel={closeEditor}
          onSave={saveFromEditor}
          isSaving={isSaving}
        />
      </Modal>

      <footer className="footer">
        <div className="footerInner">
          <span className="muted">Saved in your browser</span>
          <span className="dot" aria-hidden="true">
            •
          </span>
          <span className="muted">Key: {config.storageKey}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
