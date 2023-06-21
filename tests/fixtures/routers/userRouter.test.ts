import request from "supertest";
import app from "../../../src/app";
import User from "../../../src/models/user";
import { setupDatabase } from "../db";
import { mockUser, mockUserId } from "../users";

beforeEach(setupDatabase);

describe("POST /user", () => {
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

  it("should throw an error if a valid user is not provided", async () => {
    await request(app).post("/user").expect(500);
  });
});

describe("POST /user/login", () => {
  it("should login an existing user", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(200);
    const user = await User.findById(mockUserId);
    expect(response.body.token).toBe(user!.tokens![1].token);
  });

  it("should not login a non-existing user", async () => {
    await request(app)
      .post("/user/login")
      .send({
        email: "someemail@email.com",
        password: "somepass",
      })
      .expect(400);
  });

  it("should throw an error if an email or password is not provided", async () => {
    await request(app).post("/user/login").expect(400);
  });
});

describe("POST /user/logout", () => {
  it("should logout a logged-in user", async () => {
    await request(app)
      .post("/user/logout")
      .set("Authorization", `Bearer ${mockUser.tokens[0].token}`)
      .expect(200);
  });

  it("should throw an error if the user is not logged-in", async () => {
    await request(app).post("/user/logout").expect(401);
  });
});

describe("GET /user/profile", () => {
  it("should retrieve the logged-in user's profile", async () => {
    await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${mockUser.tokens[0].token}`)
      .expect(200);
  });

  it("should throw an error if the user is not logged-in", async () => {
    await request(app).get("/user/profile").expect(401);
  });
});
