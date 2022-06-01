import { Factory } from "./factory.ts";
import { MiddlewareContainer } from "../types.ts";
import type { Middlewares, MiddlewaresByPathname } from "../types.ts";

export abstract class Adapter extends Factory {
  #middlewares: Middlewares = [];
  #middlewaresByPathname: MiddlewaresByPathname = {};

  #addMiddlewares(middlewares: Middlewares) {
    this.#middlewares.push(...middlewares);
  }

  #addMiddlewaresByPathname(pathname: string, middlewares: Middlewares) {
    if (!this.#middlewaresByPathname[pathname]) {
      this.#middlewaresByPathname[pathname] = new MiddlewareContainer(pathname);
    }

    this.#middlewaresByPathname[pathname].middlewares.push(...middlewares);
  }

  protected getMiddlewares(url: string): Middlewares {
    const middlewares = [];

    for (const key in this.#middlewaresByPathname) {
      if (Object.hasOwn(this.#middlewaresByPathname, key)) {
        const container = this.#middlewaresByPathname[key];

        if (container.pattern.test(url)) {
          middlewares.push(...container.middlewares);
        }
      }
    }

    return [...this.#middlewares, ...middlewares];
  }

  use(...middlewares: Middlewares): void;
  use(pathname: string, ...middlewares: Middlewares): void;
  use(...args: unknown[]): void {
    if (typeof args[0] === "string") {
      const [pathname, ...middlewares] = args as [string, ...Middlewares];
      this.#addMiddlewaresByPathname(pathname, middlewares);
    } else {
      this.#addMiddlewares(args as Middlewares);
    }
  }
}
