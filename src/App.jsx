// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./LoginPage";
import TaskList from "./components/TaskList.jsx";
import SearchInput from "./components/SearchInput.jsx";
import TaskModal from "./components/TaskModal.jsx"; // NUEVO: Componente Modal para crear tareas
import localTaskService from "./utils/localTaskService"; // wrapper que inicializa desde db.json y usa localStorage

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TaskListPage() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // 💡 NUEVO ESTADO: Controla la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Cargar/recargar tareas desde localTaskService (extrae .tareas del resultado)
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

  

  // inicializar wrapper y datos al montar
  useEffect(() => {
    try {
      localTaskService.initIfNeeded();
    } catch (err) {
      console.warn("initIfNeeded error (puede ser ignorable):", err);
    }
    reloadUsuarios();
    reloadTareas();
  }, []);

  //--------------
  //MANEJOS
  //--------------

  // Manejo de creación (AddTaskForm llamará onCreated)
  const handleCreated = (nueva) => {
    // Nueva ya fue guardada en localTaskService por AddTaskForm; recargamos la lista
    reloadTareas(query);
    toast.success("✅ Tarea creada");
    // 💡 Ya no es necesario cerrar el modal aquí, TaskModal lo hace.
  };

  // Manejo de eliminar (llamado por TaskList -> TaskCard via onDelete)
  const handleDelete = (id) => {
    try {
      const ok = localTaskService.eliminarTarea(id);
      if (ok) {
        // Actualizamos estado local inmediatamente
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

  // --- NUEVO: Manejo de alternar estado (Completada/Pendiente) con Toastify ---
  const handleToggle = (id) => {
    try {
      // Asumimos que localTaskService tiene una función que alterna el estado y devuelve la tarea actualizada
      const tareaActualizada = localTaskService.toggleCompletada(id); 
      
      if (tareaActualizada) {
        // Actualizamos estado local inmediatamente usando la tarea devuelta
        setTareas((prev) => prev.map((t) => (String(t.id) === String(id) ? tareaActualizada : t)));
        
        // Uso de Toastify para mensaje de confirmación
        toast.info(
          tareaActualizada.completada 
            ? `🎉 Tarea "${tareaActualizada.titulo}" marcada como ¡Completada!` 
            : `✏️ Tarea "${tareaActualizada.titulo}" marcada como pendiente.`
        );
      } else {
        toast.error("No se pudo actualizar el estado de la tarea (ID no encontrado)");
      }
    } catch (err) {
      console.error("Error alternando estado:", err);
      toast.error("Error alternando el estado de la tarea");
    }
  };


// 👇️ Lógica de Edición MODIFICADA 🆕
  // Ahora recibe {titulo, editorId} y NO usuarioId (asignado)
  const handleEdit = (id, datosActualizados) => { 
    
    // Validar que el editorId llegó de TaskList.jsx
    if (!datosActualizados.editorId) {
        toast.error("No se pudo guardar la edición: Autor no identificado.");
        return;
    }

    try {
      // 1. Preparamos los datos para persistir: 
      const datosFinales = {
        titulo: datosActualizados.titulo,
        fechaEdicion: new Date().toISOString(), // Añadir timestamp de edición
        ultimaEdicionPorId: datosActualizados.editorId // Guardamos el ID del editor logueado
        // Importante: Al no pasar 'usuarioId' aquí, confiamos en que 
        // localTaskService.actualizarTarea PRESERVE la asignación previa.
      };

      // 2. Persistir el cambio en localTaskService
      const tareaActualizada = localTaskService.actualizarTarea(id, datosFinales);

      if (tareaActualizada) {
        // 3. Actualizar el estado de React
        setTareas((prev) =>
          prev.map((t) =>
            String(t.id) === String(id)
              ? tareaActualizada 
              : t
          )
        );
        toast.info(`📝 Tarea "${tareaActualizada.titulo}" guardada.`); // Notificación
      } else {
        toast.error("No se pudo guardar la edición de la tarea (ID no encontrado).");
      }
    } catch (err) {
      console.error("Error guardando edición:", err);
      toast.error("Error guardando la edición de la tarea.");
    }
  };
// 👆️ FIN - Lógica de Edición MODIFICADA


  // Búsqueda reactiva (pequeño debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadTareas(query);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);


  //--------
  // RETURN
  //-------


    return (
      <div className="max-w-3xl mx-auto p-5">
        <h1 className="text-2xl font-bold mb-4">Gestor de Tareas</h1>

        {/* Formulario para crear tareas (usa localTaskService internamente) */}

      {/* 💡 EL BOTÓN QUE ABRE EL MODAL */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
        >
          + Crear Tarea
        </button>
      </div>

        {/* Buscador */}
        <SearchInput query={query} setQuery={setQuery} />

        {/* Lista (tu TaskList actual) */}
        <TaskList
          query={query}
          tareas={tareas}
          usuarios={usuarios}
          onDelete={handleDelete} // mantiene la API que tu TaskList espera
          onToggle={handleToggle} // <-- CONECTADO: Ahora maneja el toggle con Toastify
          onEdit={handleEdit} 
        />

        <ToastContainer position="top-right" autoClose={2000} />

        {/* 💡 EL COMPONENTE MODAL */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Función para cerrar el modal
        onTaskCreated={handleCreated} // La función original para recargar la lista
      />
      </div>
    );
  }


// PrivateRoute dejamos igual que antes (no tocamos login ni su lógica)
function PrivateRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/tasks" />;
  }
  return children;
}

// Páginas (sin cambios)
const AdminPage = () => <h2>Panel de Admin</h2>;
const UserPage = () => <TaskListPage />; // integrando tu TaskListPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRoles={["user", "admin"]}>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route path="/tasks" element={<TaskListPage />} /> {/* Ruta directa opcional */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
