// src/utils/taskService.js
import data from "../db/db.json";

// Obtener todas las tareas
export function getTareas() {
  return data.tareas || [];
}

// Obtener todas las tareas de un usuario
export function getTareasPorUsuario(usuarioId) {
  return data.tareas.filter((t) => t.usuarioId === usuarioId);
}

// Obtener usuarios
export function getUsuarios() {
  return data.usuarios || [];
}
