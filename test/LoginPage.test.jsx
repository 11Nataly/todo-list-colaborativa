import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../src/LoginPage";

jest.useFakeTimers();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("redirige al rol correcto si las credenciales son válidas", async () => {
    const mockUser = { email: "test@test.com", password: "1234", rol: "admin" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockUser]),
      })
    );

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByText(/Iniciar sesión/i));

    await waitFor(() =>
      expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUser))
    );

    // correr el setTimeout
    jest.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });
});
