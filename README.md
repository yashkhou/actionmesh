<p align="center">
  <img src="./assets/brand.svg" width="720" alt="ActionMesh — One action contract. Every surface.">
</p>

<p align="center">
  <a href="https://github.com/yashkhou/actionmesh/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/yashkhou/actionmesh/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/yashkhou/actionmesh/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/yashkhou/actionmesh?style=flat-square"></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <a href="https://yashkhou.github.io/actionmesh/"><img alt="Live docs" src="https://img.shields.io/badge/live-docs-8f7cff?style=flat-square"></a>
</p>

<p align="center">
  <strong>One action contract. Every surface.</strong><br>
  A framework-agnostic TypeScript action registry that keeps validation, execution, errors and retry semantics attached to one operation, then exposes thin adapters around it.
</p>

<p align="center">
  <a href="https://yashkhou.github.io/actionmesh/"><strong>Live docs</strong></a> ·
  <a href="https://yashkhou.github.io/actionmesh/real-demo.html"><strong>Open the real adapter demo</strong></a> ·
  <a href="https://yashkhou.com/projects/actionmesh"><strong>Project page</strong></a> ·
  <a href="https://github.com/yashkhou/actionmesh/releases/latest"><strong>Latest release</strong></a>
</p>


## Why I built this

The same capability often gets rewritten as a backend route, an agent tool, a CLI script and an MCP handler. Those copies drift. ActionMesh keeps one implementation and treats transports as adapters—not new places for business logic.

## What ships today

- Typed `defineAction()` contracts
- Zod input validation before execution
- Optional output validation
- Stable machine-readable `ActionMeshError` codes
- Retries only when explicitly retryable
- MCP-style `listTools()` / `callTool()` adapter
- Node HTTP handler and CLI invocation helper

## Real demo


**[Open the real adapter demo →](https://yashkhou.github.io/actionmesh/real-demo.html)**

## Quick start

```bash
git clone https://github.com/yashkhou/actionmesh.git
cd actionmesh
npm install
npm test
npm run build
node examples/demo.mjs
```

## Small example

```ts
const registry = new ActionRegistry().register(defineAction({
  name: "lookup-lead",
  description: "Look up a lead by id",
  input: z.object({ id: z.string() }),
  output: z.object({ id: z.string(), status: z.string() }),
  run: async ({ id }) => ({ id, status: "active" }),
}));

await registry.invoke("lookup-lead", { id: "lead_123" });
```

## Architecture

```mermaid
flowchart LR
    A[UI / app] --> E[Action contract]
    B[Agent] --> E
    C[MCP-style adapter] --> E
    D[HTTP / CLI] --> E
    E --> F[Input schema]
    F --> G["run()"]
    G --> H[Output schema]
    H --> I[One result / error contract]
```

The design rule is intentionally narrow: **one action owns the contract; adapters translate transports without reimplementing business logic.**

## Good fits

- Keep an agent tool and application API on the same implementation
- Generate tool schemas from the same runtime validation
- Centralize retryable vs deterministic failures
- Reuse backend operations from scripts and CI without duplicating logic


## FAQ

### What is ActionMesh?

ActionMesh is a framework-agnostic TypeScript action registry that keeps an operation’s input schema, output schema, implementation, errors and retry semantics in one contract.

### Why use ActionMesh instead of separate handlers?

It reduces drift between agent tools, HTTP routes, CLI commands and MCP-style surfaces by keeping business logic in one action implementation and treating transports as adapters.

### Does ActionMesh implement the official MCP transport?

The current release ships an MCP-style listTools/callTool adapter. An official Model Context Protocol SDK transport is a separate roadmap item.

### What validates ActionMesh inputs?

ActionMesh uses Zod schemas for runtime input validation and can also validate outputs before returning them to callers.

## Roadmap

- [ ] Official Model Context Protocol transport package
- [ ] OpenAPI generation
- [ ] Action middleware and authorization policies
- [ ] Structured audit hooks
- [ ] Concurrency and idempotency policies

## Related tools

- [BrowserProof](https://github.com/yashkhou/browserproof) - browser-state verification for AI agents and Playwright workflows.
- [RunLedger](https://github.com/yashkhou/runledger) - tamper-evident execution history for AI-agent runs.
- [ActionMesh](https://github.com/yashkhou/actionmesh) - typed action contracts for tools, HTTP and CLI.

## Development

```bash
npm install
npm test
npm run build
```

CI runs tests and the TypeScript build on every push and pull request.

## Project links

- **Docs:** https://yashkhou.github.io/actionmesh/
- **Portfolio:** https://yashkhou.com/projects/actionmesh
- **Source:** https://github.com/yashkhou/actionmesh
- **Author:** [Yash](https://github.com/yashkhou) / [@yashkhou](https://x.com/yashkhou)

## License

MIT. See [LICENSE](./LICENSE).
