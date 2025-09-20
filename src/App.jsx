// src/App.jsx
import React, { useState, useEffect } from "react";
import SearchInput from "./components/SearchInput.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTareas, getUsuarios } from "./utils/taskService.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setTareas(getTareas());
    setUsuarios(getUsuarios());
  }, []);

  // 👉 función para eliminar
  const handleDelete = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <SearchInput query={query} setQuery={setQuery} />
      <TaskList
        query={query}
        tareas={tareas}
        usuarios={usuarios}
        onDelete={handleDelete}
      />
    </div>
  );
}
