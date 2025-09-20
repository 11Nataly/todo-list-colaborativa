// src/components/TaskList.jsx
import React from "react";

const TaskList = ({ query, tareas, usuarios, onDelete, onEdit }) => {
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
          <li
            key={tarea.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {tarea.titulo}
              </h2>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  tarea.completada
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {tarea.completada ? "Completada" : "Pendiente"}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Asignada a:{" "}
              <span className="font-medium">
                {getUsuarioNombre(tarea.usuarioId)}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Creada:{" "}
              {tarea.fechaCreacion
                ? new Date(tarea.fechaCreacion).toLocaleString()
                : "Sin fecha"}{" "}
              <br />
              Editada:{" "}
              {tarea.fechaEdicion
                ? new Date(tarea.fechaEdicion).toLocaleString()
                : "Sin edición"}
            </p>

            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => onEdit(tarea)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(tarea.id)}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>

              <button
  onClick={() => onEdit(tarea)}
  className="mt-3 ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
>
  Editar
</button>

            </div>
          </li>
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
