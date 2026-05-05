import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { defaultRouter } from "../src/routers/default.router.js";

describe("Default route", () => {
  test("Should return 501 for undefined routes", async () => {
    await request(app).get("/undefined-route")
      .expect(501);
  });
});