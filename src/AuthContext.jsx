import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(
        `http://localhost:3001/usuarios?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (data.length === 0) {
        return { success: false, message: "Email o contraseña incorrectos" };
      }

      const usuario = data[0];
      const session = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      };

      localStorage.setItem("currentUser", JSON.stringify(session));
      setUser(session);
      return { success: true, rol: usuario.rol };
    } catch (error) {
      return { success: false, message: "Error al conectar con servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);