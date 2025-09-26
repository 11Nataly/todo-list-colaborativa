// src/components/TaskList.jsx
import React from "react";
import TaskCard from "./TaskCard";

const TaskList = ({ query, tareas, usuarios, onDelete, onToggle, onEdit }) => {
  // Filtrar tareas por búsqueda 
  const tareasFiltradas = tareas.filter((t) =>
    (t.titulo.toLowerCase().includes(query.toLowerCase())) ||
    (t.editadoPor && t.editadoPor.toLowerCase().includes(query.toLowerCase())) ||
    (t.descripcion && t.descripcion.toLowerCase().includes(query.toLowerCase()))
  );

  const getUsuarioNombre = (id) => {
    const user = usuarios.find((u) => u.id === id);
    return user ? user.nombre : "Desconocido";
  };

  return (
    <ul className="space-y-4">
      {tareasFiltradas.length > 0 ? (
        tareasFiltradas.map((tarea) => (
          <TaskCard
            key={tarea.id}
            tarea={tarea}
            usuario={getUsuarioNombre(tarea.usuarioId)}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        ))
      ) : (
        <li className="text-center text-gray-500 py-4">
          No hay tareas disponibles
        </li>
      )}
    </ul>
  );
};

export default TaskList;
