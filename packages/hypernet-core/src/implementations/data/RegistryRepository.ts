import {
  BlockchainUnavailableError,
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IRegistryRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { BigNumber, ethers } from "ethers";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { GovernanceAbis } from "@hypernetlabs/objects";

class RegistryContracts {
  constructor(public factoryContract: ethers.Contract) {}
}

@injectable()
export class RegistryRepository implements IRegistryRepository {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getRegistries(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const registryListResult: ResultAsync<
          Registry | null,
          BlockchainUnavailableError
        >[] = [];

        // Get registry by index
        for (
          let index = pageSize * pageNumber;
          index >= pageSize * pageNumber - pageSize;
          index--
        ) {
          registryListResult.push(
            this.getRegistryByIndex(index, provider, registryContracts),
          );
        }

        return ResultUtils.combine(registryListResult).map((vals) => {
          const registryList: Registry[] = [];
          vals.forEach((registry) => {
            if (registry != null) {
              registryList.push(registry);
            }
          });
          return registryList;
        });
      },
    );
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const registriesMap: Map<string, Registry> = new Map();

        return ResultUtils.combine(
          registryNames.map((registryName) => {
            return ResultAsync.fromPromise(
              registryContracts.factoryContract.nameToAddress(
                registryName,
              ) as Promise<EthereumAddress>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call nameToAddress()",
                  e,
                );
              },
            ).andThen((registryAddress) => {
              // Call the NFR contract of that address
              const registryContract = new ethers.Contract(
                registryAddress,
                GovernanceAbis.NonFungibleRegistry.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractTotalSupply(registryContract),
              ]).map((vals) => {
                const [
                  registrarAddresses,
                  registrySymbol,
                  registryNumberOfEntries,
                ] = vals;
                registriesMap.set(
                  registryName,
                  new Registry(
                    registrarAddresses,
                    registryAddress,
                    registryName,
                    registrySymbol,
                    registryNumberOfEntries,
                  ),
                );
              });
            });
          }),
        ).map(() => {
          return registriesMap;
        });
      },
    );
  }

  public getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const registriesMap: Map<string, Registry> = new Map();

        return ResultUtils.combine(
          registryAddresses.map((registryAddress) => {
            // Get all registries addresses (indexes)
            return ResultAsync.fromPromise(
              registryContracts.factoryContract.addressToName(
                registryAddress,
              ) as Promise<EthereumAddress>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call nameToAddress()",
                  e,
                );
              },
            ).andThen((registryName) => {
              // Call the NFT contract of that address
              const registryContract = new ethers.Contract(
                registryAddress,
                GovernanceAbis.NonFungibleRegistry.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractTotalSupply(registryContract),
              ]).map((vals) => {
                const [
                  registrarAddresses,
                  registrySymbol,
                  registryNumberOfEntries,
                ] = vals;
                registriesMap.set(
                  registryName,
                  new Registry(
                    registrarAddresses,
                    registryAddress,
                    registryName,
                    registrySymbol,
                    registryNumberOfEntries,
                  ),
                );
              });
            });
          }),
        ).map(() => {
          return registriesMap;
        });
      },
    );
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<Map<string, number>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const totalCountsMap: Map<string, number> = new Map();

        return ResultUtils.combine(
          registryNames.map((registryName) => {
            // Get registry address
            return ResultAsync.fromPromise(
              registryContracts.factoryContract?.nameToAddress(
                registryName,
              ) as Promise<EthereumAddress>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call nameToAddress()",
                  e,
                );
              },
            )
              .andThen((registryAddress) => {
                // Call the NFR contract of that address
                const registryContract = new ethers.Contract(
                  registryAddress,
                  GovernanceAbis.NonFungibleRegistry.abi,
                  provider,
                );
                return this.getRegistryContractTotalSupply(registryContract);
              })
              .map((totalCount) => {
                totalCountsMap.set(registryName, totalCount);
              });
          }),
        ).map(() => {
          return totalCountsMap;
        });
      },
    );
  }

  public getRegistryEntries(
    registryName: string,
    registryEntriesNumberArr?: number[],
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        // Get registry address
        return ResultAsync.fromPromise(
          registryContracts.factoryContract?.nameToAddress(
            registryName,
          ) as Promise<EthereumAddress>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call nameToAddress()",
              e,
            );
          },
        ).andThen((registryAddress) => {
          // Call the NFR contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistry.abi,
            provider,
          );
          let registryEntriesNumberArrResult: ResultAsync<
            number[],
            BlockchainUnavailableError
          >;

          if (registryEntriesNumberArr == null) {
            registryEntriesNumberArrResult = this.getRegistryEntriesTotalCount([
              registryName,
            ]).map((registryEntriesCountMap) => {
              const registryEntriesCount =
                registryEntriesCountMap.get(registryName);
              if (registryEntriesCount == null || registryEntriesCount == 0) {
                return [];
              }
              let countsArr: number[] = [];
              for (let index = registryEntriesCount; index >= 1; index--) {
                countsArr.push(index);
              }
              return countsArr;
            });
          } else {
            registryEntriesNumberArrResult = okAsync(registryEntriesNumberArr);
          }

          return registryEntriesNumberArrResult.andThen(
            (registryEntriesNumberArray) => {
              return ResultUtils.combine(
                registryEntriesNumberArray.map((tokenId) => {
                  return this.getRegistryEntryByTokenId(
                    registryContract,
                    tokenId,
                  );
                }),
              ).map((vals) => {
                return vals
                  .filter((registry) => registry != null)
                  .map((registry) => {
                    return registry;
                  });
              });
            },
          );
        });
      },
    );
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        // Get registry address
        return ResultAsync.fromPromise(
          registryContracts.factoryContract.nameToAddress(
            registryName,
          ) as Promise<EthereumAddress>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call nameToAddress()",
              e,
            );
          },
        ).andThen((registryAddress) => {
          // Call the NFR contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistry.abi,
            provider,
          );

          return ResultAsync.fromPromise(
            registryContract.registryMap(label) as Promise<BigNumber>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryMap registryContract",
                e,
              );
            },
          ).andThen((tokenId) => {
            return ResultUtils.combine([
              ResultAsync.fromPromise(
                registryContract.ownerOf(tokenId) as Promise<EthereumAddress>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call ownerOf registryContract",
                    e,
                  );
                },
              ),
              ResultAsync.fromPromise(
                registryContract.tokenURI(tokenId) as Promise<string>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call tokenURI registryContract",
                    e,
                  );
                },
              ),
              ResultAsync.fromPromise(
                registryContract.allowStorageUpdate() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call allowStorageUpdate registryContract",
                    e,
                  );
                },
              ),
              ResultAsync.fromPromise(
                registryContract.allowLabelChange() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call allowLabelChange registryContract",
                    e,
                  );
                },
              ),
            ]).andThen((vals) => {
              const [
                owner,
                tokenURI,
                storageUpdateAllowed,
                labelChangeAllowed,
              ] = vals;
              return okAsync(
                new RegistryEntry(
                  label,
                  tokenId.toNumber(),
                  owner,
                  tokenURI,
                  storageUpdateAllowed,
                  labelChangeAllowed,
                ),
              );
            });
          });
        });
      },
    );
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen(
      ({ registryContracts, signer }) => {
        // Get registry address
        return ResultAsync.fromPromise(
          registryContracts.factoryContract.nameToAddress(
            registryName,
          ) as Promise<EthereumAddress>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call nameToAddress()",
              e,
            );
          },
        ).andThen((registryAddress) => {
          // Call the NFR contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistry.abi,
            signer,
          );

          return ResultAsync.fromPromise(
            registryContract.updateRegistration(
              BigNumber.from(tokenId),
              registrationData,
            ) as Promise<any>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call updateRegistration registryContract",
                e,
              );
            },
          )
            .andThen((tx) => {
              return ResultAsync.fromPromise(
                tx.wait() as Promise<void>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to wait for tx",
                    e,
                  );
                },
              );
            })
            .andThen(() => {
              return this.getRegistryEntryByTokenId(registryContract, tokenId);
            });
        });
      },
    );
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen(
      ({ registryContracts, signer }) => {
        // Get registry address
        return ResultAsync.fromPromise(
          registryContracts.factoryContract.nameToAddress(
            registryName,
          ) as Promise<EthereumAddress>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call nameToAddress()",
              e,
            );
          },
        ).andThen((registryAddress) => {
          // Call the NFR contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistry.abi,
            signer,
          );

          return ResultAsync.fromPromise(
            registryContract.updateLabel(
              BigNumber.from(tokenId),
              label,
            ) as Promise<any>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call updateRegistration registryContract",
                e,
              );
            },
          )
            .andThen((tx) => {
              return ResultAsync.fromPromise(
                tx.wait() as Promise<void>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to wait for tx",
                    e,
                  );
                },
              );
            })
            .andThen(() => {
              return this.getRegistryEntryByTokenId(registryContract, tokenId);
            });
        });
      },
    );
  }

  private getRegistryByIndex(
    index: number,
    provider: ethers.providers.Provider,
    registryContracts: RegistryContracts,
  ): ResultAsync<Registry | null, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContracts.factoryContract.registries(
        index,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError("Unable to call registries", e);
      },
    )
      .andThen((registryAddress) => {
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          provider,
        );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultUtils.combine([
          this.getRegistryContractRegistrarAddresses(registryContract),
          this.getRegistryContractName(registryContract),
          this.getRegistryContractSymbol(registryContract),
          this.getRegistryContractTotalSupply(registryContract),
        ]).andThen((vals) => {
          const [
            registrarAddresses,
            registryName,
            registrySymbol,
            registryNumberOfEntries,
          ] = vals;

          return okAsync(
            new Registry(
              registrarAddresses,
              registryAddress,
              registryName,
              registrySymbol,
              registryNumberOfEntries,
            ),
          );
        });
      })
      .orElse((e) => {
        // We don't want to throw errors when registry is not found
        this.logUtils.error(e);
        return okAsync(null as unknown as Registry);
      });
  }

  private getRegistryEntryByTokenId(
    registryContract: ethers.Contract,
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract?.reverseRegistryMap(tokenId) as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call reverseRegistryMap label",
          e,
        );
      },
    )
      .andThen((label) => {
        return ResultAsync.fromPromise(
          registryContract.ownerOf(tokenId) as Promise<EthereumAddress>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call ownerOf registryContract",
              e,
            );
          },
        ).andThen((owner) => {
          return ResultAsync.fromPromise(
            registryContract.tokenURI(tokenId) as Promise<string>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call tokenURI registryContract",
                e,
              );
            },
          ).andThen((tokenURI) => {
            return ResultAsync.fromPromise(
              registryContract.allowStorageUpdate() as Promise<boolean>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call allowStorageUpdate registryContract",
                  e,
                );
              },
            ).andThen((storageUpdateAllowed) => {
              return ResultAsync.fromPromise(
                registryContract.allowLabelChange() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call allowLabelChange registryContract",
                    e,
                  );
                },
              ).andThen((labelChangeAllowed) => {
                return okAsync(
                  new RegistryEntry(
                    label,
                    tokenId,
                    owner,
                    tokenURI,
                    storageUpdateAllowed,
                    labelChangeAllowed,
                  ),
                );
              });
            });
          });
        });
      })
      .orElse((e) => {
        // We don't want to throw errors when registry is not found
        this.logUtils.error(e);
        return okAsync(null as unknown as RegistryEntry);
      });
  }

  private getRegistryContractRegistrarAddresses(
    registryContract: ethers.Contract,
  ): ResultAsync<EthereumAddress[], BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.getRoleMemberCount(
        registryContract.REGISTRAR_ROLE(),
      ) as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call getRoleMember",
          e,
        );
      },
    ).andThen((countBigNumber) => {
      const count = countBigNumber.toNumber();
      console.log("getRoleMemberCount count: ", count);
      const registrarResults: ResultAsync<
        EthereumAddress,
        BlockchainUnavailableError
      >[] = [];
      for (let index = 0; index < count; index++) {
        registrarResults.push(
          this.getRegistryContractRegistrar(registryContract, index),
        );
      }
      return ResultUtils.combine(registrarResults);
    });
  }

  private getRegistryContractRegistrar(
    registryContract: ethers.Contract,
    index: number,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.getRoleMember(
        registryContract.REGISTRAR_ROLE(),
        index,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call getRoleMember",
          e,
        );
      },
    );
  }

  private getRegistryContractName(
    registryContract: ethers.Contract,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.name() as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract name()",
          e,
        );
      },
    );
  }

  private getRegistryContractSymbol(
    registryContract: ethers.Contract,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.symbol() as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract symbol()",
          e,
        );
      },
    );
  }

  private getRegistryContractTotalSupply(
    registryContract: ethers.Contract,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.totalSupply() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract totalSupply()",
          e,
        );
      },
    ).map((totalSupply) => totalSupply.toNumber());
  }

  private initializeForWrite(): ResultAsync<
    {
      registryContracts: RegistryContracts;
      signer: ethers.providers.JsonRpcSigner;
    },
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getGovernanceSigner().andThen((signer) => {
      return this.initializeContracts(signer).map((registryContracts) => {
        return {
          registryContracts,
          signer,
        };
      });
    });
  }

  private initializeReadOnly(): ResultAsync<
    {
      registryContracts: RegistryContracts;
      provider: ethers.providers.Provider;
    },
    BlockchainUnavailableError
  > {
    return this.blockchainProvider
      .getGovernanceProvider()
      .andThen((provider) => {
        return this.initializeContracts(provider).map((registryContracts) => {
          return {
            registryContracts,
            provider,
          };
        });
      });
  }

  private initializeContracts(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
  ): ResultAsync<RegistryContracts, never> {
    return this.configProvider.getConfig().map((config) => {
      const registryFactoryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as string,
        GovernanceAbis.RegistryFactory.abi,
        providerOrSigner,
      );

      return new RegistryContracts(registryFactoryContract);
    });
  }
}
