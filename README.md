# ActionMesh

**Define an action once. Call it from agents, HTTP, MCP-style tools, or CLI.**

ActionMesh is a small, framework-agnostic TypeScript action registry. Runtime validation, output contracts, errors, retries, and adapter schemas stay attached to the same operation.

It is intentionally **not** an agent framework. Bring your own model, UI, database, queue, and runtime.

## The problem

The same capability often gets rewritten as a backend route, agent tool, CLI script, MCP handler, and test helper. Those copies drift.

ActionMesh keeps one implementation and exposes lightweight adapters around it.

## Example

~~~ts
import { z } from "zod";
import { ActionRegistry, defineAction } from "actionmesh";

const registry = new ActionRegistry().register(defineAction({
  name: "lookup-lead",
  description: "Look up a lead by id",
  input: z.object({ id: z.string() }),
  output: z.object({ id: z.string(), status: z.string() }),
  run: async ({ id }) => ({ id, status: "active" })
}));

await registry.invoke("lookup-lead", { id: "lead_123" });
~~~

## Included

- typed defineAction contract
- Zod input validation before execution
- optional output validation
- stable ActionMeshError codes
- retry only for explicitly retryable failures
- MCP-style listTools and callTool adapter
- Node HTTP handler
- CLI invocation helper

## Quick start

~~~bash
git clone https://github.com/yashkhou/actionmesh.git
cd actionmesh
npm install
npm test
~~~

## Design rule

One action owns the contract. Adapters translate transports; they do not reimplement business logic.

## Roadmap

Official Model Context Protocol transport package, OpenAPI generation, auth middleware, structured audit hooks, concurrency and idempotency policies.

## License

MIT
