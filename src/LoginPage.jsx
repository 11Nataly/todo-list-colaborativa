// src/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
const res = await fetch("http://localhost:3000/usuarios");
      const users = await res.json();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError("Credenciales incorrectas");
        return;
      }

      // guardar en localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess("Ingreso correcto. Redirigiendo...");

      setTimeout(() => {
        if (user.rol === "admin") {
          navigate("/tasks");
        } else {
          navigate("/tasks");
        }
      }, 1500);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "12px", width: "300px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#1e3a8a", textAlign: "center" }}>Login</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.7rem", background: "#1e40af", color: "white", border: "none", borderRadius: "8px" }}>
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
