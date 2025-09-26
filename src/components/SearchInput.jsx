// src/components/SearchInput.jsx
import React from "react";

const SearchInput = ({ query, setQuery }) => {
  return (
    <input
      type="text"
      placeholder="Buscar tarea..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full p-3 mb-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchInput;
