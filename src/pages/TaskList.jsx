// src/pages/TaskList.jsx
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

  // Función para obtener el nombre del usuario logueado desde localStorage
  const getLoggedUserName = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.nombre || user.username || "Usuario"; // Diferentes posibles campos de nombre
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo usuario del localStorage:", error);
      return null;
    }
  };

  const guardarEdicion = (id, nuevoTitulo) => {
    const editorNombre = getLoggedUserName();
    
    if (!editorNombre) {
      console.error("No se pudo obtener el usuario logueado");
      return;
    }
    
    // Solo pasamos el nombre del editor, no el ID
    onEdit(id, { 
      titulo: nuevoTitulo, 
      editorNombre: editorNombre
    });
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