(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{420:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){b(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},b=Object.keys(e);for(a=0;a<b.length;a++)n=b[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(e);for(a=0;a<b.length;a++)n=b[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=r.a.createContext({}),o=function(e){var t=r.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=o(e.components);return r.a.createElement(u.Provider,{value:t},e.children)},O={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},j=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,b=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=o(n),j=a,d=p["".concat(l,".").concat(j)]||p[j]||O[j]||b;return n?r.a.createElement(d,c(c({ref:t},u),{},{components:n})):r.a.createElement(d,c({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var b=n.length,l=new Array(b);l[0]=j;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:a,l[1]=c;for(var u=2;u<b;u++)l[u]=n[u];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,n)}j.displayName="MDXCreateElement"},52:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return o}));var a=n(2),r=n(6),b=(n(0),n(420)),l={id:"SafeMath",title:"SafeMath.sol"},c={unversionedId:"contract-api/natspec/SafeMath",id:"contract-api/natspec/SafeMath",isDocsHomePage:!1,title:"SafeMath.sol",description:"View Source: @openzeppelin/contracts/math/SafeMath.sol",source:"@site/docs/contract-api/natspec/SafeMath.md",permalink:"/contract-api/natspec/SafeMath",sidebar:"Contract API",previous:{title:"Contract Inheritance",permalink:"/contract-api/contract-inheritance"},next:{title:"Outcome.sol",permalink:"/contract-api/natspec/Outcome"}},i=[{value:"Functions",id:"functions",children:[{value:"add",id:"add",children:[]},{value:"sub",id:"sub",children:[]},{value:"sub",id:"sub-1",children:[]},{value:"mul",id:"mul",children:[]},{value:"div",id:"div",children:[]},{value:"div",id:"div-1",children:[]},{value:"mod",id:"mod",children:[]},{value:"mod",id:"mod-1",children:[]}]}],u={rightToc:i};function o(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(b.b)("wrapper",Object(a.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(b.b)("p",null,"View Source: ",Object(b.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/math/SafeMath.sol"}),"@openzeppelin/contracts/math/SafeMath.sol")),Object(b.b)("p",null,"Wrappers over Solidity's arithmetic operations with added overflow\nchecks."),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Arithmetic operations in Solidity wrap on overflow. This can easily result\nin bugs, because programmers usually assume that an overflow raises an\nerror, which is the standard behavior in high level programming languages.\n",Object(b.b)("inlineCode",{parentName:"li"},"SafeMath")," restores this intuition by reverting the transaction when an\noperation overflows."),Object(b.b)("li",{parentName:"ul"},"Using this library instead of the unchecked operations eliminates an entire\nclass of bugs, so it's recommended to use it always.")),Object(b.b)("hr",null),Object(b.b)("h2",{id:"functions"},"Functions"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#add"}),"add")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#sub"}),"sub")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#sub"}),"sub")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#mul"}),"mul")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#div"}),"div")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#div"}),"div")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#mod"}),"mod")),Object(b.b)("li",{parentName:"ul"},Object(b.b)("a",Object(a.a)({parentName:"li"},{href:"#mod"}),"mod"))),Object(b.b)("hr",null),Object(b.b)("h3",{id:"add"},"add"),Object(b.b)("p",null,"Returns the addition of two unsigned integers, reverting on\noverflow."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `+` operator.\n * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Addition cannot overflow.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function add(uint256 a, uint256 b) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"sub"},"sub"),Object(b.b)("p",null,"Returns the subtraction of two unsigned integers, reverting on\noverflow (when the result is negative)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `-` operator.\n * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Subtraction cannot overflow.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function sub(uint256 a, uint256 b) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"sub-1"},"sub"),Object(b.b)("p",null,"Returns the subtraction of two unsigned integers, reverting with custom message on\noverflow (when the result is negative)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `-` operator.\n * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Subtraction cannot overflow.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function sub(uint256 a, uint256 b, string errorMessage) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"errorMessage"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"mul"},"mul"),Object(b.b)("p",null,"Returns the multiplication of two unsigned integers, reverting on\noverflow."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `*` operator.\n * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Multiplication cannot overflow.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function mul(uint256 a, uint256 b) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"div"},"div"),Object(b.b)("p",null,"Returns the integer division of two unsigned integers. Reverts on\ndivision by zero. The result is rounded towards zero."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `/` operator. Note: this function uses a\n")),Object(b.b)("p",null,Object(b.b)("inlineCode",{parentName:"p"},"revert")," opcode (which leaves remaining gas untouched) while Solidity\nuses an invalid opcode to revert (consuming all remaining gas)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"The divisor cannot be zero.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function div(uint256 a, uint256 b) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"div-1"},"div"),Object(b.b)("p",null,"Returns the integer division of two unsigned integers. Reverts with custom message on\ndivision by zero. The result is rounded towards zero."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `/` operator. Note: this function uses a\n")),Object(b.b)("p",null,Object(b.b)("inlineCode",{parentName:"p"},"revert")," opcode (which leaves remaining gas untouched) while Solidity\nuses an invalid opcode to revert (consuming all remaining gas)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"The divisor cannot be zero.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function div(uint256 a, uint256 b, string errorMessage) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"errorMessage"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"mod"},"mod"),Object(b.b)("p",null,"Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\nReverts when dividing by zero."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `%` operator. This function uses a `revert`\n")),Object(b.b)("p",null,"opcode (which leaves remaining gas untouched) while Solidity uses an\ninvalid opcode to revert (consuming all remaining gas)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"The divisor cannot be zero.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function mod(uint256 a, uint256 b) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))),Object(b.b)("h3",{id:"mod-1"},"mod"),Object(b.b)("p",null,"Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\nReverts with custom message when dividing by zero."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Counterpart to Solidity's `%` operator. This function uses a `revert`\n")),Object(b.b)("p",null,"opcode (which leaves remaining gas untouched) while Solidity uses an\ninvalid opcode to revert (consuming all remaining gas)."),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{})," * Requirements:\n")),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"The divisor cannot be zero.")),Object(b.b)("pre",null,Object(b.b)("code",Object(a.a)({parentName:"pre"},{className:"language-solidity"}),"function mod(uint256 a, uint256 b, string errorMessage) internal pure\nreturns(uint256)\n")),Object(b.b)("p",null,Object(b.b)("strong",{parentName:"p"},"Arguments")),Object(b.b)("table",null,Object(b.b)("thead",{parentName:"table"},Object(b.b)("tr",{parentName:"thead"},Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Name"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Type"),Object(b.b)("th",Object(a.a)({parentName:"tr"},{align:null}),"Description"))),Object(b.b)("tbody",{parentName:"table"},Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"a"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"b"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"uint256"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))),Object(b.b)("tr",{parentName:"tbody"},Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"errorMessage"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}),"string"),Object(b.b)("td",Object(a.a)({parentName:"tr"},{align:null}))))))}o.isMDXComponent=!0}}]);