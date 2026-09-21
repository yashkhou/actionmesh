import { z } from "zod";
import { ActionRegistry, createMcpAdapter, defineAction } from "../dist/index.js";

const registry = new ActionRegistry().register(defineAction({
  name: "lookup-lead",
  description: "Look up a lead by id",
  input: z.object({ id: z.string() }),
  output: z.object({ id: z.string(), status: z.string(), owner: z.string() }),
  readOnly: true,
  run: async ({ id }) => ({ id, status: "active", owner: "Yash" }),
}));

const mcp = createMcpAdapter(registry);
console.log("TOOLS");
console.log(JSON.stringify(mcp.listTools(), null, 2));
console.log("\nCALL");
console.log(JSON.stringify(await mcp.callTool({
  name: "lookup-lead",
  arguments: { id: "lead_123" },
}), null, 2));
