import type { ConnInfo } from "https://deno.land/std@0.147.0/http/server.ts";
export { ConnInfo };

export type HandlerFactory<T> = (
  request: Request,
  context: Context,
) => T;

export type Handler = HandlerFactory<HandlerResult>;
export type HandlerResult = Response | Promise<Response>;

export type Middleware = HandlerFactory<
  MiddlewareResult | AsyncMiddlewareResult
>;

export type MiddlewareResult = Generator<
  void,
  Response | void,
  Response
>;

export type AsyncMiddlewareResult = AsyncGenerator<
  void,
  Response | void,
  Response
>;

export type Middlewares = Middleware[];

export type MiddlewaresAndHandler = [
  ...Middlewares,
  Handler,
];

export type MapRoutes = Record<
  string,
  Handler | MiddlewaresAndHandler
>;

export type Context = {
  connInfo: ConnInfo;
  params: Record<string, string>;
  pattern: URLPatternResult;
  // deno-lint-ignore no-explicit-any
  [index: string]: any;
};

export const methods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const;

export type Method = typeof methods[number];

export class Route {
  methods: {
    [K in Method]?: MiddlewaresAndHandler;
  };

  pattern: URLPattern;

  constructor(pathname: string) {
    this.methods = {};
    this.pattern = new URLPattern({ pathname });
  }
}

export type Routes = Record<string, Route>;

export class MiddlewareContainer {
  pattern: URLPattern;
  middlewares: Middlewares;

  constructor(pathname: string) {
    this.middlewares = [];
    this.pattern = new URLPattern({ pathname });
  }
}

export type MiddlewaresByPathname = Record<string, MiddlewareContainer>;
