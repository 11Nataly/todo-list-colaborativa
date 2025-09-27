// src/components/AddTaskForm.jsx
import React, { useEffect, useState } from "react";
import localTaskService from "../../src/utils/localTaskService";
import { toast } from "react-toastify";

export default function AddTaskForm({ usuarios = [], onCreated }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  useEffect(() => {
    // inicializa wrapper si hace falta
    localTaskService.initIfNeeded();
    // setear usuario por defecto si existen usuarios
    if (usuarios && usuarios.length > 0 && !usuarioId) {
      setUsuarioId(String(usuarios[0].id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarios]);

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

    try {
      const nueva = localTaskService.crearTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        usuarioId: Number(usuarioId),
      });

      toast.success("✅ Tarea creada correctamente");
      setTitulo("");
      setDescripcion("");
      if (onCreated) onCreated(nueva);
    } catch (err) {
      console.error("Error creando tarea:", err);
      toast.error("No se pudo crear la tarea");
    }
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
