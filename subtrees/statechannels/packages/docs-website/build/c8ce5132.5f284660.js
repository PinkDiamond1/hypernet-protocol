(window.webpackJsonp=window.webpackJsonp||[]).push([[290],{342:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return o})),n.d(t,"default",(function(){return b}));var a=n(2),r=n(6),c=(n(0),n(420)),i={id:"channel-client.channelclient.onbudgetupdated",title:"ChannelClient.onBudgetUpdated() method",hide_title:!0},l={unversionedId:"typescript-api/channel-client.channelclient.onbudgetupdated",id:"typescript-api/channel-client.channelclient.onbudgetupdated",isDocsHomePage:!1,title:"ChannelClient.onBudgetUpdated() method",description:"@statechannels/channel-client &gt; ChannelClient &gt; onBudgetUpdated",source:"@site/docs/typescript-api/channel-client.channelclient.onbudgetupdated.md",permalink:"/typescript-api/channel-client.channelclient.onbudgetupdated"},o=[{value:"ChannelClient.onBudgetUpdated() method",id:"channelclientonbudgetupdated-method",children:[]},{value:"Parameters",id:"parameters",children:[]}],p={rightToc:o};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client"}),"@statechannels/channel-client")," ",">"," ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client.channelclient"}),"ChannelClient")," ",">"," ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client.channelclient.onbudgetupdated"}),"onBudgetUpdated")),Object(c.b)("h2",{id:"channelclientonbudgetupdated-method"},"ChannelClient.onBudgetUpdated() method"),Object(c.b)("blockquote",null,Object(c.b)("p",{parentName:"blockquote"},"This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.")),Object(c.b)("p",null,"Registers callback that will fire when a domain budget is updated."),Object(c.b)("b",null,"Signature:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),"onBudgetUpdated(callback: (result: BudgetUpdatedNotification['params']) => void): UnsubscribeFunction;\n")),Object(c.b)("h2",{id:"parameters"},"Parameters"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Parameter"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"callback"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"(result: ",Object(c.b)("a",Object(a.a)({parentName:"td"},{href:"/typescript-api/client-api-schema.budgetupdatednotification"}),"BudgetUpdatedNotification"),"[","'params'","]",") =",">"," void"),Object(c.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"A function that accepts a BudgetUpdatedNotification.")))),Object(c.b)("b",null,"Returns:"),Object(c.b)("p",null,Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/channel-client.unsubscribefunction"}),"UnsubscribeFunction")),Object(c.b)("p",null,"A function that will unregister the callback when invoked."))}b.isMDXComponent=!0},420:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return h}));var a=n(0),r=n.n(a);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=r.a.createContext({}),b=function(e){var t=r.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=b(e.components);return r.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},s=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,c=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=b(n),s=a,h=u["".concat(i,".").concat(s)]||u[s]||d[s]||c;return n?r.a.createElement(h,l(l({ref:t},p),{},{components:n})):r.a.createElement(h,l({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=n.length,i=new Array(c);i[0]=s;var l={};for(var o in t)hasOwnProperty.call(t,o)&&(l[o]=t[o]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<c;p++)i[p]=n[p];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}s.displayName="MDXCreateElement"}}]);