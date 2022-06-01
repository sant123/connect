import { isValidMethod } from "../utils.ts";
import { MapRoutes, Route } from "../types.ts";
import { Scenarios } from "./scenarios.ts";
import type { Method, MiddlewaresAndHandler, Routes } from "../types.ts";

export abstract class Router extends Scenarios {
  #routes: Routes = {};

  #addRoute(pathname: string, method: Method, handlers: MiddlewaresAndHandler) {
    if (!this.#routes[pathname]) {
      this.#routes[pathname] = new Route(pathname);
    }

    this.#routes[pathname].methods[method] = handlers;
  }

  protected getRoute(url: string): Route | undefined {
    for (const key in this.#routes) {
      if (Object.hasOwn(this.#routes, key)) {
        const route = this.#routes[key];

        if (route.pattern.test(url)) {
          return route;
        }
      }
    }
  }

  get(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "GET", handlers);
    return this;
  }

  post(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "POST", handlers);
    return this;
  }

  put(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "PUT", handlers);
    return this;
  }

  patch(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "PATCH", handlers);
    return this;
  }

  delete(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "DELETE", handlers);
    return this;
  }

  options(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "OPTIONS", handlers);
    return this;
  }

  head(pathname: string, ...handlers: MiddlewaresAndHandler): this {
    this.#addRoute(pathname, "HEAD", handlers);
    return this;
  }

  map(routes: MapRoutes) {
    for (const [methodAndPathname, handlers] of Object.entries(routes)) {
      let [method, pathname] = methodAndPathname.split("@") as [Method, string];

      if (!pathname) {
        pathname = method;
      }

      if (!isValidMethod(method)) {
        method = "GET";
      }

      if (Array.isArray(handlers)) {
        this.#addRoute(pathname, method, handlers);
      } else {
        this.#addRoute(pathname, method, [handlers]);
      }
    }
  }

  route(pathname: string) {
    // deno-lint-ignore no-this-alias
    const self = this;

    return {
      get<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "GET", handlers);
        return this as Omit<R, "get">;
      },
      post<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "POST", handlers);
        return this as Omit<R, "post">;
      },
      put<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "PUT", handlers);
        return this as Omit<R, "put">;
      },
      patch<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "PATCH", handlers);
        return this as Omit<R, "patch">;
      },
      delete<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "DELETE", handlers);
        return this as Omit<R, "delete">;
      },
      options<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "OPTIONS", handlers);
        return this as Omit<R, "options">;
      },
      head<R>(this: R, ...handlers: MiddlewaresAndHandler) {
        self.#addRoute(pathname, "HEAD", handlers);
        return this as Omit<R, "head">;
      },
    };
  }
}
