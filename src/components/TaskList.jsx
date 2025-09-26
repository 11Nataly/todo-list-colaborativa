import React, { useState } from "react";
import TaskCard from "./TaskCard.jsx"; // Usamos el TaskCard con motion.li

// Añadimos 'onToggle' a los props para alternar el estado
const TaskList = ({ query, tareas, usuarios, onDelete, onEdit, onToggle }) => {
  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editUsuario, setEditUsuario] = useState("");

  const tareasFiltradas = tareas.filter(
    (t) =>
      t.titulo.toLowerCase().includes(query.toLowerCase()) ||
      (t.editadoPor &&
        t.editadoPor.toLowerCase().includes(query.toLowerCase()))
  );

  const getUsuarioNombre = (id) => {
    const user = usuarios.find((u) => u.id === id);
    return user ? user.nombre : "Desconocido";
  };
  
  // Esta función se pasa a TaskCard como prop 'onEdit' para iniciar el modo edición.
  const startEditMode = (tarea) => {
    setEditandoId(tarea.id);
    setEditTitulo(tarea.titulo);
    // Aseguramos que editUsuario sea el ID o una cadena vacía si no está asignado.
    setEditUsuario(tarea.usuarioId || "");
  };

  // Función de edición (Lógica original de tu compañero) que llama al onEdit del padre para GUARDAR
  const guardarEdicion = (id) => {
    if (editTitulo.trim() === "") return;
    // onEdit del padre maneja la actualización del estado y la persistencia
    onEdit(id, {
      titulo: editTitulo,
      usuarioId: editUsuario ? Number(editUsuario) : null,
      // La fechaEdicion se gestionará en App.jsx/localTaskService
    });
    setEditandoId(null);
  };

  return (
    // Ya no usamos <ul>, ya que TaskCard usa <motion.li>
    <div className="space-y-4">
      {tareasFiltradas.length > 0 ? (
        tareasFiltradas.map((tarea) => (
          <React.Fragment key={tarea.id}>
            {editandoId === tarea.id ? (
              // --- Modo Edición (Inputs y botones) ---
              <div
                key={`edit-${tarea.id}`}
                className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-yellow-500"
              >
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Editar título"
                />

                <select
                  value={editUsuario}
                  onChange={(e) => setEditUsuario(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">-- Seleccionar usuario --</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => guardarEdicion(tarea.id)}
                    className="flex-1 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium shadow-md"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="flex-1 px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-medium shadow-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // --- Modo Visualización (Usando TaskCard) ---
              <TaskCard
                tarea={tarea}
                usuario={getUsuarioNombre(tarea.usuarioId)} // TaskCard espera 'usuario'
                onDelete={onDelete}
                onToggle={onToggle} 
                onEdit={startEditMode} // onEdit de TaskCard ahora inicia el modo de edición
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          No hay tareas disponibles
        </div>
      )}
    </div>
  );
};

export default TaskList;
