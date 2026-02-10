import { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function Modal({ title, isOpen, onClose, children }) {
  /** Accessible modal dialog with basic focus handling and escape-to-close. */
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    // Focus the dialog container for screen readers / keyboard users.
    dialogRef.current?.focus?.();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button className="iconButton" onClick={onClose} aria-label="Close dialog" type="button">
            ✕
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
