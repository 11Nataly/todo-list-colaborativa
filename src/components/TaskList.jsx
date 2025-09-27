import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard.jsx";

const TaskList = ({
  query = "",
  tareas = [],
  usuarios = [],
  onDelete,
  onEdit,
  onToggle,
}) => {
  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editUsuario, setEditUsuario] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const tareasPorPagina = 5;

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(
    (t) =>
      t.titulo?.toLowerCase().includes(query.toLowerCase()) ||
      (t.editadoPor &&
        t.editadoPor.toLowerCase().includes(query.toLowerCase()))
  );

  // Total de páginas
  const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

  // Cortar tareas para la página actual
  const inicio = (paginaActual - 1) * tareasPorPagina;
  const tareasMostradas = tareasFiltradas.slice(inicio, inicio + tareasPorPagina);

  // Resetear a la página 1 cuando cambie la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [query]);

  const getUsuarioNombre = (id) => {
    const user = usuarios.find((u) => u.id === id);
    return user ? user.nombre : "Desconocido";
  };

  const startEditMode = (tarea) => {
    setEditandoId(tarea.id);
    setEditTitulo(tarea.titulo || "");
    setEditUsuario(tarea.usuarioId ? String(tarea.usuarioId) : "");
  };

  const guardarEdicion = (id) => {
    if (editTitulo.trim() === "") return;
    onEdit(id, {
      titulo: editTitulo,
      usuarioId: editUsuario ? Number(editUsuario) : null,
    });
    setEditandoId(null);
  };

  return (
    <div className="space-y-4">
      {tareasMostradas.length > 0 ? (
        tareasMostradas.map((tarea) => (
          <React.Fragment key={tarea.id}>
            {editandoId === tarea.id ? (
              <div
                key={`edit-${tarea.id}`}
                className="p-4 bg-gray-50 rounded-lg shadow-inner border-l-4 border-yellow-500"
              >
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2"
                  placeholder="Editar título"
                  autoFocus
                />
                <select
                  value={editUsuario}
                  onChange={(e) => setEditUsuario(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2"
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
                    className="flex-1 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="flex-1 px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <TaskCard
                tarea={tarea}
                usuario={getUsuarioNombre(tarea.usuarioId)}
                onDelete={onDelete}
                onToggle={onToggle}
                onEdit={startEditMode}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          No hay tareas disponibles
        </div>
      )}

      {/* Botones de paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;