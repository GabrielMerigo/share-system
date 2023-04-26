const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

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
});
