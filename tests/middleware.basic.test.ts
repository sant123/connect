import { assertEquals, unreachable } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";
import type { Context, MiddlewareResult } from "../src/types.ts";

function* counter1(_: Request, ctx: Context): MiddlewareResult {
  ctx.counter = 1;
  yield;
  assertEquals(ctx.counter, 5);
}

function* counter2(_: Request, ctx: Context): MiddlewareResult {
  assertEquals(ctx.counter, 1);
  ctx.counter++;
  yield;
  assertEquals(ctx.counter, 4);
  ctx.counter++;
}

function* counter3(_: Request, ctx: Context): MiddlewareResult {
  assertEquals(ctx.counter, 2);
  ctx.counter++;
  ctx.counter++;
  yield;
  assertEquals(ctx.counter, 4);
}

function* yieldTest(_: Request, ctx: Context): MiddlewareResult {
  ctx.counter = 1;
  yield;
  assertEquals(ctx.counter, 16);
  yield;
  unreachable();
}

function* unauthorized(_: Request, ctx: Context): MiddlewareResult {
  if (!ctx.auth) {
    return new Response("Not authorized user", { status: 401 });
  }

  yield;
}

const app = new Connect();

app.get("/shop", counter1, counter2, counter3, (_, ctx) => {
  return new Response(`Hello shop page, the counter is ${ctx.counter}!`);
});

app.get("/shop/yield", yieldTest, (_, ctx) => {
  ctx.counter = 16;
  return new Response(`Hello shop page, the counter is ${ctx.counter}!`);
});

app.get("/shop/auth", unauthorized, () => {
  unreachable();
});

const { handler } = app;

Deno.test("Should compute counter in /shop endpoint", async () => {
  const request = new Request("http://localhost/shop");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello shop page, the counter is 4!");
});

Deno.test("Should stop with a second yield", async () => {
  const request = new Request("http://localhost/shop/yield");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Hello shop page, the counter is 16!");
});

Deno.test("Should intercept calls", async () => {
  const request = new Request("http://localhost/shop/auth");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.Unauthorized);
  assertEquals(text, "Not authorized user");
});
