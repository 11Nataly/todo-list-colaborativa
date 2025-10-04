//src/utils/localTaskService.js
import * as baseService from "./taskService"; // servicio del compañero (lee db.json)

const STORAGE_KEY = "local_wrapper_task_db_v1";

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

function loadRaw() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return safeDB(JSON.parse(raw));
  } catch (err) {
    console.error("localTaskService: error parseando localStorage", err);
    return null;
  }
}

function saveRaw(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDB(db)));
}

function initFromBaseIfMissing() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return false; // ya inicializado

  const usuarios = (typeof baseService.getUsuarios === "function")
    ? baseService.getUsuarios()
    : [];
  const tareas = (typeof baseService.getTareas === "function")
    ? baseService.getTareas()
    : [];

  const initial = {
    usuarios: Array.isArray(usuarios) ? usuarios : [],
    tareas: Array.isArray(tareas) ? tareas : [],
  };
  saveRaw(initial);
  return true;
}

function nextTareaId(db) {
  const max = db.tareas.reduce((acc, t) => Math.max(acc, Number(t.id) || 0), 0);
  return max + 1;
}

/* ---------- API pública ---------- */

export function initIfNeeded() {
  return initFromBaseIfMissing();
}

/**
 * getTareas(filters)
 * Filtros: usuarioId, q, fechaDesde, fechaHasta, completada, pagina(1-based), tamanioPagina, ordenarPor, orden
 * Devuelve { tareas:[], total, pagina, tamanioPagina, totalPaginas }
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

  // asegurar inicialización
  initFromBaseIfMissing();

  const db = loadRaw() || { usuarios: [], tareas: [] };
  let items = db.tareas.slice(); // clone

  // filtros
  if (typeof usuarioId !== "undefined" && usuarioId !== null && usuarioId !== "") {
    items = items.filter((t) => Number(t.usuarioId) === Number(usuarioId));
  }

  if (typeof completada !== "undefined" && completada !== null) {
    items = items.filter((t) => Boolean(t.completada) === Boolean(completada));
  }

  if (q && String(q).trim()) {
    const qLower = String(q).trim().toLowerCase();
    items = items.filter((t) =>
      (t.titulo && String(t.titulo).toLowerCase().includes(qLower)) ||
      (t.descripcion && String(t.descripcion).toLowerCase().includes(qLower)) ||
      (t.editadoPor && String(t.editadoPor).toLowerCase().includes(qLower))
    );
  }

  if (fechaDesde) {
    const from = new Date(fechaDesde).getTime();
    if (!Number.isNaN(from)) {
      items = items.filter((t) => new Date(t.fechaCreacion).getTime() >= from);
    }
  }
  if (fechaHasta) {
    const to = new Date(fechaHasta).getTime();
    if (!Number.isNaN(to)) {
      items = items.filter((t) => new Date(t.fechaCreacion).getTime() <= to);
    }
  }

  // ordenar
  items.sort((a, b) => {
    let av = a[ordenarPor];
    let bv = b[ordenarPor];

    if (ordenarPor === "fechaCreacion" || ordenarPor === "fechaEdicion") {
      av = av || "";
      bv = bv || "";
      const diff = new Date(av).getTime() - new Date(bv).getTime();
      return orden === "asc" ? diff : -diff;
    }
    av = av || "";
    bv = bv || "";
    const cmp = String(av).localeCompare(String(bv));
    return orden === "asc" ? cmp : -cmp;
  });

  const total = items.length;
  const totalPaginas = Math.max(1, Math.ceil(total / tamanioPagina));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const start = (paginaActual - 1) * tamanioPagina;
  const pageItems = items.slice(start, start + tamanioPagina);

  return { tareas: pageItems, total, pagina: paginaActual, tamanioPagina, totalPaginas };
}

/**
 * getTareaPorId(id) -> tarea | null
 */
export function getTareaPorId(id) {
  initFromBaseIfMissing();
  const db = loadRaw();
  return db.tareas.find((t) => String(t.id) === String(id)) || null;
}

/**
 * getUsuarios() -> array
 */
export function getUsuarios() {
  initFromBaseIfMissing();
  const db = loadRaw();
  return db.usuarios || [];
}

/**
 * crearTarea({ titulo, descripcion, usuarioId }) -> nueva tarea
 */
export function crearTarea({ titulo, descripcion = "", usuarioId }) {
  initFromBaseIfMissing();
  if (!titulo || typeof usuarioId === "undefined" || usuarioId === null || usuarioId === "") {
    throw new Error("crearTarea: 'titulo' y 'usuarioId' son requeridos");
  }
  const db = loadRaw();
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
  db.tareas.unshift(nueva);
  saveRaw(db);
  return nueva;
}

/**
 * actualizarTarea(id, patch) -> tarea actualizada | null
 */
export function actualizarTarea(id, patch = {}) {  // Elimina el parámetro editorId
  initFromBaseIfMissing();
  const db = loadRaw();
  const idx = db.tareas.findIndex((t) => String(t.id) === String(id));
  if (idx === -1) return null;
  const existente = db.tareas[idx];
  const actualizado = {
    ...existente,
    ...patch,
    // fechaEdicion ya viene en el patch desde App.jsx
    // editadoPor ya viene en el patch desde App.jsx
  };
  db.tareas[idx] = actualizado;
  saveRaw(db);
  return actualizado;
}

/**
 * eliminarTarea(id) -> boolean
 */
export function eliminarTarea(id) {
  initFromBaseIfMissing();
  const db = loadRaw();
  const before = db.tareas.length;
  db.tareas = db.tareas.filter((t) => String(t.id) !== String(id));
  const after = db.tareas.length;
  saveRaw(db);
  return after < before;
}

/**
 * toggleCompletada(id, editorId) -> tarea actualizada | null
 * Alterna el estado 'completada' de una tarea y actualiza la fecha de edición.
 */
export function toggleCompletada(id, editorId = null) {
  const tarea = getTareaPorId(id); // Reusa la función para obtener la tarea
  
  if (!tarea) {
    return null;
  }
  
  // Calcular el nuevo estado: invertimos el valor actual
  const nuevoEstado = !tarea.completada;
  
  // Usar la función existente actualizarTarea para aplicar el patch y guardar
  const patch = { completada: nuevoEstado };
  return actualizarTarea(id, patch, editorId); 
}

/**
 * marcarCompletada(id, completada, editorId) -> tarea actualizada | null
 */
export function marcarCompletada(id, completada = true, editorId = null) {
  return actualizarTarea(id, { completada: Boolean(completada) }, editorId);
}

/**
 * resetDB(initialData) -> sobrescribe localStorage (útil para testing/demo)
 */
export function resetDB(initialData = { usuarios: [], tareas: [] }) {
  saveRaw(initialData);
}

const localTaskService = {
  initIfNeeded,
  getTareas,
  getTareaPorId,
  getUsuarios,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  toggleCompletada,
  marcarCompletada,
  resetDB,
};

export default localTaskService;
