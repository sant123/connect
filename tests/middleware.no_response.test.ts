import { assertEquals, assertRejects, unreachable } from "asserts";
import { Connect } from "../mod.ts";
import { connInfo } from "./utils.ts";
import { NoResponseError } from "../src/utils.ts";
import { Status } from "http_status";

// deno-lint-ignore require-yield
function* noResponseMw() {
  return;
}

// deno-lint-ignore require-yield no-explicit-any
function* incorrectTypeMw(): any {
  return 5;
}

function* noResponseAfterYieldMw() {
  yield;
  return;
}

// deno-lint-ignore no-explicit-any
function* incorrectTypeAfterYieldMw(): any {
  yield;
  return 5;
}

const app = new Connect();

// deno-lint-ignore no-explicit-any
app.get("/picture", (): any => {
  return;
});

// deno-lint-ignore no-explicit-any
app.get("/picture/string", (): any => {
  return "string";
});

app.get("/picture/no-response-mw", noResponseMw, () => {
  unreachable();
});

app.get("/picture/incorrect-type-mw", incorrectTypeMw, () => {
  unreachable();
});

app.get("/picture/no-response-after-yield-mw", noResponseAfterYieldMw, () => {
  return new Response("Number one!");
});

app.get(
  "/picture/incorrect-type-after-yield-mw",
  incorrectTypeAfterYieldMw,
  () => {
    return new Response("Number two!");
  },
);

const { handler } = app;

Deno.test("Should throw if a handler returns undefined", async () => {
  const request = new Request("http://localhost/picture");

  await assertRejects(() => handler(request, connInfo), NoResponseError);
});

Deno.test("Should throw if a handler does not return a response", async () => {
  const request = new Request("http://localhost/picture/string");

  await assertRejects(() => handler(request, connInfo), NoResponseError);
});

Deno.test("Should throw if a middleware returns undefined", async () => {
  const request = new Request("http://localhost/picture/no-response-mw");

  await assertRejects(() => handler(request, connInfo), NoResponseError);
});

Deno.test("Should throw if a middleware does not return a response", async () => {
  const request = new Request("http://localhost/picture/incorrect-type-mw");

  await assertRejects(() => handler(request, connInfo), NoResponseError);
});

Deno.test("Should have a response even if a middleware after yield returns undefined", async () => {
  const request = new Request(
    "http://localhost/picture/no-response-after-yield-mw",
  );

  const response = await handler(request, connInfo);
  const text = await response.text();

  assertEquals(response.status, Status.OK);
  assertEquals(text, "Number one!");
});

Deno.test("Should throw if a middleware does not return a response after yield", async () => {
  const request = new Request(
    "http://localhost/picture/incorrect-type-after-yield-mw",
  );

  await assertRejects(() => handler(request, connInfo), NoResponseError);
});
