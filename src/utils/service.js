// src/utils/taskService.js

const STORAGE_KEY = "task_manager_db_v1";

/* ---------- Helpers ---------- */
function nowISO() {
  return new Date().toISOString();
}

function safeDB(db) {
  db = db || {};
  db.usuarios = Array.isArray(db.usuarios) ? db.usuarios : [];
  db.tareas = Array.isArray(db.tareas) ? db.tareas : [];
  return db;
}

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

/* ---------- LocalStorage read/write ---------- */
export function cargarDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = { usuarios: [], tareas: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    return safeDB(parsed);
  } catch (err) {
    console.error("taskService: error parseando localStorage, reseteando DB", err);
    const fallback = { usuarios: [], tareas: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function guardarDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDB(db)));
}

/* ---------- Init / Reset ---------- */
/**
 * initDB(initialData)
 * - Si no existe DB en localStorage, guarda `initialData` (forma: {usuarios:[], tareas:[]})
 * - Retorna true si inicializó, false si ya existía.
 */
export function initDB(initialData = { usuarios: [], tareas: [] }) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    guardarDB(initialData);
    return true;
  }
  return false;
}

/**
 * resetDB(initialData)
 * - Sobrescribe la DB actual (útil para testing / demo)
 */
export function resetDB(initialData = { usuarios: [], tareas: [] }) {
  guardarDB(initialData);
}

/* ---------- Utilitarios para IDs (numéricos) ---------- */
function nextTareaId(db) {
  const max = db.tareas.reduce((acc, t) => Math.max(acc, Number(t.id) || 0), 0);
  return max + 1;
}

/* ---------- Lecturas: getTareas, getTareaPorId, getUsuarioPorId ---------- */

/**
 * getTareas(filters)
 * filters = {
 *   usuarioId?: number,
 *   q?: string,             // busca en titulo y descripcion (case-insensitive)
 *   fechaDesde?: string,    // ISO string comparado contra fechaCreacion
 *   fechaHasta?: string,    // ISO string comparado contra fechaCreacion
 *   completada?: boolean,
 *   pagina?: number,        // 1-based
 *   tamanioPagina?: number,
 *   ordenarPor?: 'fechaCreacion'|'fechaEdicion'|'titulo',
 *   orden?: 'asc'|'desc'
 * }
 *
 * Devuelve: { tareas: Tarea[], total, pagina, tamanioPagina, totalPaginas }
 */
export function getTareas(filters = {}) {
  const {
    usuarioId,
    q,
    fechaDesde,
    fechaHasta,
    completada,
    pagina = 1,
    tamanioPagina = 6,
    ordenarPor = "fechaCreacion",
    orden = "desc",
  } = filters;

  const db = cargarDB();
  let items = db.tareas ? clone(db.tareas) : [];

  // filtro por autor
  if (typeof usuarioId !== "undefined" && usuarioId !== null) {
    items = items.filter((t) => Number(t.usuarioId) === Number(usuarioId));
  }

  // filtro por completada
  if (typeof completada !== "undefined" && completada !== null) {
    items = items.filter((t) => Boolean(t.completada) === Boolean(completada));
  }

  // búsqueda (titulo y descripcion)
  if (q && String(q).trim().length > 0) {
    const qLower = String(q).trim().toLowerCase();
    items = items.filter((t) =>
      (t.titulo && String(t.titulo).toLowerCase().includes(qLower)) ||
      (t.descripcion && String(t.descripcion).toLowerCase().includes(qLower))
    );
  }

  // rango de fechas (basado en fechaCreacion)
  if (fechaDesde) {
    const fromTs = new Date(fechaDesde).getTime();
    if (!Number.isNaN(fromTs)) {
      items = items.filter((t) => new Date(t.fechaCreacion).getTime() >= fromTs);
    }
  }
  if (fechaHasta) {
    const toTs = new Date(fechaHasta).getTime();
    if (!Number.isNaN(toTs)) {
      items = items.filter((t) => new Date(t.fechaCreacion).getTime() <= toTs);
    }
  }

  // Ordenamiento
  items.sort((a, b) => {
    let av = a[ordenarPor];
    let bv = b[ordenarPor];

    // fallback: si ordenarPor es fecha y hay undefined, usar fechaCreacion/'' por comparacion segura
    if (ordenarPor === "fechaCreacion" || ordenarPor === "fechaEdicion") {
      av = av || "";
      bv = bv || "";
      const diff = new Date(av).getTime() - new Date(bv).getTime();
      return orden === "asc" ? diff : -diff;
    }

    // string comparison
    av = av || "";
    bv = bv || "";
    const cmp = String(av).localeCompare(String(bv));
    return orden === "asc" ? cmp : -cmp;
  });

  const total = items.length;
  const totalPaginas = Math.max(1, Math.ceil(total / tamanioPagina));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const start = (paginaActual - 1) * tamanioPagina;
  const end = start + tamanioPagina;
  const pageItems = items.slice(start, end);

  return {
    tareas: pageItems,
    total,
    pagina: paginaActual,
    tamanioPagina,
    totalPaginas,
  };
}

