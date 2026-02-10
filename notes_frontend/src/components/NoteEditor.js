import { useEffect, useMemo, useState } from 'react';

function normalizeTitle(t) {
  const v = (t || '').trim();
  return v.length === 0 ? 'Untitled' : v;
}

// PUBLIC_INTERFACE
export default function NoteEditor({ initialNote, mode, onCancel, onSave, isSaving }) {
  /** Editor form for creating/updating a note. */
  const initial = useMemo(
    () => ({
      title: initialNote?.title || '',
      content: initialNote?.content || '',
    }),
    [initialNote]
  );

  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  useEffect(() => {
    setTitle(initial.title);
    setContent(initial.content);
  }, [initial.title, initial.content]);

  const canSave = !isSaving;

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave?.({
      title: normalizeTitle(title),
      content: content || '',
    });
  };

  return (
    <form onSubmit={submit} className="editorForm">
      <label className="field">
        <span className="label">Title</span>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          autoFocus
          aria-label="Note title"
        />
      </label>

      <label className="field">
        <span className="label">Content</span>
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something…"
          rows={10}
          aria-label="Note content"
        />
      </label>

      <div className="editorActions">
        <button className="btn btnGhost" type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button className="btn btnPrimary" type="submit" disabled={!canSave}>
          {isSaving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Save'}
        </button>
      </div>
    </form>
  );
}
