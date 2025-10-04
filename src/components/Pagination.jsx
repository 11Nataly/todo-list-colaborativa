import React from "react";

const Pagination = ({ paginaActual, totalPaginas, onPageChange }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(paginaActual - 1, 1))}
        disabled={paginaActual === 1}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        onClick={() => onPageChange(Math.min(paginaActual + 1, totalPaginas))}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
