import React, { useState } from "react";
import localTaskService from "../utils/localTaskService";
import { toast } from "react-toastify";

// Ya no necesitamos recibir 'usuarios' como prop, ya que el autor se toma del localStorage.
// La prop 'usuarios' ahora es innecesaria, pero la dejamos para no romper App.jsx si no la quitas de allí.
export default function AddTaskForm({ onCreated }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // NO necesitamos usuarioId en el estado ni el useEffect para inicializarlo

  // Función auxiliar para obtener el ID del usuario logueado de localStorage
  const getLoggedUserId = () => {
    try {
      // 1. Obtener la cadena de texto del usuario guardado
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        // 2. Parsear a objeto
        const user = JSON.parse(storedUser);
        // 3. Devolver el ID (asegúrate de que sea un número o que el servicio lo maneje)
        return user ? Number(user.id) : null;
      }
    } catch (e) {
      console.error("Error al leer el usuario de localStorage:", e);
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const autorId = getLoggedUserId();

    if (!titulo.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    // 💡 Validación clave: Asegurarse de que hay un usuario logueado
    if (!autorId) {
      toast.error("🚨 Error: Debes iniciar sesión para crear tareas.");
      return;
    }

    try {
      const nueva = localTaskService.crearTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        // 💡 Usamos el ID del usuario logueado como autor
        usuarioId: autorId, 
      });

      toast.success("✅ Tarea creada correctamente");
      setTitulo("");
      setDescripcion("");
      // Opcional: limpiar la descripción si la tarea se creó
      setDescripcion(""); 
      
      if (onCreated) onCreated(nueva);
    } catch (err) {
      console.error("Error creando tarea:", err);
      toast.error("No se pudo crear la tarea");
    }
  };

  return (
    // Hemos eliminado el 'select' de usuario del formulario
    <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 gap-2">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título de la tarea"
        className="border p-2 rounded w-full"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        className="border p-2 rounded w-full"
        rows={2}
      />
      <div className="flex justify-end"> {/* Ajustamos el diseño */}
        {/* Eliminamos el select de usuarios */}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear Tarea
        </button>
      </div>
    </form>
  );
}