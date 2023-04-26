const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

it("should has status code 200", async () => {
  const result = await request.get("/");

  expect(result.statusCode).toEqual(200);
});
