(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{420:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return O}));var n=a(0),r=a.n(n);function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=r.a.createContext({}),i=function(e){var t=r.a.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=i(e.components);return r.a.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,c=e.originalType,b=e.parentName,o=s(e,["components","mdxType","originalType","parentName"]),p=i(a),u=n,O=p["".concat(b,".").concat(u)]||p[u]||d[u]||c;return a?r.a.createElement(O,l(l({ref:t},o),{},{components:a})):r.a.createElement(O,l({ref:t},o))}));function O(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=a.length,b=new Array(c);b[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,b[1]=l;for(var o=2;o<c;o++)b[o]=a[o];return r.a.createElement.apply(null,b)}return r.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"},68:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return b})),a.d(t,"metadata",(function(){return l})),a.d(t,"rightToc",(function(){return s})),a.d(t,"default",(function(){return i}));var n=a(2),r=a(6),c=(a(0),a(420)),b={id:"TESTAssetHolder",title:"TESTAssetHolder.sol"},l={unversionedId:"contract-api/natspec/TESTAssetHolder",id:"contract-api/natspec/TESTAssetHolder",isDocsHomePage:!1,title:"TESTAssetHolder.sol",description:"View Source: contracts/test/TESTAssetHolder.sol",source:"@site/docs/contract-api/natspec/TESTAssetHolder.md",permalink:"/contract-api/natspec/TESTAssetHolder",sidebar:"Contract API",previous:{title:"TrivialApp.sol",permalink:"/contract-api/natspec/TrivialApp"},next:{title:"TESTForceMove.sol",permalink:"/contract-api/natspec/TESTForceMove"}},s=[{value:"Functions",id:"functions",children:[{value:"constructor",id:"constructor",children:[]},{value:"setHoldings",id:"setholdings",children:[]},{value:"setAssetOutcomeHashPermissionless",id:"setassetoutcomehashpermissionless",children:[]},{value:"transferAllAdjudicatorOnly",id:"transferalladjudicatoronly",children:[]},{value:"isExternalDestination",id:"isexternaldestination",children:[]},{value:"addressToBytes32",id:"addresstobytes32",children:[]}]}],o={rightToc:s};function i(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},o,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,"View Source: ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/statechannels/monorepo/tree/master/packages/nitro-protocol/contracts/test/TESTAssetHolder.sol"}),"contracts/test/TESTAssetHolder.sol")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"\u2197 Extends: ",Object(c.b)("a",Object(n.a)({parentName:"strong"},{href:"/contract-api/natspec/AssetHolder"}),"AssetHolder")),"\n",Object(c.b)("strong",{parentName:"p"},"\u2198 Derived Contracts: ",Object(c.b)("a",Object(n.a)({parentName:"strong"},{href:"/contract-api/natspec/TESTAssetHolder2"}),"TESTAssetHolder2"))),Object(c.b)("p",null,"This contract extends the AssetHolder contract to enable it to be more easily unit-tested. It exposes public or external functions that set storage variables or wrap otherwise internal functions. It should not be deployed in a production environment."),Object(c.b)("hr",null),Object(c.b)("h2",{id:"functions"},"Functions"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#constructor"}),"constructor")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#setholdings"}),"setHoldings")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#setassetoutcomehashpermissionless"}),"setAssetOutcomeHashPermissionless")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#transferalladjudicatoronly"}),"transferAllAdjudicatorOnly")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#isexternaldestination"}),"isExternalDestination")),Object(c.b)("li",{parentName:"ul"},Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"#addresstobytes32"}),"addressToBytes32"))),Object(c.b)("hr",null),Object(c.b)("h3",{id:"constructor"},"constructor"),Object(c.b)("p",null,"Constructor function storing the AdjudicatorAddress."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"constructor(address _AdjudicatorAddress) public nonpayable\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"_AdjudicatorAddress"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"address"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Address of an Adjudicator  contract, supplied at deploy-time.")))),Object(c.b)("h3",{id:"setholdings"},"setHoldings"),Object(c.b)("p",null,"Manually set the holdings mapping to a given amount for a given channelId.  Shortcuts the deposit workflow (ONLY USE IN A TESTING ENVIRONMENT)"),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function setHoldings(bytes32 channelId, uint256 amount) external nonpayable\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a state channel.")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"amount"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint256"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),'The number of assets that should now be "escrowed: against channelId')))),Object(c.b)("h3",{id:"setassetoutcomehashpermissionless"},"setAssetOutcomeHashPermissionless"),Object(c.b)("p",null,"Sets the given assetOutcomeHash for the given channelId in the assetOutcomeHashes storage mapping, but circumvents the AdjudicatorOnly modifier (thereby allowing externally owned accounts to call the method)."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function setAssetOutcomeHashPermissionless(bytes32 channelId, bytes32 assetOutcomeHash) external nonpayable\nreturns(success bool)\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a state channel.")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"assetOutcomeHash"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The keccak256 of the abi.encode of the Outcome.")))),Object(c.b)("h3",{id:"transferalladjudicatoronly"},"transferAllAdjudicatorOnly"),Object(c.b)("p",null,"Transfers the funds escrowed against ",Object(c.b)("inlineCode",{parentName:"p"},"channelId")," to the beneficiaries of that channel. No checks performed against storage in this contract. Permissions have been bypassed for testing purposes."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function transferAllAdjudicatorOnly(bytes32 channelId, bytes allocationBytes) external nonpayable\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a state channel.")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"allocationBytes"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The abi.encode of AssetOutcome.Allocation")))),Object(c.b)("h3",{id:"isexternaldestination"},"isExternalDestination"),Object(c.b)("p",null,"Wrapper for otherwise internal function. Checks if a given destination is external (and can therefore have assets transferred to it) or not."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function isExternalDestination(bytes32 destination) public pure\nreturns(bool)\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns")),Object(c.b)("p",null,"True if the destination is external, false otherwise."),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"destination"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Destination to be checked.")))),Object(c.b)("h3",{id:"addresstobytes32"},"addressToBytes32"),Object(c.b)("p",null,"Wrapper for otherwise internal function. Converts an ethereum address to a nitro external destination."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function addressToBytes32(address participant) public pure\nreturns(bytes32)\n")),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns")),Object(c.b)("p",null,"The input address left-padded with zeros."),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Arguments")),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"participant"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"address"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The address to be converted.")))))}i.isMDXComponent=!0}}]);