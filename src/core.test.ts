import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { ActionRegistry, defineAction, fail } from "./index.js";

test("validates input and output through one action contract", async () => {
  const registry = new ActionRegistry().register(defineAction({
    name: "greet",
    description: "Greet a person",
    input: z.object({ name: z.string() }),
    output: z.object({ message: z.string() }),
    run: ({ name }) => ({ message: "Hello " + name })
  }));
  assert.deepEqual(await registry.invoke("greet", { name: "Yash" }), { message: "Hello Yash" });
  await assert.rejects(() => registry.invoke("greet", { name: 3 }), (e: any) => e.code === "invalid_input");
});

test("retries only explicitly retryable failures", async () => {
  let attempts = 0;
  const registry = new ActionRegistry().register(defineAction({
    name: "flaky", description: "test", input: z.object({}),
    run: () => { attempts++; if (attempts < 2) fail("busy", "try again", { status: 503, retryable: true }); return { ok: true }; }
  }));
  assert.deepEqual(await registry.invoke("flaky", {}, {}, 1), { ok: true });
  assert.equal(attempts, 2);
});
