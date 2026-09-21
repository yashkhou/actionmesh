import { zodToJsonSchema } from "zod-to-json-schema";
import type { ActionRegistry } from "../core.js";
import { ActionMeshError } from "../errors.js";

export function createMcpAdapter(registry: ActionRegistry) {
  return {
    listTools() {
      return registry.list().map((action) => ({
        name: action.name,
        description: action.description,
        inputSchema: zodToJsonSchema(action.input, { target: "jsonSchema7" })
      }));
    },
    async callTool(request: { name: string; arguments?: unknown }) {
      try {
        const result = await registry.invoke(request.name, request.arguments || {});
        return { isError: false, content: [{ type: "text", text: JSON.stringify(result) }] };
      } catch (error) {
        const e = error instanceof ActionMeshError ? error : new ActionMeshError("internal_error", "Action failed", 500);
        return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: e.message, code: e.code, retryable: e.retryable }) }] };
      }
    }
  };
}
