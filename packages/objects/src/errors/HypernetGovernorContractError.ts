export class HypernetGovernorContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
