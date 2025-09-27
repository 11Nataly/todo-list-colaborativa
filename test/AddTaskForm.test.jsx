import { render, screen, fireEvent } from "@testing-library/react";
import AddTaskForm from "../src/components/AddTaskForm";
import localTaskService from "../src/utils/localTaskService";
import { toast } from "react-toastify";

// 🔹 Mock de servicios
jest.mock("../src/utils/localTaskService", () => ({
  initIfNeeded: jest.fn(),
  crearTarea: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const usuarios = [
  { id: 1, nombre: "Usuario 1" },
  { id: 2, nombre: "Usuario 2" },
];

describe("AddTaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza inputs, select y botón", () => {
    render(<AddTaskForm usuarios={usuarios} />);
    expect(screen.getByPlaceholderText("Título de la tarea")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descripción (opcional)")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Crear")).toBeInTheDocument();
  });

  test("muestra error si el título está vacío", () => {
    render(<AddTaskForm usuarios={usuarios} />);
    fireEvent.click(screen.getByText("Crear"));
    expect(toast.error).toHaveBeenCalledWith("El título no puede estar vacío");
  });

  test("muestra error si no se selecciona usuario", () => {
    render(<AddTaskForm usuarios={[]} />);
    fireEvent.change(screen.getByPlaceholderText("Título de la tarea"), {
      target: { value: "Nueva tarea" },
    });
    fireEvent.click(screen.getByText("Crear"));
    expect(toast.error).toHaveBeenCalledWith("Selecciona un usuario");
  });

  test("crea tarea correctamente, limpia inputs y llama onCreated", () => {
    const nueva = { id: 99, titulo: "Nueva tarea", usuarioId: 1 };
    localTaskService.crearTarea.mockReturnValue(nueva);
    const onCreated = jest.fn();

    render(<AddTaskForm usuarios={usuarios} onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText("Título de la tarea"), {
      target: { value: "Nueva tarea" },
    });

    fireEvent.click(screen.getByText("Crear"));

    expect(localTaskService.crearTarea).toHaveBeenCalledWith({
      titulo: "Nueva tarea",
      descripcion: "",
      usuarioId: 1,
    });
    expect(toast.success).toHaveBeenCalledWith("✅ Tarea creada correctamente");
    expect(onCreated).toHaveBeenCalledWith(nueva);
    expect(screen.getByPlaceholderText("Título de la tarea").value).toBe("");
  });

  test("muestra error si localTaskService.crearTarea lanza excepción", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    localTaskService.crearTarea.mockImplementation(() => {
      throw new Error("Fallo en creación");
    });

    render(<AddTaskForm usuarios={usuarios} />);

    fireEvent.change(screen.getByPlaceholderText("Título de la tarea"), {
      target: { value: "Tarea fallida" },
    });

    fireEvent.click(screen.getByText("Crear"));

    expect(toast.error).toHaveBeenCalledWith("No se pudo crear la tarea");
    spy.mockRestore();
  });
});

