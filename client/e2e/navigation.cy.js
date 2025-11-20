// client/e2e/navigation.cy.js

describe("Top navigation", () => {
  beforeEach(() => {
    
    cy.visit("/menu");
  });

  it("shows top nav and redirects protected links to login", () => {
    // Check that all main nav links are visible
    cy.contains(/home/i).should("exist");
    cy.contains(/menu/i).should("exist");
    cy.contains(/reserve a table/i).should("exist");
    cy.contains(/food safety/i).should("exist");

    cy.contains(/reserve a table/i).click();
    cy.url().should("include", "/login");
    cy.contains(/log in/i).should("exist");

    
    
    cy.contains(/food safety/i).click();
    cy.url().should("include", "/login");
  });
});
