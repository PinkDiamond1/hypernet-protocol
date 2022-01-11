import { IPFSGatewayUrl, IPFSUnavailableError } from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { IPFSHTTPClient, create } from "ipfs-http-client";

import {
  IConfigProvider,
  IConfigProviderType,
  IIPFSUtils,
  ToFile,
} from "@interfaces/utilities";

/**
 * IPFSUtils contains methods for interacting directly with a remote IPFS node
 * to save files and retrieve them from the same node or any other configured gateway.
 */
export class IPFSUtils implements IIPFSUtils {
  protected initializeResult: ResultAsync<void, IPFSUnavailableError> | null =
    null;

  protected httpClient: IPFSHTTPClient | null = null;

  protected gatewayUrl: IPFSGatewayUrl | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {}

  private initialized = false;

  public initialize(): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      this.logUtils.debug("Initializing IPFSUtils");

      this.initializeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          this.gatewayUrl = config.governanceChainInformation.ipfsGatewayUrl;

          const storedGatewayUrl =
            this.localStorageUtils.getItem("IPFSGatewayUrl");

          if (storedGatewayUrl) {
            this.gatewayUrl = IPFSGatewayUrl(storedGatewayUrl);
          }

          const ipfs = create({
            url: config.governanceChainInformation.ipfsApiUrl,
          });

          return ResultAsync.fromPromise(ipfs.version(), (e) => {
            this.logUtils.error("Failure during IPFS initialization");
            this.logUtils.error(e);

            throw new IPFSUnavailableError(
              "Failure during IPFS initialization",
            );
          }).map((ipfsVersion) => {
            if (ipfsVersion) {
              this.logUtils.log("IPFS initialized");
              this.httpClient = ipfs;
              this.initialized = true;
            }
          });
        });
    }
    return this.initializeResult;
  }

  /**
   * Returns an IPFS http client to communicate with a remote IPFS node.
   * @returns A ResultAsync containing IPFSHTTPClient
   */
  public getHttpClient(): ResultAsync<IPFSHTTPClient, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call IPFSUtils.initialize() first before you can call getHttpClient()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.httpClient as IPFSHTTPClient;
      })
      .orElse((e) => {
        this.logUtils.error("Failure during getHttpClient() function call");
        this.logUtils.error(e);
        throw new IPFSUnavailableError(
          "Initialization unsuccessful, you should not have called getHttpClient()",
        );
      });
  }

  /**
   * Returns IPFS gateway url which could be from local storage or the default one from config.
   * @returns A ResultAsync containing gateway url as a IPFSGatewayUrl
   */
  public getGatewayUrl(): ResultAsync<IPFSGatewayUrl, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      throw new IPFSUnavailableError(
        "Must call IPFSUtils.initialize() first before you can call getGatewayUrl()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.gatewayUrl as IPFSGatewayUrl;
      })
      .orElse((e) => {
        this.logUtils.error("Failure during getGatewayUrl() function call");
        this.logUtils.error(e);
        throw new IPFSUnavailableError(
          "Initialization unsuccessful, you should not have called getGatewayUrl()",
        );
      });
  }

  /**
   * Sets gateway url to the value passed and updates local storage for the further initializations.
   * @param gatewayUrl IPFSGatewayUrl
   */
  public setGatewayUrl(gatewayUrl: IPFSGatewayUrl) {
    this.gatewayUrl = gatewayUrl;
    this.localStorageUtils.setItem("IPFSGatewayUrl", gatewayUrl);
  }

  /**
   * Saves file to IPFS and returns a cid.
   * @param file
   * @returns A ResultAsync containing cid as a string
   */
  public saveFile(file: ToFile): ResultAsync<string, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }

    return ResultAsync.fromPromise(
      this.httpClient.add(file, {
        progress: (prog) => this.logUtils.log(`IPFS received: ${prog}`),
      }),
      (e) => {
        this.logUtils.error("Failure during saving file to IPFS");
        this.logUtils.error(e);
        throw new IPFSUnavailableError("Failure during saving file to IPFS.");
      },
    ).andThen((addResult) => {
      const cid = addResult.cid.toString();
      // Content added with saveFile() (which by default also becomes pinned), is not
      // added to MFS. Any content can be lazily referenced from MFS with copyFile().
      return this.copyFile(cid, file?.path).map(() => {
        return cid;
      });
    });
  }

  /**
   * Gets the related file with the given cid.
   * @param cid
   * @returns A ResultAsync containing response
   */
  public getFile(cid: string): ResultAsync<Response, IPFSUnavailableError> {
    if (this.initializeResult == null || this.gatewayUrl == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }

    const fileUrl = `${this.gatewayUrl}/ipfs/${cid}`;

    return ResultAsync.fromPromise(fetch(fileUrl), (e) => {
      this.logUtils.error("Failure during getting file from IPFS");
      this.logUtils.error(e);
      throw new IPFSUnavailableError("Failure during getting file from IPFS");
    });
  }

  /**
   * Copies files from one location to another.
   * @param cid
   * @param destination optional
   */
  public copyFile(
    cid: string,
    destination?: string,
  ): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }
    const fromPath = `/ipfs/${cid}`;
    let toPath = destination || cid;

    if (toPath.charAt(0) !== "/") {
      toPath = "/" + toPath;
    }

    return ResultAsync.fromPromise(
      this.httpClient.files.cp(fromPath, toPath),
      (e) => {
        this.logUtils.error(e);
        throw new IPFSUnavailableError("Failure during copying file in IPFS");
      },
    );
  }
}
