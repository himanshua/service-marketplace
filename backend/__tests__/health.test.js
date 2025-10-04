const request = require("supertest");
const app = require("../index");

describe("Health endpoint", () => {
  it("returns backend running message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Backend is running/i);
  });
});
