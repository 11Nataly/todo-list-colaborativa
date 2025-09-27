// src/App.jsx
import React, { useEffect, useState } from "react";
import TaskList from "./components/TaskList.jsx";
import SearchInput from "./components/SearchInput.jsx";
import TaskModal from "./components/TaskModal.jsx";
import localTaskService from "./utils/localTaskService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reloadTareas = (q = "") => {
    try {
      const res = localTaskService.getTareas({ q });
      const items = res && Array.isArray(res.tareas) ? res.tareas : [];
      setTareas(items);
    } catch (err) {
      console.error("Error cargando tareas:", err);
      setTareas([]);
    }
  };

  const reloadUsuarios = () => {
    try {
      const u = localTaskService.getUsuarios();
      setUsuarios(Array.isArray(u) ? u : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    try {
      localTaskService.initIfNeeded();
    } catch (err) {
      console.warn("initIfNeeded error:", err);
    }
    reloadUsuarios();
    reloadTareas();
  }, []);

  const handleCreated = () => {
    reloadTareas(query);
    toast.success("✅ Tarea creada");
  };

  const handleDelete = (id) => {
    try {
      const ok = localTaskService.eliminarTarea(id);
      if (ok) {
        setTareas((prev) => prev.filter((t) => String(t.id) !== String(id)));
        toast.success("🗑️ Se eliminó la tarea correctamente");
      } else {
        toast.error("No se pudo eliminar la tarea (id no encontrado)");
      }
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      toast.error("Error eliminando la tarea");
    }
  };

  const handleToggle = (id) => {
    try {
      const tareaActualizada = localTaskService.toggleCompletada(id);
      if (tareaActualizada) {
        setTareas((prev) =>
          prev.map((t) =>
            String(t.id) === String(id) ? tareaActualizada : t
          )
        );
        toast.info(
          tareaActualizada.completada
            ? `🎉 Tarea "${tareaActualizada.titulo}" marcada como ¡Completada!`
            : `✏️ Tarea "${tareaActualizada.titulo}" marcada como pendiente.`
        );
      } else {
        toast.error("No se pudo actualizar el estado de la tarea");
      }
    } catch (err) {
      console.error("Error alternando estado:", err);
      toast.error("Error alternando el estado de la tarea");
    }
  };

  const handleEdit = (id, datosActualizados) => {
    if (!datosActualizados.editorId) {
      toast.error("No se pudo guardar la edición: Autor no identificado.");
      return;
    }

    try {
      const datosFinales = {
        titulo: datosActualizados.titulo,
        fechaEdicion: new Date().toISOString(),
        ultimaEdicionPorId: datosActualizados.editorId,
      };

      const tareaActualizada = localTaskService.actualizarTarea(id, datosFinales);

      if (tareaActualizada) {
        setTareas((prev) =>
          prev.map((t) =>
            String(t.id) === String(id) ? tareaActualizada : t
          )
        );
        toast.info(`📝 Tarea "${tareaActualizada.titulo}" guardada.`);
      } else {
        toast.error("No se pudo guardar la edición de la tarea");
      }
    } catch (err) {
      console.error("Error guardando edición:", err);
      toast.error("Error guardando la edición de la tarea.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      reloadTareas(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Gestor de Tareas</h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
        >
          + Crear Tarea
        </button>
      </div>

      <SearchInput query={query} setQuery={setQuery} />

      <TaskList
        query={query}
        tareas={tareas}
        usuarios={usuarios}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onEdit={handleEdit}
      />

      <ToastContainer position="top-right" autoClose={2000} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleCreated}
      />
    </div>
  );
}

export default App;
