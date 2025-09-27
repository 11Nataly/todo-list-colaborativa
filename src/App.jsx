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
import AddTaskForm from "./components/AddTaskForm.jsx"; // formulario que crea tareas (usa localTaskService)
import localTaskService from "./utils/localTaskService"; // wrapper que inicializa desde db.json y usa localStorage

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TaskListPage() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

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

  // Manejo de creación (AddTaskForm llamará onCreated)
  const handleCreated = (nueva) => {
    // Nueva ya fue guardada en localTaskService por AddTaskForm; recargamos la lista
    reloadTareas(query);
    toast.success("✅ Tarea creada");
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


// 👇️ INICIO - Lógica de Edición del compañero Jhosep 🆕
  // Esta función es llamada por TaskList/guardarEdicion, 
  // pasando el ID y el objeto con los datos a actualizar ({ titulo, usuarioId }).
  const handleEdit = (id, datosActualizados) => { 
    try {
      // 1. Persistir el cambio en localTaskService
      const tareaActualizada = localTaskService.actualizarTarea(id, datosActualizados);

      if (tareaActualizada) {
        // 2. Actualizar el estado de React con la nueva versión de la tarea
        setTareas((prev) =>
          prev.map((t) =>
            String(t.id) === String(id)
              ? tareaActualizada // Reemplaza la tarea antigua con la actualizada
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
  // 👆️ FIN - Lógica de Edición del compañero (REEMPLAZA STUB - Líneas 114-137) 🆕


  // Búsqueda reactiva (pequeño debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadTareas(query);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Gestor de Tareas</h1>

      {/* Formulario para crear tareas (usa localTaskService internamente) */}
      <AddTaskForm usuarios={usuarios} onCreated={handleCreated} />

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
