import { loadJson, saveJson } from '../utils/storage';

const STORAGE_KEY = 'notes_app.v1';

function generateId() {
  // Good enough for client-only usage; can be replaced by backend IDs later.
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function getBackendUrl() {
  const url = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE;
  return url && url.trim().length > 0 ? url.trim().replace(/\/+$/, '') : '';
}

function backendConfigured() {
  return Boolean(getBackendUrl());
}

/**
 * For now, even if backend URL is configured, we default to localStorage to ensure
 * the app works without backend implementation. These stubs make it easy to switch later.
 */
async function listNotesLocal() {
  const notes = loadJson(STORAGE_KEY, []);
  return Array.isArray(notes) ? notes : [];
}

async function upsertNoteLocal(note) {
  const notes = await listNotesLocal();
  const idx = notes.findIndex((n) => n.id === note.id);

  if (idx >= 0) {
    const updated = { ...notes[idx], ...note, updatedAt: nowIso() };
    const next = [...notes.slice(0, idx), updated, ...notes.slice(idx + 1)];
    saveJson(STORAGE_KEY, next);
    return updated;
  }

  const created = {
    id: note.id || generateId(),
    title: note.title?.trim() || 'Untitled',
    content: note.content || '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  const next = [created, ...notes];
  saveJson(STORAGE_KEY, next);
  return created;
}

async function deleteNoteLocal(id) {
  const notes = await listNotesLocal();
  const next = notes.filter((n) => n.id !== id);
  saveJson(STORAGE_KEY, next);
  return { ok: true };
}

// PUBLIC_INTERFACE
export const notesService = {
  /** List notes (newest first). Defaults to localStorage persistence. */
  async listNotes() {
    // Future: if (backendConfigured()) return fetch-based listing.
    // Current: always local.
    const notes = await listNotesLocal();
    // Sort by updatedAt desc for consistent display.
    return [...notes].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  },

  /** Create a note with title/content. */
  async createNote({ title, content }) {
    // Future: if (backendConfigured()) call POST /notes
    return upsertNoteLocal({ title, content });
  },

  /** Update an existing note. */
  async updateNote(id, { title, content }) {
    // Future: if (backendConfigured()) call PUT/PATCH /notes/:id
    return upsertNoteLocal({ id, title, content });
  },

  /** Delete a note by id. */
  async deleteNote(id) {
    // Future: if (backendConfigured()) call DELETE /notes/:id
    return deleteNoteLocal(id);
  },

  /** Expose config info for UI/debugging. */
  getConfig() {
    return {
      backendUrl: getBackendUrl(),
      backendConfigured: backendConfigured(),
      storageKey: STORAGE_KEY,
    };
  },
};
