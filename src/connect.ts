import { Adapter } from "./extensions/adapter.ts";
import { isValidMethod } from "./utils.ts";
import type { ConnInfo } from "./types.ts";

export class Connect extends Adapter {
  constructor() {
    super();
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, connInfo: ConnInfo) {
    const { method, url } = request;

    if (!isValidMethod(method)) {
      return this.handleNotImplemented(request);
    }

    const middlewares = this.getMiddlewares(url);
    const route = this.getRoute(url);

    if (!route) {
      const context = this.createContext(url, connInfo);

      const response = await this.createResponse(
        request,
        context,
        [...middlewares, this.handleNotFound],
      );

      return response;
    }

    const handlers = route.methods[method];
    const context = this.createContext(url, connInfo, route);

    if (handlers) {
      const response = await this.createResponse(
        request,
        context,
        [...middlewares, ...handlers],
      );

      return response;
    } else {
      const response = await this.createResponse(
        request,
        context,
        [...middlewares, this.handleMethodNotAllowed],
      );

      return response;
    }
  }
}
