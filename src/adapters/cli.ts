import type { ActionRegistry } from "../core.js";

export async function invokeCli(registry: ActionRegistry, argv = process.argv.slice(2)): Promise<unknown> {
  const name = argv[0];
  const json = argv[1] || "{}";
  if (!name) throw new Error("Usage: <action-name> <json>");
  return registry.invoke(name, JSON.parse(json));
}
