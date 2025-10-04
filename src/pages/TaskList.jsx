import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard.jsx";
import LogoutButton from "../components/LogoutButton.jsx";
import TaskEditForm from "../components/TaskEditForm.jsx";
import Pagination from "../components/Pagination.jsx";

const TaskList = ({ query = "", tareas = [], usuarios = [], onDelete, onEdit, onToggle, onLogout }) => {
  const [editandoId, setEditandoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const tareasPorPagina = 5;

  const tareasFiltradas = tareas.filter(
    (t) =>
      t.titulo?.toLowerCase().includes(query.toLowerCase()) ||
      (t.editadoPor && t.editadoPor.toLowerCase().includes(query.toLowerCase()))
  );

  const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);
  const inicio = (paginaActual - 1) * tareasPorPagina;
  const tareasMostradas = tareasFiltradas.slice(inicio, inicio + tareasPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [query]);

  const getUsuarioNombre = (id) => {
    const user = usuarios.find((u) => u.id === id);
    return user ? user.nombre : "Desconocido";
  };

  const guardarEdicion = (id, nuevoTitulo) => {
    const editorId = getLoggedUserId();
    if (!editorId) return;
    onEdit(id, { titulo: nuevoTitulo, editorId });
    setEditandoId(null);
  };

  return (
    <div className="space-y-4">
      {/* 👉 Botón Logout */}
      <LogoutButton onLogout={onLogout} />

      {tareasMostradas.length > 0 ? (
        tareasMostradas.map((tarea) =>
          editandoId === tarea.id ? (
            <TaskEditForm
              key={`edit-${tarea.id}`}
              tarea={tarea}
              onSave={guardarEdicion}
              onCancel={() => setEditandoId(null)}
            />
          ) : (
            <TaskCard
              key={tarea.id}
              tarea={tarea}
              usuario={getUsuarioNombre(tarea.usuarioId)}
              onDelete={onDelete}
              onToggle={onToggle}
              onEdit={() => setEditandoId(tarea.id)}
            />
          )
        )
      ) : (
        <div className="text-center text-gray-500 py-4">
          No hay tareas disponibles
        </div>
      )}

      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPageChange={setPaginaActual}
      />
    </div>
  );
};

export default TaskList;
