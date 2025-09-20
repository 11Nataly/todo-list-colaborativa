// src/App.jsx - VERSIÓN FUSIONADA
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

// Componente de Lista de Tareas (tu funcionalidad original)
function TaskListPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col items-center py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Tareas</h1>
      <div className="w-full max-w-2xl">
        <SearchInput query={query} setQuery={setQuery} />
        <TaskList query={query} />
      </div>
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