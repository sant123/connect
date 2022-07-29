# Connect
Powerful and extensible router for Deno with std/http in mind

``` ts
import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Connect } from "https://deno.land/x/connect/mod.ts";

const app = new Connect();

app.handleNotFound = () => {
  return new Response("The page you are looking for is not here :)", {
    status: 404,
  });
};

app.get("/", () => {
  return new Response("Hello world!");
});

app.map({
  "/contact": () => {
    return new Response("Hello from contact page!");
  },
});

app.route("/shop")
  .get(() => {
    return new Response("Hello from shop page!");
  });

serve(app.handler, { port: 8080 });

```
