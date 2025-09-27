import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TechAdd from "../TechAdd";

// useNavigate'i mockla (gerekirse)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  // fetch mock
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: "1" }),
    })
  );

  // alert mock
  vi.spyOn(window, "alert").mockImplementation(() => {});

  localStorage.setItem("token", "FAKE_TOKEN");
});

afterEach(() => {
  vi.clearAllMocks();
});

test("TechAdd renders and submits minimal required fields", async () => {
  render(<TechAdd />);

  // Alanları doldur
  const nameInput = screen.getByPlaceholderText(/Technologie-Name/i);
  const descTextarea = screen.getByPlaceholderText(/Beschreibung/i);

  const selects = screen.getAllByRole("combobox");
  const categorySelect = selects[0]; // ilk select "category"

  fireEvent.change(nameInput, { target: { value: "ArgoCD" } });
  fireEvent.change(descTextarea, { target: { value: "CD tool for K8s" } });
  fireEvent.change(categorySelect, { target: { value: "Tools" } });

  // Kaydet
  const saveBtn = screen.getByRole("button", { name: /Speichern|Save|➕/i });
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
      description: "CD tool for K8s",
    })
  );

  // alert çağrıldı mı kontrol et
  expect(window.alert).toHaveBeenCalled();
});
