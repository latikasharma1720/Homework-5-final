import request from "supertest";
import app from "../server.js";

// Test 1 – Server check
describe("Server Health Test", () => {
  it("GET /api/health should return ok:true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

// Test 2 – Authentication validation
describe("Auth Validation Test", () => {
  it("POST /api/auth/login with missing fields should return 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "latika@example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing credentials");
  });
});

// Test 3 – Authorization protection
describe("Protected Route Test", () => {
  it("POST /api/reservations without auth cookie should return 401", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .send({
        first_name: "Latika",
        last_name: "Sharma",
        phone: "1234567890",
        email: "latika@example.com",
        date: "2025-12-01",
        time: "19:00",
        guests: 2
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Not authenticated");
  });
});
