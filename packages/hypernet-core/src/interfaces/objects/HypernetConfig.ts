import {
  ChainAddresses,
  ChainProviders,
} from "@connext/vector-types";

export class HypernetConfig {
  constructor(
    public spaceName: string,
    public openLinkKey: string,
    public linkDataKey: string,
    public discoveryThreadName: string,
    public controlThreadName: string,
    public openThreadKey: string,
    public xstateWalletUrl: string,
    public forceMoveAppAddress: string,
    public natsUrl: string,
    public authUrl: string,
    public chainAddresses: ChainAddresses,
    public chainProviders: ChainProviders,
    public mnemonic: string
  ) { }
}
