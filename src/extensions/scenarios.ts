import type { Context, HandlerResult } from "../types.ts";

export abstract class Scenarios {
  handleNotImplemented(_req: Request): HandlerResult {
    return new Response(null, { status: 501 });
  }

  handleNotFound(_req: Request, _ctx: Context): HandlerResult {
    return new Response(null, { status: 404 });
  }

  handleMethodNotAllowed(_req: Request, _ctx: Context): HandlerResult {
    return new Response(null, { status: 405 });
  }
}
