import { NoResponseError } from "../utils.ts";
import { Router } from "./router.ts";

import type {
  AsyncMiddlewareResult,
  ConnInfo,
  Context,
  MiddlewareResult,
  MiddlewaresAndHandler,
  Route,
} from "../types.ts";

export abstract class Factory extends Router {
  #throwNoResponse(req: Request, ctx: Context) {
    throw new NoResponseError(
      `No response in ${req.method} ${ctx.pattern.pathname.input}`,
    );
  }

  protected createContext(url: string, connInfo: ConnInfo): Context;
  protected createContext(
    url: string,
    connInfo: ConnInfo,
    route: Route,
  ): Context;
  protected createContext(...args: unknown[]): Context {
    if (!args[2]) {
      const pattern = new URLPattern({});

      return ({
        connInfo: args[1] as ConnInfo,
        params: {},
        pattern: pattern.exec(args[0] as string)!,
      });
    }

    const [url, connInfo, route] = args as [string, ConnInfo, Route];
    const patterResult = route.pattern.exec(url)!;

    return ({
      connInfo,
      params: patterResult.pathname.groups,
      pattern: patterResult,
    });
  }

  protected async createResponse(
    request: Request,
    context: Context,
    handlers: MiddlewaresAndHandler,
  ): Promise<Response> {
    const results: (MiddlewareResult | AsyncMiddlewareResult)[] = [];

    let response: Response | void;

    for (const handler of handlers) {
      const result = handler(request, context);

      if (result instanceof Promise || result instanceof Response) {
        response = await result;
        break;
      } else {
        // Not a generator
        if (!result || !result.next) {
          break;
        }

        const next = await result.next();

        if (next.done) {
          response = next.value;
          break;
        } else {
          results.unshift(result);
        }
      }
    }

    if (!(response instanceof Response)) {
      this.#throwNoResponse(request, context);
    }

    for (const result of results) {
      const next = await result.next(response!);

      if (next.done && next.value) {
        response = next.value;
      } else {
        await result.return();
      }
    }

    if (!(response instanceof Response)) {
      this.#throwNoResponse(request, context);
    }

    return response!;
  }
}
