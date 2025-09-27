import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard.jsx"; // Usamos el TaskCard con motion.li

const TaskList = ({
  query = "",
  tareas = [],
  usuarios = [],
  onDelete,
  onEdit,
  onToggle,
  onLogout, // 👈 añadimos prop para logout
}) => {
  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
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
    // Aseguramos que editUsuario sea el ID o una cadena vacía si no está asignado.
    setEditUsuario(tarea.usuarioId || "");
  };

   // Función de edición que llama al onEdit del padre para GUARDAR
    const guardarEdicion = (id) => {
        if (editTitulo.trim() === "") return;

        const editorId = getLoggedUserId();

        if (!editorId) {
            console.error("No se pudo guardar la edición: Usuario no logueado.");
            return; 
        }

        // 💡 onEdit del padre recibe el nuevo título y el ID del editor.
        onEdit(id, {
            titulo: editTitulo,
            editorId: editorId, // <-- NUEVO CAMPO: ID del usuario que edita
            // Ya NO se pasa 'usuarioId', la asignación previa se mantiene
        });
        
        setEditandoId(null);
    };

  return (
    // Ya no usamos <ul>, ya que TaskCard usa <motion.li>
    <div className="space-y-4">
      {/* 🔴 Botón de logout arriba */}
      <div className="flex justify-end">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>





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
                                    className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Editar título"
                                />

                                {/* ❌ ELIMINADO: Ya no se puede cambiar el usuario asignado */}
                                {/*
                                <select ...>
                                    <option value="">-- Seleccionar usuario --</option>
                                    {usuarios.map((u) => (...))}
                                </select>
                                */}

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
