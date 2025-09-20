import React, { useEffect, useState } from "react";
import { getTareas } from "../utils/service";

const TaskList = () => {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    // Cargar todas las tareas al montar el componente
    const tareasGuardadas = getTareas();
    setTareas(tareasGuardadas);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Tareas</h2>
      <ul className="space-y-2">
        {tareas.map((tarea) => (
          <li
            key={tarea.id}
            className="p-2 border rounded bg-white shadow-sm flex justify-between"
          >
            <div>
              <p className="font-medium">{tarea.titulo}</p>
              <p className="text-sm text-gray-500">
                Autor ID: {tarea.usuarioId}
              </p>
              <p className="text-xs text-gray-400">
                Creación: {new Date(tarea.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
            <div>
              <input type="checkbox" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
