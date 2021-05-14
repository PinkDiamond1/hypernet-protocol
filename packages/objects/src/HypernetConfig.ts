import { ChainAddresses, ChainProviders } from "@connext/vector-types";

import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { SchemaUrl } from "@objects/SchemaUrl";
import { DefinitionName } from "@objects/DefinitionName";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public routerMnemonic: string,
    public routerPublicIdentifier: PublicIdentifier,
    public chainId: number,
    public routerUrl: string,
    public hypertokenAddress: EthereumAddress,
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
    public chainProviders: ChainProviders,
    public hypernetProtocolSpace: string,
    public openThreadKey: string,
    public chainAddresses: ChainAddresses,
    public merchantIframeUrl: string,
    public ceramicNodeUrl: string,
    public storageAliases: Map<DefinitionName, SchemaUrl>,
    public debug: boolean,
  ) {}
}
