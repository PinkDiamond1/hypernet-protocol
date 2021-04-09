import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";
import { EthereumAddress, Signature } from "@hypernetlabs/objects";

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getMerchantSignature(merchantUrl: string): ResultAsync<Signature, Error> {
    const url = this._prepareMerchantUrl(merchantUrl, "signature");
    return this.ajaxUtils.get<Signature, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantAddress(merchantUrl: string): ResultAsync<EthereumAddress, Error> {
    const url = this._prepareMerchantUrl(merchantUrl, "address");
    return this.ajaxUtils.get<EthereumAddress, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getMerchantCode(merchantUrl: string): ResultAsync<string, Error> {
    const url = this._prepareMerchantUrl(merchantUrl, "connector");
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  private _prepareMerchantUrl(merchantUrl: string, path: string): URL {
    const merchantUrlObject = new URL(merchantUrl);
    const searchParams = {};
    for (const [key, value] of new URLSearchParams(merchantUrlObject.search).entries()) {
      searchParams[key] = value;
    }
    merchantUrlObject.search = "";
    return new URL(urlJoinP(merchantUrlObject.toString(), [path], searchParams));
  }
}
