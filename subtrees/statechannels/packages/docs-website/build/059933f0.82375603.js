(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{420:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return h}));var a=n(0),r=n.n(a);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var b=r.a.createContext({}),o=function(e){var t=r.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=o(e.components);return r.a.createElement(b.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},O=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,c=e.originalType,l=e.parentName,b=p(e,["components","mdxType","originalType","parentName"]),u=o(n),O=a,h=u["".concat(l,".").concat(O)]||u[O]||s[O]||c;return n?r.a.createElement(h,i(i({ref:t},b),{},{components:n})):r.a.createElement(h,i({ref:t},b))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=n.length,l=new Array(c);l[0]=O;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var b=2;b<c;b++)l[b]=n[b];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,n)}O.displayName="MDXCreateElement"},60:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return p})),n.d(t,"default",(function(){return o}));var a=n(2),r=n(6),c=(n(0),n(420)),l={id:"channel-client.channelclient.createchannel",title:"ChannelClient.createChannel() method",hide_title:!0},i={unversionedId:"typescript-api/channel-client.channelclient.createchannel",id:"typescript-api/channel-client.channelclient.createchannel",isDocsHomePage:!1,title:"ChannelClient.createChannel() method",description:"@statechannels/channel-client &gt; ChannelClient &gt; createChannel",source:"@site/docs/typescript-api/channel-client.channelclient.createchannel.md",permalink:"/typescript-api/channel-client.channelclient.createchannel"},p=[{value:"ChannelClient.createChannel() method",id:"channelclientcreatechannel-method",children:[]},{value:"Parameters",id:"parameters",children:[]}],b={rightToc:p};function o(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(a.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client"}),"@statechannels/channel-client")," ",">"," ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client.channelclient"}),"ChannelClient")," ",">"," ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client.channelclient.createchannel"}),"createChannel")),Object(c.b)("h2",{id:"channelclientcreatechannel-method"},"ChannelClient.createChannel() method"),Object(c.b)("blockquote",null,Object(c.b)("p",{parentName:"blockquote"},"This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.")),Object(c.b)("p",null,"Requests a new channel to be created"),Object(c.b)("b",null,"Signature:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),"createChannel(participants: Participant[], allocations: TokenAllocations, appDefinition: string, appData: string, fundingStrategy: FundingStrategy): Promise<ChannelResult>;\n")),Object(c.b)("h2",{id:"parameters"},"Parameters"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Parameter"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"participants"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(a.a)({parentName:"td"},{href:"/typescript-api/client-api-schema.participant"}),"Participant"),"[","]"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Array of Participants for this channel")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"allocations"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(a.a)({parentName:"td"},{href:"/typescript-api/channel-client.tokenallocations"}),"TokenAllocations")),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Initial allocation of funds for this channel")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"appDefinition"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Address of ForceMoveApp deployed on chain")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"appData"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Initial application data for this channel")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"fundingStrategy"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(a.a)({parentName:"td"},{href:"/typescript-api/client-api-schema.fundingstrategy"}),"FundingStrategy")),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"Direct, Ledger or Virtual funding")))),Object(c.b)("b",null,"Returns:"),Object(c.b)("p",null,"Promise","<",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/client-api-schema.channelresult"}),"ChannelResult"),">"),Object(c.b)("p",null,"A promise that resolves to a ChannelResult."))}o.isMDXComponent=!0}}]);