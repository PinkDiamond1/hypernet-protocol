(window.webpackJsonp=window.webpackJsonp||[]).push([[105],{157:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return c})),a.d(t,"metadata",(function(){return l})),a.d(t,"rightToc",(function(){return i})),a.d(t,"default",(function(){return p}));var n=a(2),r=a(6),b=(a(0),a(420)),c={id:"TESTForceMove",title:"TESTForceMove.sol"},l={unversionedId:"contract-api/natspec/TESTForceMove",id:"contract-api/natspec/TESTForceMove",isDocsHomePage:!1,title:"TESTForceMove.sol",description:"View Source: contracts/test/TESTForceMove.sol",source:"@site/docs/contract-api/natspec/TESTForceMove.md",permalink:"/contract-api/natspec/TESTForceMove",sidebar:"Contract API",previous:{title:"TESTAssetHolder.sol",permalink:"/contract-api/natspec/TESTAssetHolder"},next:{title:"TESTNitroAdjudicator.sol",permalink:"/contract-api/natspec/TESTNitroAdjudicator"}},i=[{value:"Functions",id:"functions",children:[{value:"isAddressInArray",id:"isaddressinarray",children:[]},{value:"validSignatures",id:"validsignatures",children:[]},{value:"acceptableWhoSignedWhat",id:"acceptablewhosignedwhat",children:[]},{value:"recoverSigner",id:"recoversigner",children:[]},{value:"setChannelStorage",id:"setchannelstorage",children:[]},{value:"setChannelStorageHash",id:"setchannelstoragehash",children:[]},{value:"hashChannelData",id:"hashchanneldata",children:[]},{value:"matchesHash",id:"matcheshash",children:[]},{value:"requireChannelOpen",id:"requirechannelopen",children:[]}]}],s={rightToc:i};function p(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(b.b)("wrapper",Object(n.a)({},s,a,{components:t,mdxType:"MDXLayout"}),Object(b.b)("p",null,"View Source: ",Object(b.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/statechannels/monorepo/tree/master/packages/nitro-protocol/contracts/test/TESTForceMove.sol"}),"contracts/test/TESTForceMove.sol")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"\u2197 Extends: ",Object(b.b)("a",Object(n.a)({parentName:"strong"},{href:"/contract-api/natspec/ForceMove"}),"ForceMove"))),Object(b.b)("p",null,"This contract extends the ForceMove contract to enable it to be more easily unit-tested. It exposes public or external functions that set storage variables or wrap otherwise internal functions. It should not be deployed in a production environment."),Object(b.b)("hr",null),Object(b.b)("h2",{id:"functions"},"Functions"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#isaddressinarray"}),"isAddressInArray")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#validsignatures"}),"validSignatures")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#acceptablewhosignedwhat"}),"acceptableWhoSignedWhat")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#recoversigner"}),"recoverSigner")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#setchannelstorage"}),"setChannelStorage")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#setchannelstoragehash"}),"setChannelStorageHash")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#hashchanneldata"}),"hashChannelData")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#matcheshash"}),"matchesHash")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(n.a)({parentName:"li"},{href:"#requirechannelopen"}),"requireChannelOpen"))),Object(b.b)("hr",null),Object(b.b)("h3",{id:"isaddressinarray"},"isAddressInArray"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Tests whether a given address is in a given array of addresses."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function isAddressInArray(address suspect, address[] addresses) public pure\nreturns(bool)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Returns")),Object(b.b)("p",null,"true if the address is in the array, false otherwise"),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"suspect"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"address"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"A single address of interest.")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"addresses"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"address[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"A line-up of possible perpetrators.")))),Object(b.b)("h3",{id:"validsignatures"},"validSignatures"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Given an array of state hashes, checks the validity of the supplied signatures. Valid means there is a signature for each participant, either on the hash of the state for which they are a mover, or on the hash of a state that appears after that state in the array."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function validSignatures(uint48 largestTurnNum, address[] participants, bytes32[] stateHashes, struct IForceMove.Signature[] sigs, uint8[] whoSignedWhat) public pure\nreturns(bool)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Returns")),Object(b.b)("p",null,"true if the signatures are valid, false otherwise"),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"largestTurnNum"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint48"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The largest turn number of the submitted states; will overwrite the stored value of ",Object(b.b)("inlineCode",{parentName:"td"},"turnNumRecord"),".")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"participants"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"address[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"A list of addresses representing the participants of a channel.")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"stateHashes"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Array of keccak256(State) submitted in support of a state,")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"sigs"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"struct IForceMove.Signature[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Array of Signatures, one for each participant")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"whoSignedWhat"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint8[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"participant","[i]"," signed stateHashes[whoSignedWhat","[i]","]")))),Object(b.b)("h3",{id:"acceptablewhosignedwhat"},"acceptableWhoSignedWhat"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Given a declaration of which state in the support proof was signed by which participant, check if this declaration is acceptable. Acceptable means there is a signature for each participant, either on the hash of the state for which they are a mover, or on the hash of a state that appears after that state in the array."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function acceptableWhoSignedWhat(uint8[] whoSignedWhat, uint48 largestTurnNum, uint256 nParticipants, uint256 nStates) public pure\nreturns(bool)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Returns")),Object(b.b)("p",null,"true if whoSignedWhat is acceptable, false otherwise"),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"whoSignedWhat"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint8[]"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"participant","[i]"," signed stateHashes[whoSignedWhat","[i]","]")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"largestTurnNum"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint48"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Largest turnNum of the support proof")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"nParticipants"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Number of participants in the channel")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"nStates"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Number of states in the support proof")))),Object(b.b)("h3",{id:"recoversigner"},"recoverSigner"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Given a digest and digital signature, recover the signer"),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function recoverSigner(bytes32 _d, struct IForceMove.Signature sig) public pure\nreturns(address)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Returns")),Object(b.b)("p",null,"signer"),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"_d"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"message digest")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"sig"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"struct IForceMove.Signature"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"ethereum digital signature")))),Object(b.b)("h3",{id:"setchannelstorage"},"setChannelStorage"),Object(b.b)("p",null,"Manually set the channelStorageHash for a given channelId.  Shortcuts the public methods (ONLY USE IN A TESTING ENVIRONMENT)."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function setChannelStorage(bytes32 channelId, struct IForceMove.ChannelData channelData) public nonpayable\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a state channel.")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelData"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"struct IForceMove.ChannelData"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The channelData to be hashed and stored against the channelId")))),Object(b.b)("h3",{id:"setchannelstoragehash"},"setChannelStorageHash"),Object(b.b)("p",null,"Manually set the channelStorageHash for a given channelId.  Shortcuts the public methods (ONLY USE IN A TESTING ENVIRONMENT)."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function setChannelStorageHash(bytes32 channelId, bytes32 h) public nonpayable\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a state channel.")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"h"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The channelStorageHash to store against the channelId")))),Object(b.b)("h3",{id:"hashchanneldata"},"hashChannelData"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Hashes the input data and formats it for on chain storage."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function hashChannelData(struct IForceMove.ChannelData channelData) public pure\nreturns(newHash bytes32)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelData"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"struct IForceMove.ChannelData"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"ChannelData data.")))),Object(b.b)("h3",{id:"matcheshash"},"matchesHash"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Checks that a given ChannelData struct matches a supplied bytes32 when formatted for storage."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function matchesHash(struct IForceMove.ChannelData cs, bytes32 h) public pure\nreturns(bool)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"cs"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"struct IForceMove.ChannelData"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"A given ChannelData data structure.")),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"h"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Some data in on-chain storage format.")))),Object(b.b)("h3",{id:"requirechannelopen"},"requireChannelOpen"),Object(b.b)("p",null,"Wrapper for otherwise internal function. Checks that a given channel is in the Challenge mode."),Object(b.b)("pre",null,Object(b.b)("code",Object(n.a)({parentName:"pre"},{className:"language-solidity"}),"function requireChannelOpen(bytes32 channelId) public view\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"channelId"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"bytes32"),Object(b.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Unique identifier for a channel.")))))}p.isMDXComponent=!0},420:function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"b",(function(){return j}));var n=a(0),r=a.n(n);function b(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach((function(t){b(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},b=Object.keys(e);for(n=0;n<b.length;n++)a=b[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(e);for(n=0;n<b.length;n++)a=b[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=r.a.createContext({}),p=function(e){var t=r.a.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},o=function(e){var t=p(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},O=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,b=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),o=p(a),O=n,j=o["".concat(c,".").concat(O)]||o[O]||u[O]||b;return a?r.a.createElement(j,l(l({ref:t},s),{},{components:a})):r.a.createElement(j,l({ref:t},s))}));function j(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var b=a.length,c=new Array(b);c[0]=O;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:n,c[1]=l;for(var s=2;s<b;s++)c[s]=a[s];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,a)}O.displayName="MDXCreateElement"}}]);