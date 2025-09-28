import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TechList from "../TechList";
import { vi } from "vitest";

// Global fetch mock
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]), // default: leere Liste
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
        { id: 1, name: "React", category: "Languages & Frameworks", ring: "Adopt", status: "PUBLISHED" },
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

  // React und Docker sichtbar
  expect(await screen.findByText("React")).toBeInTheDocument();
  expect(await screen.findByText("Docker")).toBeInTheDocument();

  // Kategorie filtern
  const select = screen.getByLabelText(/Kategorie:/i);
  fireEvent.change(select, { target: { value: "Platforms" } });

  // Nur Docker sollte sichtbar sein
  expect(screen.queryByText("React")).not.toBeInTheDocument();
  expect(screen.getByText("Docker")).toBeInTheDocument();
});
