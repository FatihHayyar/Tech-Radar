describe("Login Flow", () => {
  it("logs in as CTO and sees Admin Panel", () => {
    cy.visit("/");

    // E-Mail ve Passwort alanlarını doldur
    cy.get('input[placeholder="E-Mail"]').type("cto@test.com");
    cy.get('input[placeholder="Passwort"]').type("111111");

    // Butonu bul ve tıkla (Login | Anmelden | Giriş hepsi kabul)
    cy.contains(/Login|Anmelden|Giriş/i).click();

    // Admin panel başlığı görünüyor mu?
    cy.contains(/Admin Panel|Technologie/i).should("be.visible");
  });
});
