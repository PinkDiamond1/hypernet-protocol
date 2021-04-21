import { ResultAsync } from "neverthrow";

import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IContextProvider {
  /**
   *
   */
  getContext(): ResultAsync<HypernetContext, never>;

  /**
   *
   */
  getInitializedContext(): ResultAsync<InitializedHypernetContext, never>;

  /**
   *
   */
  setContext(context: HypernetContext): ResultAsync<void, never>;

  /**
   * Will return the account once it is populated. This may be before the whole context is initialized.
   */
  getAccount(): ResultAsync<string, never>;
}
