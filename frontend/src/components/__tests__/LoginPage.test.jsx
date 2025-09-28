import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../../pages/LoginPage";

// useNavigate mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  // fetch mock
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          token: "JWT_TOKEN",
          role: "CTO",
          userId: "u-1",
        }),
    })
  );
  vi.spyOn(window, "alert").mockImplementation(() => {});
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

test("LoginPage submits credentials and stores token", async () => {
  render(<LoginPage />);

  // Felder ausfüllen
  const email = screen.getByPlaceholderText("E-Mail");
  const pass = screen.getByPlaceholderText("Passwort");

  fireEvent.change(email, { target: { value: "cto@test.com" } });
  fireEvent.change(pass, { target: { value: "111111" } });

  // Button klicken
  const btn = screen.getByRole("button", { name: /Anmelden/i });
  fireEvent.click(btn);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  // Backend-Body prüfen
  const [, options] = global.fetch.mock.calls[0];
  const body = JSON.parse(options.body);
  expect(body).toEqual(
    expect.objectContaining({
      email: "cto@test.com",
      password: "111111",
    })
  );

  // Token sollte gespeichert werden
  expect(localStorage.getItem("token")).toBe("JWT_TOKEN");
  expect(mockNavigate).toHaveBeenCalled();
});
