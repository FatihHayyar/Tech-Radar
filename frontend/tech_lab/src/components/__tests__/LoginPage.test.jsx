import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../../pages/LoginPage";

// useNavigate'i mockla
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

  // Email / Password alanlarını doldur
  // Hem 'E-Mail', hem 'Email', hem 'Mail' için esnek regex
  const email = screen.getByPlaceholderText(/mail/i);
  // Hem 'Passwort' hem 'Password' için esnek regex
  const pass = screen.getByPlaceholderText(/pass/i);

  fireEvent.change(email, { target: { value: "cto@test.com" } });
  fireEvent.change(pass, { target: { value: "111111" } });

  // Giriş butonunu bul
  const btn = screen.getByRole("button", { name: /login|anmelden|giriş/i });
  fireEvent.click(btn);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  // Backend'e doğru body gitmiş mi?
  const [, options] = global.fetch.mock.calls[0];
  const body = JSON.parse(options.body);
  expect(body).toEqual(
    expect.objectContaining({
      email: "cto@test.com",
      password: "111111",
    })
  );

  // Token localStorage'a yazılmış olmalı
  expect(localStorage.getItem("token")).toBe("JWT_TOKEN");
  expect(mockNavigate).toHaveBeenCalled(); // başarılı girişte yönlenir
});
