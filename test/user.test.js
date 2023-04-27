const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

const mainUser = {
  name: "BBBBBBBBB",
  email: "BBBBBBBBBB@gmail.com",
  password: "BBBBB",
};

beforeAll(async () => {
  await request.post("/user").send(mainUser);
});

afterAll(async () => {
  await request.delete(`/user/${mainUser.email}`).send(mainUser);
});

describe("User Sign Up", () => {
  it("should register an user correctly", async () => {
    const timestamp = Date.now();
    const user = {
      name: "Gabriel",
      email: `gabriel${timestamp}@gmail.com`,
      password: "123",
    };

    const result = await request.post("/user").send(user);

    expect(result.statusCode).toEqual(200);
    expect(result.body.email).toEqual(user.email);
  });

  it("shouldn't allow an user register empty data", async () => {
    const user = {
      name: "",
      email: "",
      password: "",
    };

    const result = await request.post("/user").send(user);
    expect(result.statusCode).toEqual(400);
  });

  it("shouldn't allow an user register a new user with an existing email", async () => {
    const timestamp = Date.now();
    const user = {
      name: "Gabriel",
      email: `gabriel${timestamp}@gmail.com`,
      password: "123",
    };

    const result = await request.post("/user").send(user);
    expect(result.statusCode).toEqual(200);
    expect(result.body.email).toEqual(user.email);

    const resultWithSameEmail = await request.post("/user").send(user);
    expect(resultWithSameEmail.statusCode).toEqual(400);
    expect(resultWithSameEmail.error).toBeTruthy();
  });
});

describe("Authentication", () => {
  it("should return a token when login", async () => {
    const result = await request
      .post("/auth")
      .send({ email: mainUser.email, password: mainUser.password });

    expect(result.body.token).toBeDefined();
  });
});
