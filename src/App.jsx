// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";

// páginas de prueba
const AdminPage = () => <h2>Panel de Admin</h2>;
const UserPage = () => <h2>Panel de Usuario</h2>;

function PrivateRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // recuperar del localStorage
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;