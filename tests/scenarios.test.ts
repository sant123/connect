import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.get("/payment", () => {
  return new Response("Hello from payment!");
});

const { handler } = app;

Deno.test("Should be not implemented", async () => {
  const request = new Request("http://localhost/payment", { method: "PROXY" });
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.NotImplemented);
});

Deno.test("Should be not found status", async () => {
  const request = new Request("http://localhost/payment/abc");
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.NotFound);
});

Deno.test("Should be method not allowed", async () => {
  const request = new Request("http://localhost/payment", { method: "POST" });
  const response = await handler(request, connInfo);

  assertEquals(response.status, Status.MethodNotAllowed);
});
