import NoteItem from './NoteItem';

// PUBLIC_INTERFACE
export default function NoteList({ notes, isLoading, onEdit, onDelete }) {
  /** Responsive list/grid of notes. */
  if (isLoading) {
    return (
      <section className="panel" aria-busy="true" aria-label="Loading notes">
        <div className="emptyState">
          <div className="emptyTitle">Loading…</div>
          <div className="emptySubtitle">Fetching your notes.</div>
        </div>
      </section>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <section className="panel" aria-label="No notes">
        <div className="emptyState">
          <div className="emptyTitle">No notes yet</div>
          <div className="emptySubtitle">Create your first note to get started.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="notesGrid" aria-label="Notes list">
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
}
