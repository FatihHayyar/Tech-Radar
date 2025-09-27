import { render, screen, waitFor } from "@testing-library/react";
import TechList from "../TechList";
import { vi } from "vitest";

// Global fetch mock
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]), // default boş liste
    })
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

test("renders TechList heading", () => {
  render(<TechList />);
  expect(
    screen.getByRole("heading", { name: /Technologien/i })
  ).toBeInTheDocument();
});

test("shows empty message if no technologies", () => {
  render(<TechList />);
  expect(
    screen.getByText(/Keine Technologien gefunden/i)
  ).toBeInTheDocument();
});

test("renders a technology row when data is fetched", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, name: "React", category: "Framework", ring: "Adopt", status: "PUBLISHED" },
      ]),
  });

  render(<TechList />);

  await waitFor(() => {
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});

test("filters technologies by category", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, name: "React", category: "Languages & Frameworks", ring: "Adopt", status: "PUBLISHED" },
        { id: 2, name: "Docker", category: "Platforms", ring: "Trial", status: "PUBLISHED" },
      ]),
  });

  render(<TechList />);

  // React ve Docker aynı anda var
  expect(await screen.findByText("React")).toBeInTheDocument();
  expect(await screen.findByText("Docker")).toBeInTheDocument();

  // Kategoriyi filtrele
  const select = screen.getByLabelText(/Kategorie:/i);
  select.value = "Platforms";
  select.dispatchEvent(new Event("change", { bubbles: true }));

  // Sadece Docker görünmeli
  expect(screen.queryByText("React")).not.toBeInTheDocument();
  expect(screen.getByText("Docker")).toBeInTheDocument();
});
