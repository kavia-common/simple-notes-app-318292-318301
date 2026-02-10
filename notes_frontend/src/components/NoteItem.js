function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return '';
  }
}

function previewText(text, maxLen) {
  const normalized = (text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen).trim()}…`;
}

// PUBLIC_INTERFACE
export default function NoteItem({ note, onEdit, onDelete }) {
  /** Note card showing title + content preview, with edit/delete actions. */
  return (
    <article className="noteCard">
      <div className="noteCardHeader">
        <h3 className="noteTitle">{note.title || 'Untitled'}</h3>
        <div className="noteActions">
          <button className="btn btnGhost btnSmall" type="button" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="btn btnDanger btnSmall" type="button" onClick={() => onDelete(note)}>
            Delete
          </button>
        </div>
      </div>

      <p className="notePreview">{previewText(note.content, 140) || <span className="muted">No content</span>}</p>

      <div className="noteMeta">
        <span className="muted">Updated</span> {formatDate(note.updatedAt)}
      </div>
    </article>
  );
}
