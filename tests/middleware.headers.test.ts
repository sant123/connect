import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";
import type { MiddlewareResult } from "../src/types.ts";

const poweredBy = "connect";
const app = new Connect();

app.use(function* (): MiddlewareResult {
  const response = yield;
  response.headers.append("X-Powered-By", poweredBy);
});

app.get("/hamburger", () => {
  return new Response("Hello hamburger page!");
});

const { handler } = app;

Deno.test("Should contain x-powered-by header in a 200 response", async () => {
  const request = new Request("http://localhost/hamburger");
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.OK);
  assertEquals(response.headers.get("x-powered-by"), poweredBy);
});

Deno.test("Should contain x-powered-by header in a 404 response", async () => {
  const request = new Request("http://localhost/pizza");
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.NotFound);
  assertEquals(response.headers.get("x-powered-by"), poweredBy);
});

Deno.test("Should contain x-powered-by header in a 405 response", async () => {
  const request = new Request("http://localhost/hamburger", { method: "POST" });
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.MethodNotAllowed);
  assertEquals(response.headers.get("x-powered-by"), poweredBy);
});
