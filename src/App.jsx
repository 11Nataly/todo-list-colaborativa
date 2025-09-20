// src/App.jsx - VERSIÓN FUSIONADA
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EditTaskModal from "./components/EditTaskModal.jsx";
import LoginPage from "./LoginPage";
import SearchInput from "./components/SearchInput.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTareas, getUsuarios } from "./utils/taskService.js";
import {
  actualizarTarea,
  cargarDB,
} from "./utils/taskService";



// Componente de Lista de Tareas (tu funcionalidad original)
function TaskListPage() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  //se debe unificar
  // useEffect(() => {
  //   setTareas(getTareas());
  //   setUsuarios(getUsuarios());
  // }, []);

  // 👉 función para eliminar
  const handleDelete = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };
  
  useEffect(() => {
  const db = cargarDB();
  setUsuarios(db.usuarios || []);
  setTareas(getTareas() || []);
}, []);

  const handleEdit = (tarea) => {
    setTareaEditando(tarea);
    setIsModalOpen(true);
  };

  const handleSaveEdit = ({ titulo, descripcion }) => {
  if (!tareaEditando) return;
  actualizarTarea(tareaEditando.id, { titulo, descripcion }, tareaEditando.usuarioId);
  setTareas(getTareas()); 
  setIsModalOpen(false);
  setTareaEditando(null);
};

  return (
    <div className="max-w-3xl mx-auto p-5">
      <SearchInput query={query} setQuery={setQuery} />
      <TaskList
        query={query}
        tareas={tareas}
        usuarios={usuarios}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
       <EditTaskModal
          tarea={tareaEditando}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEdit}
        />

    </div>
  );
}

// Ruta privada (de tu compañero)
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
    return <Navigate to="/login" />;
  }
  return children;
}

// Páginas
const AdminPage = () => <h2>Panel de Admin</h2>;
const UserPage = () => <TaskListPage />; // ¡AQUÍ INTEGRAMOS TU LISTA DE TAREAS!

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