/**
 * getTareaPorId(id) => Tarea | null
 */
export function getTareaPorId(id) {
  const db = cargarDB();
  return db.tareas.find((t) => Number(t.id) === Number(id)) || null;
}

/**
 * getUsuarioPorId(id) => Usuario | null
 */
export function getUsuarioPorId(id) {
  const db = cargarDB();
  return db.usuarios.find((u) => Number(u.id) === Number(id)) || null;
}

/* ---------- Mutaciones: crear, actualizar, eliminar, marcarCompletada ---------- */

/**
 * crearTarea({ titulo, descripcion = "", usuarioId })
 * - Asigna id numérico (maxId + 1)
 * - fechaCreacion y fechaEdicion = now
 * - completada = false
 * - editadoPor = null
 * Retorna la tarea creada.
 */
export function crearTarea({ titulo, descripcion = "", usuarioId }) {
  if (!titulo || typeof usuarioId === "undefined" || usuarioId === null) {
    throw new Error("crearTarea: se requieren 'titulo' y 'usuarioId'");
  }
  const db = cargarDB();
  const id = nextTareaId(db);
  const now = nowISO();
  const nueva = {
    id: Number(id),
    titulo: String(titulo),
    descripcion: String(descripcion || ""),
    usuarioId: Number(usuarioId),
    completada: false,
    fechaCreacion: now,
    fechaEdicion: now,
    editadoPor: null,
  };
  db.tareas.unshift(nueva); // aparece al inicio
  guardarDB(db);
  return clone(nueva);
}

/**
 * actualizarTarea(id, patch, editorId?)
 * patch puede contener: { titulo?, descripcion?, completada?, usuarioId? }
 * Actualiza fechaEdicion y editadoPor (si editorId dado).
 * Retorna tarea actualizada o null si no existe.
 */
export function actualizarTarea(id, patch = {}, editorId = null) {
  const db = cargarDB();
  const idx = db.tareas.findIndex((t) => Number(t.id) === Number(id));
  if (idx === -1) return null;

  const existente = db.tareas[idx];
  const actualizado = {
    ...existente,
    ...patch,
    fechaEdicion: nowISO(),
    editadoPor: editorId !== null && typeof editorId !== "undefined" ? Number(editorId) : existente.editadoPor,
  };
  db.tareas[idx] = actualizado;
  guardarDB(db);
  return clone(actualizado);
}

/**
 * eliminarTarea(id) => boolean
 */
export function eliminarTarea(id) {
  const db = cargarDB();
  const before = db.tareas.length;
  db.tareas = db.tareas.filter((t) => Number(t.id) !== Number(id));
  const after = db.tareas.length;
  guardarDB(db);
  return after < before;
}

/**
 * marcarCompletada(id, completada, editorId?)
 * - Llama internamente a actualizarTarea con { completada }
 * - Retorna tarea actualizada o null si no existe.
 */
export function marcarCompletada(id, completada = true, editorId = null) {
  return actualizarTarea(id, { completada: Boolean(completada) }, editorId);
}

/* ---------- Export default (objeto) ---------- */
const taskService = {
  STORAGE_KEY,
  cargarDB,
  guardarDB,
  initDB,
  resetDB,
  getTareas,
  getTareaPorId,
  getUsuarioPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  marcarCompletada,
  // helpers
  nowISO,
};

export default taskService;