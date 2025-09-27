// src/index.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx"; // ahora solo la UI de tareas
import LoginPage from "./pages/LoginPage.jsx";
import "./index.css";

// Simulamos PrivateRoute aquí
function PrivateRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.rol)) return <Navigate to="/tasks" />;
  return children;
}

const AdminPage = () => <h2>Panel de Admin</h2>;
const UserPage = () => <App />; // o un alias si renombras App a TaskListPage

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
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
      <Route path="/tasks" element={<App />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

