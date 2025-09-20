// src/App.jsx
import React, { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import SearchInput from "./components/SearchInput.jsx";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Tareas</h1>
      <div className="w-full max-w-2xl">
        <SearchInput query={query} setQuery={setQuery} />
        <TaskList query={query} />
      </div>
    </div>
  );
}

export default App;
