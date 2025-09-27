import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../src/components/TaskCard";

describe("TaskCard Component", () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const tareaBase = {
    id: 1,
    titulo: "Tarea de prueba",
    descripcion: "Descripción de la tarea",
    completada: false,
    usuarioId: 1,
    fechaCreacion: "2023-01-01T12:00:00Z",
    fechaEdicion: "2023-01-02T15:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título, descripción y usuario", () => {
    render(
      <TaskCard
        tarea={tareaBase}
        usuario="Douglas"
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción de la tarea")).toBeInTheDocument();
    expect(screen.getByText(/Douglas/)).toBeInTheDocument();
    expect(screen.getByText(/Creada:/)).toBeInTheDocument();
    expect(screen.getByText(/Editada:/)).toBeInTheDocument();
  });

  test("muestra estilo tachado si está completada", () => {
    render(
      <TaskCard
        tarea={{ ...tareaBase, completada: true }}
        usuario="Douglas"
        onToggle={mockOnToggle}
      />
    );

    const titulo = screen.getByText("Tarea de prueba");
    expect(titulo).toHaveClass("line-through");
  });

  test("llama a onToggle al hacer click en el icono de completar", () => {
    render(<TaskCard tarea={tareaBase} onToggle={mockOnToggle} />);
    const toggleButton = screen.getByTitle("Marcar como completada");
    fireEvent.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledWith(tareaBase.id);
  });

  test("llama a onEdit al hacer click en Editar", () => {
    render(<TaskCard tarea={tareaBase} onEdit={mockOnEdit} />);
    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(tareaBase);
  });

  test("llama a onDelete al hacer click en Eliminar", () => {
    render(<TaskCard tarea={tareaBase} onDelete={mockOnDelete} />);
    const deleteButton = screen.getByText("Eliminar");
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(tareaBase.id);
  });

  test("muestra 'Desconocido' si no se pasa usuario", () => {
    render(<TaskCard tarea={tareaBase} />);
    expect(screen.getByText(/Desconocido/)).toBeInTheDocument();
  });

  test("muestra 'Sin fecha' y 'Sin edición' si no hay fechas", () => {
    render(
      <TaskCard
        tarea={{ ...tareaBase, fechaCreacion: null, fechaEdicion: null }}
      />
    );

    expect(screen.getByText(/Sin fecha/)).toBeInTheDocument();
    expect(screen.getByText(/Sin edición/)).toBeInTheDocument();
  });
});

/* Perfecto, para testear TaskCard.jsx podemos verificar:

Renderizado de la tarea (título, usuario, fechas).

Cambio de estilos cuando está completada.

Disparo de callbacks (onToggle, onEdit, onDelete).

Aquí tienes un test completo con Jest + React Testing Library:*/ 