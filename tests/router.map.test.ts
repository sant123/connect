import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.map({
  "/donut": () => new Response("Hello from donut!"),
  "/donut/:flavor": (_, ctx) => {
    return new Response(`Hello from donut with ${ctx.params.flavor} flavor.`);
  },
  "POST@/donut": [() => new Response("Hello from donut POST!")],
});

const { handler } = app;

Deno.test("Should respond to /donut endpoint", async () => {
  const request = new Request("http://localhost/donut");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello from donut!");
});

Deno.test("Should return parameter provided to /donut/:flavor endpoint", async () => {
  const request = new Request("http://localhost/donut/chocolate");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello from donut with chocolate flavor.");
});

Deno.test("Should support POST requests to /donut endpoint", async () => {
  const request = new Request("http://localhost/donut", { method: "POST" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello from donut POST!");
});
