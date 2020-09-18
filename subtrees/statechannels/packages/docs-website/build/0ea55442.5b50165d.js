(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{420:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return s}));var n=r(0),a=r.n(n);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=a.a.createContext({}),b=function(e){var t=a.a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},d=function(e){var t=b(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=b(r),u=n,s=d["".concat(i,".").concat(u)]||d[u]||f[u]||c;return r?a.a.createElement(s,o(o({ref:t},p),{},{components:r})):a.a.createElement(s,o({ref:t},p))}));function s(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,i=new Array(c);i[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var p=2;p<c;p++)i[p]=r[p];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},79:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return o})),r.d(t,"rightToc",(function(){return l})),r.d(t,"default",(function(){return b}));var n=r(2),a=r(6),c=(r(0),r(420)),i={id:"iframe-channel-provider.web3channelproviderinterface",title:"Web3ChannelProviderInterface interface",hide_title:!0},o={unversionedId:"typescript-api/iframe-channel-provider.web3channelproviderinterface",id:"typescript-api/iframe-channel-provider.web3channelproviderinterface",isDocsHomePage:!1,title:"Web3ChannelProviderInterface interface",description:"@statechannels/iframe-channel-provider &gt; Web3ChannelProviderInterface",source:"@site/docs/typescript-api/iframe-channel-provider.web3channelproviderinterface.md",permalink:"/typescript-api/iframe-channel-provider.web3channelproviderinterface"},l=[{value:"Web3ChannelProviderInterface interface",id:"web3channelproviderinterface-interface",children:[]},{value:"Remarks",id:"remarks",children:[]},{value:"Methods",id:"methods",children:[]}],p={rightToc:l};function b(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},p,r,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/typescript-api/iframe-channel-provider"}),"@statechannels/iframe-channel-provider")," ",">"," ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/typescript-api/iframe-channel-provider.web3channelproviderinterface"}),"Web3ChannelProviderInterface")),Object(c.b)("h2",{id:"web3channelproviderinterface-interface"},"Web3ChannelProviderInterface interface"),Object(c.b)("blockquote",null,Object(c.b)("p",{parentName:"blockquote"},"This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.")),Object(c.b)("p",null,'For environments where the destinationAddress is secret until the wallet is "enabled".'),Object(c.b)("b",null,"Signature:"),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-typescript"}),"export interface Web3ChannelProviderInterface extends ChannelProviderInterface \n")),Object(c.b)("b",null,"Extends:")," [ChannelProviderInterface](/typescript-api/iframe-channel-provider.channelproviderinterface)",Object(c.b)("h2",{id:"remarks"},"Remarks"),Object(c.b)("p",null,"This is the case e.g. with ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents"}),"MetaMask")," and its connected accounts feature."),Object(c.b)("h2",{id:"methods"},"Methods"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Method"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"/typescript-api/iframe-channel-provider.web3channelproviderinterface.enable"}),"enable()")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("b",null,Object(c.b)("i",null,"(BETA)"))," Enable the wallet, causing it to run the Ethereum Enable workflow")))))}b.isMDXComponent=!0}}]);