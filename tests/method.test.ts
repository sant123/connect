import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.get("/", () => new Response("Hello GET!"));
app.post("/", () => new Response("Hello POST!"));
app.put("/", () => new Response("Hello PUT!"));
app.patch("/", () => new Response("Hello PATCH!"));
app.delete("/", () => new Response("Hello DELETE!"));
app.options("/", () => new Response("Hello OPTIONS!"));
app.head("/", () => new Response("Hello HEAD!"));

const { handler } = app;

Deno.test("Should response to a single GET request", async () => {
  const request = new Request("http://localhost");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello GET!");
});

Deno.test("Should response to a single POST request", async () => {
  const request = new Request("http://localhost", { method: "POST" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello POST!");
});

Deno.test("Should response to a single PUT request", async () => {
  const request = new Request("http://localhost", { method: "PUT" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello PUT!");
});

Deno.test("Should response to a single PATCH request", async () => {
  const request = new Request("http://localhost", { method: "PATCH" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello PATCH!");
});

Deno.test("Should response to a single DELETE request", async () => {
  const request = new Request("http://localhost", { method: "DELETE" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello DELETE!");
});

Deno.test("Should response to a single OPTIONS request", async () => {
  const request = new Request("http://localhost", { method: "OPTIONS" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello OPTIONS!");
});

Deno.test("Should response to a single HEAD request", async () => {
  const request = new Request("http://localhost", { method: "HEAD" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello HEAD!");
});
