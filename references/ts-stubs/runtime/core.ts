export type AIRequest = {
  agentId: string;
  action: string;
  connector: string;
  payload: unknown;
};

export type RuntimeResult = {
  status: 'success' | 'blocked' | 'error';
  result?: unknown;
};

export class PortalFlowRuntime {
  async execute(request: AIRequest): Promise<RuntimeResult> {
    // 1. Receive AI intent
    // 2. Check permission
    // 3. Route connector
    // 4. Audit result
    return {
      status: 'success',
      result: request,
    };
  }
}
