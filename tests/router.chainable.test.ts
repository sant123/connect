import { assertEquals, assertExists } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app
  .get("/door", () => {
    return new Response("Hello door page!");
  })
  .get("/door/:house", (_, ctx) => {
    assertExists(ctx.pattern);
    return new Response(`Identified house: ${ctx.params.house}`);
  })
  .post("/door", () => {
    return new Response("Hello door page from POST!");
  });

const { handler } = app;

Deno.test("Should respond to /door endpoint", async () => {
  const request = new Request("http://localhost/door");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello door page!");
});

Deno.test("Should return parameter provided to /door/:house endpoint", async () => {
  const request = new Request("http://localhost/door/white");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Identified house: white");
});

Deno.test("Should support POST requests to /door endpoint", async () => {
  const request = new Request("http://localhost/door", { method: "POST" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello door page from POST!");
});
