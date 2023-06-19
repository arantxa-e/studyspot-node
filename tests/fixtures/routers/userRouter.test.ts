import request from "supertest";
import app from "../../../src/app";
import User from "../../../src/models/user";
import { setupDatabase } from "../db";

beforeEach(setupDatabase);

describe("post /user", () => {
  it("should create and authenticate a user", async () => {
    const response = await request(app)
      .post("/user")
      .send({
        firstName: "Andrew",
        lastName: "Edwards",
        displayName: "andrewedw",
        email: "andrew@example.com",
        password: "MyPass777!",
      })
      .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
      user: {
        firstName: "Andrew",
        lastName: "Edwards",
        displayName: "andrewedw",
        email: "andrew@example.com",
      },
      token: user?.tokens?.[0].token,
    });

    expect(user?.password).not.toBe("MyPass777!");
  });

  it("should throw an error if a user is not provided", async () => {
    await request(app).post("/user").expect(500);
  });
});
