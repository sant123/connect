import { methods } from "./types.ts";
import type { Method } from "./types.ts";

export function isValidMethod(method: string): method is Method {
  return methods.includes(method as Method);
}

export class NoResponseError extends Error {
  override name = "NoResponseError";
}
