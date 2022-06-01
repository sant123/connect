import { assertEquals, assertExists } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.get("/contact", () => {
  return new Response("Hello contact page!");
});

app.get("/contact/:user", (_, ctx) => {
  assertExists(ctx.pattern);
  return new Response(`Identified user: ${ctx.params.user}`);
});

app.post("/contact", () => {
  return new Response("Hello contact page from POST!");
});

const { handler } = app;

Deno.test("Should respond to /contact endpoint", async () => {
  const request = new Request("http://localhost/contact");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello contact page!");
});

Deno.test("Should return parameter provided to /contact/:user endpoint", async () => {
  const request = new Request("http://localhost/contact/sant123");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Identified user: sant123");
});

Deno.test("Should support POST requests to /contact endpoint", async () => {
  const request = new Request("http://localhost/contact", { method: "POST" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello contact page from POST!");
});
