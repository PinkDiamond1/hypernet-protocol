(window.webpackJsonp=window.webpackJsonp||[]).push([[249],{300:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return p})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return l}));var r=n(2),a=n(6),c=(n(0),n(420)),p={id:"client-api-schema.enableethereumresponse",title:"EnableEthereumResponse type",hide_title:!0},o={unversionedId:"typescript-api/client-api-schema.enableethereumresponse",id:"typescript-api/client-api-schema.enableethereumresponse",isDocsHomePage:!1,title:"EnableEthereumResponse type",description:"@statechannels/client-api-schema &gt; EnableEthereumResponse",source:"@site/docs/typescript-api/client-api-schema.enableethereumresponse.md",permalink:"/typescript-api/client-api-schema.enableethereumresponse"},i=[{value:"EnableEthereumResponse type",id:"enableethereumresponse-type",children:[]}],s={rightToc:i};function l(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("a",Object(r.a)({parentName:"p"},{href:"/typescript-api/client-api-schema"}),"@statechannels/client-api-schema")," ",">"," ",Object(c.b)("a",Object(r.a)({parentName:"p"},{href:"/typescript-api/client-api-schema.enableethereumresponse"}),"EnableEthereumResponse")),Object(c.b)("h2",{id:"enableethereumresponse-type"},"EnableEthereumResponse type"),Object(c.b)("b",null,"Signature:"),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"export declare type EnableEthereumResponse = JsonRpcResponse<{\n    signingAddress: Address;\n    destinationAddress: Address;\n    walletVersion: string;\n}>;\n")))}l.isMDXComponent=!0},420:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),l=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=l(n),m=r,f=u["".concat(p,".").concat(m)]||u[m]||b[m]||c;return n?a.a.createElement(f,o(o({ref:t},s),{},{components:n})):a.a.createElement(f,o({ref:t},s))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,p=new Array(c);p[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,p[1]=o;for(var s=2;s<c;s++)p[s]=n[s];return a.a.createElement.apply(null,p)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);