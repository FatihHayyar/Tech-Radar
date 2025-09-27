describe("Login Flow", () => {
  it("logs in as CTO and sees Admin Panel", () => {
    cy.visit("http://localhost:5173/");

    // Login formu doldur
    cy.get('input[placeholder="E-Mail"]').type("cto@test.com");
    cy.get('input[placeholder="Passwort"]').type("111111");

    // Login butonuna tıkla
    cy.contains("Login").click();

    // Admin panel başlığı görünüyor mu?
    cy.contains(/Admin Panel|Technologie/i).should("be.visible");
  });
});
