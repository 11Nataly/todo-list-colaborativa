// src/components/TaskCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrashIcon, PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function TaskCard({ tarea, usuarioNombre, onToggle, onEdit, onDelete }) {
  return (
    <motion.li
      key={tarea.id}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(tarea.id)}
              aria-label={tarea.completada ? "Marcar como pendiente" : "Marcar como completada"}
              className={`p-1 rounded ${tarea.completada ? "bg-green-50" : "bg-gray-100"} hover:bg-opacity-90`}
            >
              <CheckCircleIcon className={`h-6 w-6 ${tarea.completada ? "text-green-600" : "text-gray-400"}`} />
            </button>

            <h3 className={`text-lg font-medium truncate ${tarea.completada ? "line-through text-gray-400" : "text-gray-800"}`}>
              {tarea.titulo}
            </h3>
          </div>

          {tarea.descripcion ? (
            <p className="mt-2 text-sm text-gray-600 truncate">{tarea.descripcion}</p>
          ) : null}

          <p className="mt-3 text-xs text-gray-500">
            Autor: <span className="font-medium text-gray-700">{usuarioNombre || "Desconocido"}</span>
            <br />
            Creada: {tarea.fechaCreacion ? new Date(tarea.fechaCreacion).toLocaleString() : "Sin fecha"}
            {" • "}
            Editada: {tarea.fechaEdicion ? new Date(tarea.fechaEdicion).toLocaleString() : "Sin edición"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onEdit(tarea)}
            title="Editar"
            className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            <PencilIcon className="h-5 w-5" />
            <span className="text-sm">Editar</span>
          </button>

          <button
            onClick={() => onDelete(tarea.id)}
            title="Eliminar"
            className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <TrashIcon className="h-5 w-5" />
            <span className="text-sm">Eliminar</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
