import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import AdminPage from "../../pages/AdminPage";

// useNavigate mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

test("redirects if no token in localStorage", () => {
  render(<AdminPage />);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("redirects employee (role !== CTO or TECH_LEAD) to /tech", () => {
  localStorage.setItem("token", "FAKE");
  localStorage.setItem("role", "EMPLOYEE");

  render(<AdminPage />);
  expect(mockNavigate).toHaveBeenCalledWith("/tech");
});

test("renders and can switch tabs", () => {
  localStorage.setItem("token", "FAKE");
  localStorage.setItem("role", "CTO");

  render(<AdminPage />);

  // Başlık görünsün
  expect(screen.getByText(/Administrationsbereich/i)).toBeInTheDocument();

  // Default tab: Technologien
  expect(screen.getByRole("button", { name: /Technologien/i })).toHaveClass("active");

  // Entwürfe tabına geç
  const draftsBtn = screen.getByRole("button", { name: /Entwürfe/i });
  fireEvent.click(draftsBtn);
  expect(draftsBtn).toHaveClass("active");

  // Neue Technologie tabına geç
  const addBtn = screen.getByRole("button", { name: /Neue Technologie/i });
  fireEvent.click(addBtn);
  expect(addBtn).toHaveClass("active");
});

test("logout clears storage and redirects to login", () => {
  localStorage.setItem("token", "FAKE");
  localStorage.setItem("role", "CTO");

  render(<AdminPage />);

  const logoutBtn = screen.getByRole("button", { name: /Abmelden/i });
  fireEvent.click(logoutBtn);

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("role")).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
