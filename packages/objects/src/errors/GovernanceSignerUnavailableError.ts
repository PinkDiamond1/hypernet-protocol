/**
 * GovernanceSignerUnavailableError is returned when the mainProvider is not connected to the governance chain, and you attempt
 * to do a write operation on the governance chain. The governance chain is available via our own private node farm.
 */
export class GovernanceSignerUnavailableError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
