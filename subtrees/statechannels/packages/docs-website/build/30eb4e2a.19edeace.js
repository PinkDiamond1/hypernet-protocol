(window.webpackJsonp=window.webpackJsonp||[]).push([[79],{131:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return p})),n.d(t,"default",(function(){return s}));var a=n(2),r=n(6),i=(n(0),n(420)),c={id:"client-api-schema.statechannelsnotificationtype",title:"StateChannelsNotificationType type",hide_title:!0},o={unversionedId:"typescript-api/client-api-schema.statechannelsnotificationtype",id:"typescript-api/client-api-schema.statechannelsnotificationtype",isDocsHomePage:!1,title:"StateChannelsNotificationType type",description:"@statechannels/client-api-schema &gt; StateChannelsNotificationType",source:"@site/docs/typescript-api/client-api-schema.statechannelsnotificationtype.md",permalink:"/typescript-api/client-api-schema.statechannelsnotificationtype"},p=[{value:"StateChannelsNotificationType type",id:"statechannelsnotificationtype-type",children:[]}],l={rightToc:p};function s(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/client-api-schema"}),"@statechannels/client-api-schema")," ",">"," ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/typescript-api/client-api-schema.statechannelsnotificationtype"}),"StateChannelsNotificationType")),Object(i.b)("h2",{id:"statechannelsnotificationtype-type"},"StateChannelsNotificationType type"),Object(i.b)("b",null,"Signature:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),"export declare type StateChannelsNotificationType = {\n    [T in StateChannelsNotification['method']]: [FilterByMethod<StateChannelsNotification, T>['params']];\n};\n")))}s.isMDXComponent=!0},420:function(e,t,n){"use strict";n.d(t,"a",(function(){return f})),n.d(t,"b",(function(){return b}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=r.a.createContext({}),s=function(e){var t=r.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},f=function(e){var t=s(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},y=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),f=s(n),y=a,b=f["".concat(c,".").concat(y)]||f[y]||u[y]||i;return n?r.a.createElement(b,o(o({ref:t},l),{},{components:n})):r.a.createElement(b,o({ref:t},l))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,c=new Array(i);c[0]=y;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var l=2;l<i;l++)c[l]=n[l];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}y.displayName="MDXCreateElement"}}]);