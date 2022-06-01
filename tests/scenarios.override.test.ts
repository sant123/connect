import { assertEquals } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";

const app = new Connect();

app.get("/rooms", () => {
  return new Response("Hello from rooms!");
});

app.handleNotImplemented = () => {
  return new Response("The method is not implemented", {
    status: Status.NotImplemented,
  });
};

app.handleNotFound = () => {
  return new Response("Not found", {
    status: Status.NotFound,
  });
};

app.handleMethodNotAllowed = () => {
  return new Response("The method is not allowed", {
    status: Status.MethodNotAllowed,
  });
};

const { handler } = app;

Deno.test("Should be not implemented", async () => {
  const request = new Request("http://localhost/rooms", { method: "PROXY" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.NotImplemented);
  assertEquals(text, "The method is not implemented");
});

Deno.test("Should be not found status", async () => {
  const request = new Request("http://localhost/rooms/abc");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.NotFound);
  assertEquals(text, "Not found");
});

Deno.test("Should be method not allowed", async () => {
  const request = new Request("http://localhost/rooms", { method: "POST" });
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.MethodNotAllowed);
  assertEquals(text, "The method is not allowed");
});
