// __tests__/SearchInput.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "../src/components/SearchInput";

describe("SearchInput Component", () => {
  test("renderiza el input con placeholder", () => {
    render(<SearchInput query="" setQuery={jest.fn()} />);

    const input = screen.getByPlaceholderText("Buscar tarea...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  test("muestra el valor inicial de query", () => {
    render(<SearchInput query="Inicial" setQuery={jest.fn()} />);

    const input = screen.getByPlaceholderText("Buscar tarea...");
    expect(input).toHaveValue("Inicial");
  });

  test("llama a setQuery cuando cambia el valor", () => {
    const mockSetQuery = jest.fn();
    render(<SearchInput query="" setQuery={mockSetQuery} />);

    const input = screen.getByPlaceholderText("Buscar tarea...");
    fireEvent.change(input, { target: { value: "Nueva tarea" } });

    expect(mockSetQuery).toHaveBeenCalledTimes(1);
    expect(mockSetQuery).toHaveBeenCalledWith("Nueva tarea");
  });
});


/*Este test valida lo básico del componente:

Que existe el input y su placeholder.

Que refleja el query que recibe como prop.

Que dispara el callback setQuery con el texto ingresado. */