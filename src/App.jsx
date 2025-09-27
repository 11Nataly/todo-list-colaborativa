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
import AddTaskForm from "./components/AddTaskForm.jsx";
import localTaskService from "./utils/localTaskService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TaskListPage() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // 👉 Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // borra la sesión
    window.location.href = "/login"; // redirige al login
  };

  // Cargar/recargar tareas desde localTaskService
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

  const handleCreated = (nueva) => {
    setTareas((prev) => [...prev, nueva]);
    toast.success("✅ Tarea creada");
  };

  const handleDelete = (id) => {
    try {
      const ok = localTaskService.eliminarTarea(id);
      if (ok) {
        setTareas((prev) => prev.filter((t) => String(t.id) !== String(id)));
        toast.success("🗑️ Se eliminó la tarea correctamente");
      } else {
        toast.error("No se pudo eliminar la tarea");
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
        toast.error("No se pudo actualizar la tarea");
      }
    } catch (err) {
      console.error("Error alternando tarea:", err);
      toast.error("Error alternando la tarea");
    }
  };

  const handleEdit = (id, datosActualizados) => {
    try {
      const tareaActualizada = localTaskService.actualizarTarea(
        id,
        datosActualizados
      );
      if (tareaActualizada) {
        setTareas((prev) =>
          prev.map((t) =>
            String(t.id) === String(id) ? tareaActualizada : t
          )
        );
        toast.info(`📝 Tarea "${tareaActualizada.titulo}" guardada.`);
      } else {
        toast.error("No se pudo guardar la edición.");
      }
    } catch (err) {
      console.error("Error editando tarea:", err);
      toast.error("Error editando la tarea.");
    }
  };

  // Búsqueda reactiva
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadTareas(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
        {/* 👉 Botón Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <AddTaskForm usuarios={usuarios} onCreated={handleCreated} />
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
    </div>
  );
}


function PrivateRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <Navigate to="/LoginPage" />;
  }
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/tasks" />;
  }
  return children;
}

const AdminPage = () => <h2>Panel de Admin</h2>;
const UserPage = () => <TaskListPage />;

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
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
