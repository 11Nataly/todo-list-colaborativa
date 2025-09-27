// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import localTaskService from "../utils/localTaskService";
import { toast } from "react-toastify";

// 💡 Nueva prop 'isModal' para cambiar el diseño
export default function AddTaskForm({ onCreated, isModal = false }) { 
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ... (getLoggedUserId y handleSubmit son iguales, no las repito) ...
  const getLoggedUserId = () => {
    // ... (misma lógica) ...
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const autorId = getLoggedUserId();

    if (!titulo.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    if (!autorId) {
      toast.error("🚨 Error: Debes iniciar sesión para crear tareas.");
      return;
    }

    try {
      const nueva = localTaskService.crearTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        usuarioId: autorId, 
      });

      toast.success("✅ Tarea creada correctamente");
      setTitulo("");
      setDescripcion("");
      setDescripcion(""); 
      
      // 💡 onCreated ahora es manejado por TaskModal, que lo llama y cierra el modal
      if (onCreated) onCreated(nueva); 
      
    } catch (err) {
      console.error("Error creando tarea:", err);
      toast.error("No se pudo crear la tarea");
    }
  };

  // 💡 Si NO estamos en un modal, mostramos el botón de crear junto al formulario.
  // 💡 Si SÍ estamos en un modal, solo mostramos el formulario sin botón, 
  //    ya que el modal lo proveerá.
  const formClass = isModal ? "grid grid-cols-1 gap-4" : "mb-4 grid grid-cols-1 gap-2";

  return (
    <form onSubmit={handleSubmit} className={formClass}>
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
      
      {/* 💡 Condicional: Muestra el botón de crear SÓLO si NO está en el modal */}
      {!isModal && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear Tarea
          </button>
        </div>
      )}
      
      {/* 💡 Si está en el modal, el botón de 'Guardar' será el botón de 'Cancelar' del Modal.
          Para que el modal funcione correctamente, el botón de submit DEBE estar 
          dentro del <form> si el botón Guardar del modal es 'submit'.
          En este caso, usaremos el botón de 'Guardar' del Modal.
      */}
      {isModal && (
        <button
          type="submit" // Este botón activa el handleSubmit del formulario
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2 self-end"
        >
          Guardar
        </button>
      )}
    </form>
  );
}