describe("Login Flow", () => {
  it("logs in as CTO and sees Admin Panel", () => {
    cy.visit("http://localhost:5173/");

    cy.get('input[placeholder="E-Mail"]').type("cto@test.com");
    cy.get('input[placeholder="Passwort"]').type("111111");
    cy.get("form").submit();

    cy.url().should("include", "/admin");
    cy.contains(/Admin Panel|Technologie/i).should("be.visible");
  });

  it("shows error on wrong password", () => {
    cy.visit("http://localhost:5173/");

    cy.get('input[placeholder="E-Mail"]').type("cto@test.com");
    cy.get('input[placeholder="Passwort"]').type("wrongpass");
    cy.get("form").submit();

    cy.on("window:alert", (msg) => {
      expect(msg).to.match(/fehlgeschlagen|Fehler|ungültig/i);
    });
  });
});

describe("TechAdd Flow", () => {
  it("adds a new technology and sees it in the drafts list", () => {
    cy.visit("http://localhost:5173/");

    cy.get('input[placeholder="E-Mail"]').type("cto@test.com");
    cy.get('input[placeholder="Passwort"]').type("111111");
    cy.get("form").submit();

    cy.url().should("include", "/admin");

    // Neue Technologie formunu aç
    cy.contains(/Neue Technologie/i).click();

    // Formu doldur
    cy.get('input[name="name"]').type("CypressTestTech");
    cy.get('select[name="category"]').select("Tools");
    cy.get('textarea[name="description"]').type("E2E Test Tech Description");
    cy.get('button[type="submit"]').click();

    // Entwürfe listesinde görünsün
    cy.contains(/Entwürfe/i).click();
    cy.contains("CypressTestTech").should("be.visible");
  });
});
