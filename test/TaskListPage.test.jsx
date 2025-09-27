import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "../src/components/TaskList";

// Mock de TaskCard para simplificar el test
jest.mock("../src/components/TaskCard", () => ({ tarea, usuario, onDelete, onToggle, onEdit }) => (
  <div data-testid="task-card">
    <span>{tarea.titulo}</span>
    <span>{usuario}</span>
    <button onClick={() => onEdit(tarea)}>Editar</button>
    <button onClick={() => onDelete(tarea.id)}>Eliminar</button>
    <button onClick={() => onToggle(tarea.id)}>Toggle</button>
  </div>
));

describe("TaskList Component", () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnToggle = jest.fn();

  const tareas = [
    { id: 1, titulo: "Tarea 1", usuarioId: 1 },
    { id: 2, titulo: "Otra tarea", usuarioId: 2 },
  ];

  const usuarios = [
    { id: 1, nombre: "Usuario 1" },
    { id: 2, nombre: "Usuario 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza tareas", () => {
    render(
      <TaskList
        query=""
        tareas={tareas}
        usuarios={usuarios}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("Tarea 1")).toBeInTheDocument();
    expect(screen.getByText("Otra tarea")).toBeInTheDocument();
  });

  test("filtra tareas según query", () => {
    render(
      <TaskList
        query="otra"
        tareas={tareas}
        usuarios={usuarios}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.queryByText("Tarea 1")).not.toBeInTheDocument();
    expect(screen.getByText("Otra tarea")).toBeInTheDocument();
  });

  test("entra en modo edición", () => {
    render(
      <TaskList
        query=""
        tareas={tareas}
        usuarios={usuarios}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    fireEvent.click(screen.getAllByText("Editar")[0]);

    expect(screen.getByPlaceholderText("Editar título")).toBeInTheDocument();
  });
});


/*En resumen, ese test está comprobando que TaskList:

Renderiza correctamente la lista de tareas.

Aplica el filtro de búsqueda (query).

Soporta el flujo de entrar en modo edición.*/