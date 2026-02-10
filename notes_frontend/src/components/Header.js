// PUBLIC_INTERFACE
export default function Header({ noteCount, onNewNote }) {
  /** App header with title and primary CTA. */
  return (
    <header className="header">
      <div className="headerInner">
        <div className="brand">
          <div className="brandTitle">Notes</div>
          <div className="brandMeta" aria-label="note count">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </div>
        </div>

        <div className="headerActions">
          <button className="btn btnPrimary" onClick={onNewNote} type="button">
            New note
          </button>
        </div>
      </div>
    </header>
  );
}
