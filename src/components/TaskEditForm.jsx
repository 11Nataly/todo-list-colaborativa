import React, { useState } from "react";

const TaskEditForm = ({ tarea, onSave, onCancel }) => {
  const [editTitulo, setEditTitulo] = useState(tarea.titulo || "");

  const handleSave = () => {
    if (editTitulo.trim() === "") return;
    onSave(tarea.id, editTitulo);
  };

  return (
    <div
      className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-yellow-500"
    >
      <input
        type="text"
        value={editTitulo}
        onChange={(e) => setEditTitulo(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Editar título"
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium shadow-md"
        >
          Guardar Cambios
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-medium shadow-md"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default TaskEditForm;
