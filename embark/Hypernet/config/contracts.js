const deployedContracts = require("../../../.openzeppelin/forked-embark-temp.json");

module.exports = {
  // default applies to all environments
  default: {
    library: 'embarkjs',  // can also be 'web3'

    // order of connections the dapp should connect to
    dappConnection: [
      "$EMBARK",
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],

    // Automatically call `ethereum.enable` if true.
    // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
    // Default value is true.
    dappAutoEnable: true,

    gas: "auto",

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
    //            contracts section.
    // strategy: 'implicit',

    // minimalContractSize, when set to true, tells Embark to generate contract files without the heavy bytecodes
    // Using filteredFields lets you customize which field you want to filter out of the contract file (requires minimalContractSize: true)
    // minimalContractSize: false,
    // filteredFields: [],

		// specify interfaces & libraries so that Embark doesn't try to deploy them:
		interfaces: [
			'AccessControlUpgradeSafe',
			'ContextUpgradeSafe',
			'ERC20BurnableUpgradeSafe',
			'ERC20PauseableUpgradeSafe',
			'ERC20PresetMinterPauserUpgradeSafe',
			'ERC20UpgradeSafe',
			'ForceMoveApp',
			'IERC20',
			'Initializable',
			'PausableUpgradeSafe',
			'SingleAssetPayments'
		],

		libraries: [
			'Address',
			'EnumerableSet',
			'Outcome',
			'SafeMath'
		],

    deploy: {
			// Note that we aren't deploying any contracts at the moment - just referencing ones
			// that are deployed by OpenZeppelin. That's environment specific, so see below for the
			// development-specific settings (and eventually, private/production settings too!)
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
		deploy: {
			// note: because we're using proxy contracts we need to specify
			// the proxy contracts AND the base contracts
			// see: https://framework.embarklabs.io/docs/contracts_configuration.html#Proxy-Contract-Support

			Hypertoken: {
				address: deployedContracts.contracts.Hypertoken.address
			},

			HypernetProtocol: {
				address: deployedContracts.contracts.HypernetProtocol.address
			},

			/*
			HypertokenProxy: {
				address: deployedContracts.proxies["hypernet-protocol/Hypertoken"].address,
				proxyFor: "Hypertoken"
			},

			HypernetProtocolProxy: {
				address: deployedContracts.proxies["hypernet-protocol/HypernetProtocol"].address,
				proxyFor: "HypernetProtocol"
			}
			*/
		}
	},

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {},

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  // custom_name: {}
};
