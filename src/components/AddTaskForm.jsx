// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import taskService from "../utils/taskService"; // tu service (crearTarea etc.)
import { toast } from "react-toastify";

export default function AddTaskForm({ usuarios = [], onCreated }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState(usuarios.length ? usuarios[0].id : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }
    if (!usuarioId) {
      toast.error("Selecciona un usuario");
      return;
    }

    // crear la tarea en el service (persistencia)
    const nueva = taskService.crearTarea({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      usuarioId: Number(usuarioId),
    });

    // notificar y pasar al padre
    toast.success("✅ Tarea creada correctamente");
    setTitulo("");
    setDescripcion("");
    if (onCreated) onCreated(nueva);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 gap-2">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título de la tarea"
        className="border p-2 rounded w-full"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        className="border p-2 rounded w-full"
        rows={2}
      />
      <div className="flex gap-2 items-center">
        <select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          <option value="">Asignar a...</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </div>
    </form>
  );
}
