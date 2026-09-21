import type { IncomingMessage, ServerResponse } from "node:http";
import type { ActionRegistry } from "../core.js";
import { ActionMeshError } from "../errors.js";

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createHttpHandler(registry: ActionRegistry, prefix = "/actions/") {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (!url.pathname.startsWith(prefix)) { res.statusCode = 404; res.end("Not found"); return; }
    const name = decodeURIComponent(url.pathname.slice(prefix.length));
    try {
      const input = req.method === "GET" ? Object.fromEntries(url.searchParams) : await readBody(req);
      const result = await registry.invoke(name, input);
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(result));
    } catch (error) {
      const e = error instanceof ActionMeshError ? error : new ActionMeshError("internal_error", "Action failed", 500);
      res.statusCode = e.status;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: e.message, code: e.code, retryable: e.retryable, details: e.details }));
    }
  };
}
