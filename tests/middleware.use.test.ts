import { assertEquals, unreachable } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { Status } from "http_status";
import type { Context, MiddlewareResult } from "../src/types.ts";

function* authenticate(_: Request, ctx: Context): MiddlewareResult {
  ctx.auth = {
    username: "sant123",
    roles: ["admin", "wheel"],
  };

  yield;
}

function* isValidUser(_: Request, ctx: Context): MiddlewareResult {
  if (ctx.auth.username !== "sant821") {
    return new Response(`Unknown user ${ctx.auth.username}`, {
      status: Status.Unauthorized,
    });
  }

  yield;
}

function* specialContext1(_: Request, ctx: Context): MiddlewareResult {
  ctx.special = ctx.params.id;
  yield;
}

function* specialContext2(_: Request, ctx: Context): MiddlewareResult {
  ctx.special++;
  yield;
}

const app = new Connect();

app.use(authenticate);
app.use("/store/buy", isValidUser);
app.use("/store/buy/:id", specialContext1);
app.use("/store/buy/:id", specialContext2);

app.get("/store", (_, ctx) => {
  assertEquals(ctx.auth.username, "sant123");
  assertEquals(ctx.auth.roles, ["admin", "wheel"]);
  return new Response("The user is logged in.");
});

app.get("/store/buy", () => {
  unreachable();
});

app.get("/store/buy/:id", (_: Request, ctx: Context) => {
  assertEquals(ctx.special, 822);
  return new Response("The item has a special discount.");
});

const { handler } = app;

Deno.test("Should register a middleware to add info into context", async () => {
  const request = new Request("http://localhost/store");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "The user is logged in.");
});

Deno.test("Should deny a request with a 401", async () => {
  const request = new Request("http://localhost/store/buy");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.Unauthorized);
  assertEquals(text, "Unknown user sant123");
});

Deno.test("Should register a middleware by pathname", async () => {
  const request = new Request("http://localhost/store/buy/821");
  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "The item has a special discount.");
});
