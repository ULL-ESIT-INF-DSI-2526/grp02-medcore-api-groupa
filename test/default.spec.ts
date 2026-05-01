import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import "../src/routers/default.js";

describe("Default route", () => {
  test("Should return 501 for undefined routes", async () => {
    await request(app).get("/undefined-route")
      .expect(501);
  });
});