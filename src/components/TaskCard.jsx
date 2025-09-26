// src/components/TaskCard.jsx
import React from "react";

const TaskCard = ({ tarea, usuario, onDelete }) => {
  return (
    <li
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
        <span className="font-medium">{usuario || "Desconocido"}</span>
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

      {/* Botón eliminar */}
      <button
        onClick={() => onDelete(tarea.id)}
        className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Eliminar
      </button>
    </li>
  );
};

export default TaskCard;
