import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../index.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/services", () => {
  it("should require authentication", async () => {
    const res = await request(app)
      .post("/api/services")
      .send({ title: "Test", description: "desc", price: 10, category: "cat" });
    expect(res.statusCode).toBe(401); // Expect Unauthorized
  });

  it("should create a service with valid authentication", async () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Service",
        description: "This is a test service",
        price: 100,
        category: "Test Category",
      });

    expect(res.statusCode).toBe(201); // Expect success
    expect(res.body).toHaveProperty("title", "Test Service"); // Validate response
  });
});

describe("GET /api/services", () => {
  it("should return a list of services", async () => {
    const res = await request(app).get("/api/services");

    expect(res.statusCode).toBe(200); // Expect success
    expect(res.body).toBeInstanceOf(Array); // Validate response is an array
  });
});