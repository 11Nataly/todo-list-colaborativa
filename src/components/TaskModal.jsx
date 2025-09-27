// src/components/TaskModal.jsx
import React from 'react';
import AddTaskForm from './AddTaskForm'; // Asumimos que AddTaskForm está en el mismo directorio

/**
 * Componente Modal para la creación de tareas.
 * * @param {boolean} isOpen - Controla si el modal está visible.
 * @param {function} onClose - Función a llamar para cerrar el modal.
 * @param {function} onTaskCreated - Función a llamar después de que una tarea se crea exitosamente.
 */
export default function TaskModal({ isOpen, onClose, onTaskCreated }) {
  if (!isOpen) return null;

  // Manejador para cuando la tarea se crea exitosamente.
  // Llama a la función original de creación y luego cierra el modal.
  const handleCreatedAndClose = (nuevaTarea) => {
    onTaskCreated(nuevaTarea); // Llama a la función original (para recargar lista y mostrar toast)
    onClose(); // Cierra el modal
  };

  return (
    // Fondo oscuro (Overlay)
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      
      {/* Contenedor del Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100">
        
        <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h2>
        
        {/*
          IMPORTANTE: Pasamos la prop onCreated al formulario. 
          AddTaskForm usará esta función (a través de handleCreatedAndClose) para
          notificar a TaskListPage y cerrar el modal.
        */}
        <AddTaskForm onCreated={handleCreatedAndClose} isModal={true} />
        
        {/* Botón de Cancelar */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-150"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}