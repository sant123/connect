import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.route("/people")
  .get(() => {
    return new Response("Hello from GET people!");
  })
  .post(() => {
    return new Response("Hello from POST people!");
  })
  .put(() => {
    return new Response("Hello from PUT people!");
  })
  .patch(() => {
    return new Response("Hello from PATCH people!");
  })
  .delete(() => {
    return new Response("Hello from DELETE people!");
  })
  .options(() => {
    return new Response("Hello from OPTIONS people!");
  })
  .head(...[() => {
    return new Response("Hello from HEAD people!");
  }]);

const { handler } = app;

Deno.test("Should respond to all registered methods in /people endpoint", async () => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];

  for (const method of methods) {
    const request = new Request("http://localhost/people", { method });
    const response = await handler(request, connInfo);
    const text = await response.text();

    assertEquals(response.status, Status.OK);
    assertEquals(text, `Hello from ${method} people!`);
  }
});
