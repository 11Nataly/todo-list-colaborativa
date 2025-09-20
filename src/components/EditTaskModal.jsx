// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from "react";

const EditTaskModal = ({ tarea, isOpen, onClose, onSave }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // cargar datos iniciales
  useEffect(() => {
    if (tarea) {
      setTitulo(tarea.titulo || "");
      setDescripcion(tarea.descripcion || "");
    }
  }, [tarea]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Tarea</h2>

        <label className="block mb-2 text-sm font-medium">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ titulo, descripcion })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
