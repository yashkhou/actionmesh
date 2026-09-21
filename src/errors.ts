export class ActionMeshError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly retryable = false,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ActionMeshError";
  }
}

export function fail(code: string, message: string, options: { status?: number; retryable?: boolean; details?: unknown } = {}): never {
  throw new ActionMeshError(code, message, options.status || 400, options.retryable || false, options.details);
}
