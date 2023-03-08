(()=>{"use strict";var e={110:(e,t,s)=>{s.d(t,{Z:()=>a});var i=s(81),o=s.n(i),r=s(645),n=s.n(r)()(o());n.push([e.id,".toolbar{width:100%;display:flex;align-items:center;justify-content:center;padding:12px 0;user-select:none}.toolbar .toolbar__item{width:64px;height:64px;cursor:pointer;padding:6px;border-radius:12px;border:1px solid transparent;margin:1px;transition:.2s ease-in-out}.toolbar .toolbar__item img{max-width:100%;pointer-events:none}.toolbar .toolbar__item:hover{background-color:#FFFFFF;border:1px solid #D9DBDD;color:#665df5;box-shadow:0px 10px 50px rgba(0,0,0,0.1)}.toolbar .toolbar__item.toolbar__item--selected{background-color:#FFFFFF;border:1px solid #665df5;color:#665df5;box-shadow:0px 10px 50px rgba(0,0,0,0.1);transition:none}.toolbar .toolbar__item.toolbar__item--selected img{opacity:0}.cursorItem{width:64px;height:64px;padding:6px;position:fixed;left:0;top:0;pointer-events:none;transition:.05s ease;z-index:1000}\n",""]),n.locals={toolbar:"toolbar",toolbar__item:"toolbar__item","toolbar__item--selected":"toolbar__item--selected",cursorItem:"cursorItem"};const a=n},314:(e,t,s)=>{s.d(t,{Z:()=>a});var i=s(81),o=s.n(i),r=s(645),n=s.n(r)()(o());n.push([e.id,"maze-construction{position:relative}.maze{width:100%;display:flex;flex-direction:column;align-items:center}.maze .line{display:flex;flex-direction:row}.maze .line:first-child .maze__block:first-child{border-top-left-radius:16px}.maze .line:first-child .maze__block:last-child{border-top-right-radius:16px}.maze .line:last-child .maze__block:first-child{border-bottom-left-radius:16px}.maze .line:last-child .maze__block:last-child{border-bottom-right-radius:16px}.maze .maze__block{position:relative;width:64px;height:64px;border:1px solid #665df5}.resizable{position:absolute;width:100%;height:100%;top:0}.resizable .resizable__resizers{position:absolute;width:512px;height:512px;top:0;left:50%;transform:translateX(-50%)}.resizable .resizable__resizers .resizer{border-radius:16px;background-color:#FFFFFF;border:1px solid #D9DBDD;color:#665df5}.resizable .resizable__resizers .resizer.resizer--right{height:256px;width:8px;position:absolute;right:-24px;top:50%;transform:translateY(-50%);cursor:e-resize}.resizable .resizable__resizers .resizer.resizer--left{height:256px;width:8px;position:absolute;left:-24px;top:50%;transform:translateY(-50%);cursor:w-resize}.resizable .resizable__resizers .resizer.resizer--bottom{width:256px;height:8px;position:absolute;left:50%;bottom:-24px;transform:translateX(-50%);cursor:s-resize}.resizable .resizable__resizers .resizer:hover{box-shadow:0px 10px 50px rgba(0,0,0,0.1);border:1px solid #665df5}\n",""]),n.locals={maze:"maze",line:"line",maze__block:"maze__block",resizable:"resizable",resizable__resizers:"resizable__resizers",resizer:"resizer","resizer--right":"resizer--right","resizer--left":"resizer--left","resizer--bottom":"resizer--bottom"};const a=n},645:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var s="",i=void 0!==t[5];return t[4]&&(s+="@supports (".concat(t[4],") {")),t[2]&&(s+="@media ".concat(t[2]," {")),i&&(s+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),s+=e(t),i&&(s+="}"),t[2]&&(s+="}"),t[4]&&(s+="}"),s})).join("")},t.i=function(e,s,i,o,r){"string"==typeof e&&(e=[[null,e,void 0]]);var n={};if(i)for(var a=0;a<this.length;a++){var l=this[a][0];null!=l&&(n[l]=!0)}for(var c=0;c<e.length;c++){var d=[].concat(e[c]);i&&n[d[0]]||(void 0!==r&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=r),s&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=s):d[2]=s),o&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=o):d[4]="".concat(o)),t.push(d))}},t}},81:e=>{e.exports=function(e){return e[1]}},379:e=>{var t=[];function s(e){for(var s=-1,i=0;i<t.length;i++)if(t[i].identifier===e){s=i;break}return s}function i(e,i){for(var r={},n=[],a=0;a<e.length;a++){var l=e[a],c=i.base?l[0]+i.base:l[0],d=r[c]||0,u="".concat(c," ").concat(d);r[c]=d+1;var m=s(u),h={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==m)t[m].references++,t[m].updater(h);else{var p=o(h,i);i.byIndex=a,t.splice(a,0,{identifier:u,updater:p,references:1})}n.push(u)}return n}function o(e,t){var s=t.domAPI(t);return s.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;s.update(e=t)}else s.remove()}}e.exports=function(e,o){var r=i(e=e||[],o=o||{});return function(e){e=e||[];for(var n=0;n<r.length;n++){var a=s(r[n]);t[a].references--}for(var l=i(e,o),c=0;c<r.length;c++){var d=s(r[c]);0===t[d].references&&(t[d].updater(),t.splice(d,1))}r=l}}},216:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,s)=>{e.exports=function(e){var t=s.nc;t&&e.setAttribute("nonce",t)}},795:e=>{e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(s){!function(e,t,s){var i="";s.supports&&(i+="@supports (".concat(s.supports,") {")),s.media&&(i+="@media ".concat(s.media," {"));var o=void 0!==s.layer;o&&(i+="@layer".concat(s.layer.length>0?" ".concat(s.layer):""," {")),i+=s.css,o&&(i+="}"),s.media&&(i+="}"),s.supports&&(i+="}");var r=s.sourceMap;r&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),t.styleTagTransform(i,e,t.options)}(t,e,s)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function s(i){var o=t[i];if(void 0!==o)return o.exports;var r=t[i]={id:i,exports:{}};return e[i](r,r.exports,s),r.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var i in t)s.o(t,i)&&!s.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.nc=void 0,(()=>{const e=()=>Date.now().toString(36)+Math.random().toString(36).substr(2);function t(e){const t=document.createElement("div");return t.innerHTML=e.trim(),t.firstChild}var i=s(379),o=s.n(i),r=s(795),n=s.n(r),a=s(565),l=s.n(a),c=s(216),d=s.n(c),u=s(589),m=s.n(u),h=s(314),p={};h.Z&&h.Z.locals&&(p.locals=h.Z.locals);var b,f=0,v={};v.styleTagTransform=m(),v.setAttributes=l(),v.insert=function(e,t){(t.target||document.head).appendChild(e)},v.domAPI=n(),v.insertStyleElement=d(),p.use=function(e){return v.options=e||{},f++||(b=o()(h.Z,v)),p},p.unuse=function(){f>0&&!--f&&(b(),b=null)};const g=p,{locals:z}=g,w={switchOn:"SwitchOn",loadAudio(e){const t=document.querySelector(`#${e}`);return t.load(),t},loadAudios(){"object"!=typeof this.switchOn&&(this.switchOn=this.loadAudio(this.switchOn))}},y=(customElements.define("maze-construction",class extends HTMLElement{constructor(...e){super(e),g.use(),this.createColumnHandler=this.createColumnHandler.bind(this),this.removeColumnHandler=this.removeColumnHandler.bind(this),this.createRowHandler=this.createRowHandler.bind(this),this.removeRowHandler=this.removeRowHandler.bind(this),this.mouseMoveHandler=this.mouseMoveHandler.bind(this),this.state={amountOfRows:this.getAttribute("rows")||4,amountOfColumns:this.getAttribute("columns")||4,blocks:[],resizeSelected:"",initialPosition:""}}get rows(){if(this.hasAttribute("rows"))return this.getAttribute("rows")}set#e(e){e>=4&&e<=20?(this.setAttribute("rows",e),this.state={...this.state,amountOfRows:this.rows}):this.setAttribute("rows",this.state.amountOfRows)}get columns(){if(this.hasAttribute("columns"))return this.getAttribute("columns")}set#t(e){e>=4&&e<=20?(this.setAttribute("columns",e),this.state={...this.state,amountOfColumns:this.columns}):this.setAttribute("columns",this.state.amountOfColumns)}connectedCallback(){this.rendered||(this.hasAttribute("rows")||(this.#e=this.state.amountOfRows),this.hasAttribute("columns")||(this.#t=this.state.amountOfColumns),this.render(),this.rendered=!0,w.loadAudios())}disconnectedCallback(){this.removeEventsListener()}createColumnHandler(t){const s=parseInt(this.columns)+1;if(this.#t=s,s!=this.columns)return;const i=this.querySelector(`.${z.maze}`).children;Array.from(i).forEach(((t,s)=>{const i=document.createElement("div");i.classList.add(z.maze__block),i.id=e(),t.append(i),this.state.blocks.push({id:i.id,type:"",position:`${s},${this.columns-1}`})})),this.update(),w.switchOn.play()}removeColumnHandler(e){const t=parseInt(this.columns)-1;if(this.#t=t,t!=this.columns)return;const s=this.querySelector(`.${z.maze}`).children;Array.from(s).forEach(((e,t)=>{const s=e.lastChild,i=this.state.blocks.find((e=>e.id===s.id)),o=this.state.blocks.indexOf(i);this.state.blocks.splice(o,1),s.remove()})),this.update(),w.switchOn.play()}createRowHandler(t){const s=parseInt(this.rows)+1;if(this.#e=s,s!=this.rows)return;const i=this.querySelector(`.${z.maze}`),o=document.createElement("div");o.classList.add(z.line);for(let t=0;t<this.state.amountOfColumns;t++){const s=document.createElement("div");s.classList.add(z.maze__block),s.id=e(),o.append(s),this.state.blocks.push({id:s.id,type:"",position:`${this.rows-1},${t}`})}i.append(o),this.update(),w.switchOn.play()}removeRowHandler(e){const t=parseInt(this.rows)-1;if(this.#e=t,t!=this.rows)return;const s=this.querySelector(`.${z.maze}`).lastChild;Array.from(s.children).forEach(((e,t)=>{const s=this.state.blocks.find((t=>t.id===e.id)),i=this.state.blocks.indexOf(s);this.state.blocks.splice(i,1)})),s.remove(),this.update(),w.switchOn.play()}mouseMoveHandler(e){switch(document.querySelectorAll(`.${z.resizer}`)[this.state.resizeSelected].classList[1].split("--")[1]){case"right":this.state.initialPosition+32<e.pageX?(this.state={...this.state,initialPosition:e.pageX},this.createColumnHandler()):this.state.initialPosition-32>e.pageX&&(this.state={...this.state,initialPosition:e.pageX},this.removeColumnHandler());break;case"left":this.state.initialPosition+32<e.pageX?(this.state={...this.state,initialPosition:e.pageX},this.removeColumnHandler()):this.state.initialPosition-32>e.pageX&&(this.state={...this.state,initialPosition:e.pageX},this.createColumnHandler());break;case"bottom":this.state.initialPosition+32<e.pageY?(this.state={...this.state,initialPosition:e.pageY},this.createRowHandler()):this.state.initialPosition-32>e.pageY&&(this.state={...this.state,initialPosition:e.pageY},this.removeRowHandler())}}addEventsListener(){document.querySelectorAll(`.${z.resizer}`).forEach((e=>{e.addEventListener("mousedown",(e=>{e.preventDefault();const t=e.target.classList[1].split("--")[1];this.state={...this.state,resizeSelected:e.target.getAttribute("key"),initialPosition:"bottom"===t?e.pageY:e.pageX},window.addEventListener("mousemove",this.mouseMoveHandler),window.addEventListener("mouseup",(()=>{window.removeEventListener("mousemove",this.mouseMoveHandler),this.state={...this.state,resizeSelected:"",initialPosition:""}}))}))}))}removeEventsListener(){}#s(){let t=document.createElement("div");t.classList.add(z.maze),t.style.gridTemplateColumns=`repeat(${this.state.amountOfColumns}, 1fr)`,t.style.gridTemplateRows=`repeat(${this.state.amountOfRows}, 1fr)`;for(let s=0;s<this.state.amountOfRows;s++){let i=document.createElement("div");i.classList.add(z.line);for(let t=0;t<this.state.amountOfColumns;t++){let o=document.createElement("div");o.classList.add(z.maze__block),o.id=e(),i.append(o),this.state.blocks.push({id:o.id,type:"",position:`${s},${t}`})}t.append(i)}return t}#i(){return`\n                <div class="${z.resizable}">\n                    <div class="${z.resizable__resizers}">\n                        <div class="${z.resizer} resizer--right" key="0"></div>\n                        <div class="${z.resizer} resizer--left" key="1"></div>\n                        <div class="${z.resizer} resizer--bottom" key="2"></div>\n                    </div>\n                </div>\n            `}render(){this.append(this.#s()),this.append(t(this.#i())),this.addEventsListener()}update(){if(this.rendered){const e=document.querySelector(`.${z.resizable__resizers}`);e.style.width=66*this.state.amountOfColumns+"px",e.style.height=66*this.state.amountOfRows+"px"}}}),(()=>{const e=[{id:"path",icon:"PathIcon",label:"Caminho",description:"Construir conjunto de percursos intricados."},{id:"wall",icon:"WallIcon",label:"Muro",description:"Obstaculos difucultando o percuso do personagem."},{id:"mouse",icon:"MouseIcon",label:"Rato",description:"Personagem que busca a saída incerta do labirinto (entrada)."},{id:"cheese",icon:"CheeseIcon",label:"Queijo",description:"Objetivo final do rato (saída)."}],t=[];return{allowedTags:()=>e,notAllowedTags:()=>t}})());var _=s(110),x={};_.Z&&_.Z.locals&&(x.locals=_.Z.locals);var I,k=0,$={};$.styleTagTransform=m(),$.setAttributes=l(),$.insert=function(e,t){(t.target||document.head).appendChild(e)},$.domAPI=n(),$.insertStyleElement=d(),x.use=function(e){return $.options=e||{},k++||(I=o()(_.Z,$)),x},x.unuse=function(){k>0&&!--k&&(I(),I=null)};const H=x,{locals:C}=H,A=window.location.origin+"/app/assets/",E={plungerImmediate:"PlungerImmediate",loadAudio(e){const t=document.querySelector(`#${e}`);return t.load(),t},loadAudios(){"object"!=typeof this.plungerImmediate&&(this.plungerImmediate=this.loadAudio(this.plungerImmediate))}};customElements.define("blocks-toolbar",class extends HTMLElement{constructor(...e){super(e),H.use(),this.keyDownHandler=this.keyDownHandler.bind(this),this.mouseMoveHandler=this.mouseMoveHandler.bind(this),this.state={items:y.allowedTags(),selectedItem:-1}}connectedCallback(){this.rendered||(this.render(),this.rendered=!0,E.loadAudios())}disconnectedCallback(){this.removeEventsListener()}mouseMoveHandler(e){if(this.state.selectedItem>=0){document.querySelector(`.${C.cursorItem}`)||this.append(t(this.#o(this.state.selectedItem)));const s=document.querySelector(`.${C.cursorItem}`);s.style.transform=`\n                    translate3d(\n                        calc(${e.clientX}px - 50%), \n                        calc(${e.clientY}px - 50%), \n                        0)\n                `,s.getAttribute("key")!=this.state.selectedItem&&s.remove()}else document.querySelector(`.${C.cursorItem}`)&&document.querySelector(`.${C.cursorItem}`).remove()}keyDownHandler(e){"Escape"===e.key&&(e.preventDefault(),this.onUnselectedItemHadler())}onUnselectedItemHadler(){if(this.state.selectedItem>=0){this.querySelectorAll(`.${C.toolbar__item}`)[this.state.selectedItem].classList.remove("toolbar__item--selected"),this.state={...this.state,selectedItem:-1};const e=document.querySelector(`.${C.cursorItem}`);e&&e.remove()}}onSelectedItemHadler(e,t){const s=this.querySelectorAll(`.${C.toolbar__item}`);if(this.state.selectedItem>=0&&s[this.state.selectedItem].classList.remove("toolbar__item--selected"),this.state.selectedItem!=t)this.state={...this.state,selectedItem:t},s[this.state.selectedItem].classList.add("toolbar__item--selected");else{this.state={...this.state,selectedItem:-1};const e=document.querySelector(`.${C.cursorItem}`);e&&e.remove()}E.plungerImmediate.play()}addEventsListener(){const e=this.querySelectorAll(`.${C.toolbar__item}`);this.state.items.map(((t,s)=>{e[s].addEventListener("click",(e=>{this.onSelectedItemHadler(e,s)}))})),document.addEventListener("keydown",this.keyDownHandler),document.addEventListener("mousemove",this.mouseMoveHandler)}removeEventsListener(){document.removeEventListener("keydown",this.keyDownHandler),document.removeEventListener("mousemove",this.mouseMoveHandler)}#o(e){return`\n                <div class="${C.cursorItem}" key="${e}">\n                    ${(()=>{const t=this.state.items[e];return`\n                            <img src="${A}${t.icon}.png" alt="${t.id}">\n                        `})()}\n                </div>\n            `}#r(){return`\n                <div class="${C.toolbar}">\n                    ${this.state.items.map(((e,t)=>{const s=this.state.selectedItem,i=this.state.items.indexOf(e)===s;return this.#n(t,i,e)})).join("")}\n                </div>\n            `}#n(e,t,s){return`\n                <div\n                    class="${C.toolbar__item} ${t?"toolbar__item--selected":""}"\n                    key="${e}"\n                    role="button"\n                    tabIndex="0"\n                    title="${s.label}"\n                >\n                    <img src="${A}${s.icon}.png" alt="${s.id}">\n                </div>\n            `}render(){this.append(t(this.#r())),this.addEventsListener()}}),(()=>{const e=document.querySelector("#root"),t=document.createElement("div");t.innerHTML='\n            <blocks-toolbar></blocks-toolbar>\n        \n            <main>\n                <maze-construction rows="8" columns="8"></maze-construction>\n            </main>\n        \n            <audio id="PlungerImmediate">\n                <source src="./assets/PlungerImmediate.mp3" type="audio/mpeg">\n                Your browser does not support the audio element\n            </audio>\n            <audio id="SwitchOn">\n                <source src="./assets/SwitchOn.mp3" type="audio/mpeg">\n                Your browser does not support the audio element\n            </audio>\n        ',e.append(t),console.log("⭐")})()})()})();