import type { ZodType } from "zod";
import { ActionMeshError } from "./errors.js";

export interface ActionContext { signal?: AbortSignal; metadata?: Record<string, unknown>; }
export interface ActionDefinition<I = unknown, O = unknown> {
  name: string;
  description: string;
  input: ZodType<I>;
  output?: ZodType<O>;
  readOnly?: boolean;
  run(input: I, context: ActionContext): O | Promise<O>;
}

export const defineAction = <I,O>(definition: ActionDefinition<I,O>) => definition;

export class ActionRegistry {
  private readonly actions = new Map<string, ActionDefinition<any, any>>();

  register<I,O>(action: ActionDefinition<I,O>): this {
    if (this.actions.has(action.name)) throw new Error("Duplicate action: " + action.name);
    this.actions.set(action.name, action);
    return this;
  }

  get(name: string): ActionDefinition<any, any> | undefined { return this.actions.get(name); }
  list(): ActionDefinition<any, any>[] { return [...this.actions.values()]; }

  async invoke(name: string, rawInput: unknown, context: ActionContext = {}, retries = 0): Promise<unknown> {
    const action = this.actions.get(name);
    if (!action) throw new ActionMeshError("action_not_found", "Unknown action: " + name, 404);
    const parsed = action.input.safeParse(rawInput);
    if (!parsed.success) throw new ActionMeshError("invalid_input", "Action input failed validation", 400, false, parsed.error.flatten());
    let attempt = 0;
    for (;;) {
      try {
        const value = await action.run(parsed.data, context);
        if (!action.output) return value;
        const output = action.output.safeParse(value);
        if (!output.success) throw new ActionMeshError("invalid_output", "Action output failed validation", 500, false, output.error.flatten());
        return output.data;
      } catch (error) {
        const normalized = error instanceof ActionMeshError ? error : new ActionMeshError("internal_error", "Action failed", 500, false);
        if (!normalized.retryable || attempt >= retries) throw normalized;
        attempt++;
      }
    }
  }
}
