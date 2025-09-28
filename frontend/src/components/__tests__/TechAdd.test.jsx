import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TechAdd from "../TechAdd";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: "1" }),
    })
  );

  vi.spyOn(window, "alert").mockImplementation(() => {});
  localStorage.setItem("token", "FAKE_TOKEN");
});

afterEach(() => {
  vi.clearAllMocks();
});

test("TechAdd renders and submits minimal required fields", async () => {
  render(<TechAdd />);

  const nameInput = screen.getByPlaceholderText("Technologie-Name");
  const descTextarea = screen.getByPlaceholderText(/Beschreibung/i);

  const selects = screen.getAllByRole("combobox");
  const categorySelect = selects[0]; // erstes Select = Kategorie

  fireEvent.change(nameInput, { target: { value: "ArgoCD" } });
  fireEvent.change(descTextarea, { target: { value: "CD-Tool für Kubernetes" } });
  fireEvent.change(categorySelect, { target: { value: "Tools" } });

  const saveBtn = screen.getByRole("button", { name: /Speichern/i });
  fireEvent.click(saveBtn);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toMatch(/\/tech$/);
  expect(options.method).toBe("POST");

  const body = JSON.parse(options.body);
  expect(body).toEqual(
    expect.objectContaining({
      name: "ArgoCD",
      category: "Tools",
      description: "CD-Tool für Kubernetes",
    })
  );

  expect(window.alert).toHaveBeenCalled();
});
