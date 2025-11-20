// client/e2e/protected-reserve.cy.js

describe("Protected Reserve route", () => {
  beforeEach(() => {
    
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("redirects an unauthenticated user from /reserve to /login", () => {
    
    cy.visit("/reserve");

    
    cy.url().should("include", "/login");

    
    cy.contains(/log in/i).should("exist");
  });
});
