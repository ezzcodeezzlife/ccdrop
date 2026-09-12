"use strict";const core=require("@clack/core"),process$1=require("node:process"),e=require("picocolors"),sisteransi=require("sisteransi");function _interopDefaultCompat(t){return t&&typeof t=="object"&&"default"in t?t.default:t}const process__default=_interopDefaultCompat(process$1),e__default=_interopDefaultCompat(e);function isUnicodeSupported(){return process__default.platform!=="win32"?process__default.env.TERM!=="linux":!!process__default.env.CI||!!process__default.env.WT_SESSION||!!process__default.env.TERMINUS_SUBLIME||process__default.env.ConEmuTask==="{cmd::Cmder}"||process__default.env.TERM_PROGRAM==="Terminus-Sublime"||process__default.env.TERM_PROGRAM==="vscode"||process__default.env.TERM==="xterm-256color"||process__default.env.TERM==="alacritty"||process__default.env.TERMINAL_EMULATOR==="JetBrains-JediTerm"}const S=isUnicodeSupported(),u=(t,n)=>S?t:n,U=u("\u25C6","*"),E=u("\u25A0","x"),C=u("\u25B2","x"),x=u("\u25C7","o"),X=u("\u250C","T"),a=u("\u2502","|"),m=u("\u2514","\u2014"),V=u("\u25CF",">"),P=u("\u25CB"," "),T=u("\u25FB","[\u2022]"),f=u("\u25FC","[+]"),k=u("\u25FB","[ ]"),F=u("\u25AA","\u2022"),M=u("\u2500","-"),J=u("\u256E","+"),Y=u("\u251C","+"),Q=u("\u256F","+"),ee=u("\u25CF","\u2022"),te=u("\u25C6","*"),re=u("\u25B2","!"),se=u("\u25A0","x"),h=t=>{switch(t){case"initial":case"active":return e__default.cyan(U);case"cancel":return e__default.red(E);case"error":return e__default.yellow(C);case"submit":return e__default.green(x)}},O=t=>{const{cursor:n,options:s,style:i}=t,r=t.maxItems??1/0,o=Math.max(process.stdout.rows-4,0),c=Math.min(o,Math.max(r,5));let l=0;n>=l+c-3?l=Math.max(Math.min(n-c+3,s.length-c),0):n<l+2&&(l=Math.max(n-2,0));const $=c<s.length&&l>0,p=c<s.length&&l+c<s.length;return s.slice(l,l+c).map((b,v,w)=>{const g=v===0&&$,d=v===w.length-1&&p;return g||d?e__default.dim("..."):i(b,v+l===n)})},text=t=>new core.TextPrompt({validate:t.validate,placeholder:t.placeholder,defaultValue:t.defaultValue,initialValue:t.initialValue,render(){const n=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`,s=t.placeholder?e__default.inverse(t.placeholder[0])+e__default.dim(t.placeholder.slice(1)):e__default.inverse(e__default.hidden("_")),i=this.value?this.valueWithCursor:s;switch(this.state){case"error":return`${n.trim()}
${e__default.yellow(a)}  ${i}
${e__default.yellow(m)}  ${e__default.yellow(this.error)}
`;case"submit":return`${n}${e__default.gray(a)}  ${e__default.dim(this.value||t.placeholder)}`;case"cancel":return`${n}${e__default.gray(a)}  ${e__default.strikethrough(e__default.dim(this.value??""))}${this.value?.trim()?`
`+e__default.gray(a):""}`;default:return`${n}${e__default.cyan(a)}  ${i}
${e__default.cyan(m)}
`}}}).prompt(),password=t=>new core.PasswordPrompt({validate:t.validate,mask:t.mask??F,render(){const n=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`,s=this.valueWithCursor,i=this.masked;switch(this.state){case"error":return`${n.trim()}
${e__default.yellow(a)}  ${i}
${e__default.yellow(m)}  ${e__default.yellow(this.error)}
`;case"submit":return`${n}${e__default.gray(a)}  ${e__default.dim(i)}`;case"cancel":return`${n}${e__default.gray(a)}  ${e__default.strikethrough(e__default.dim(i??""))}${i?`
`+e__default.gray(a):""}`;default:return`${n}${e__default.cyan(a)}  ${s}
${e__default.cyan(m)}
`}}}).prompt(),confirm=t=>{const n=t.active??"Yes",s=t.inactive??"No";return new core.ConfirmPrompt({active:n,inactive:s,initialValue:t.initialValue??!0,render(){const i=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`,r=this.value?n:s;switch(this.state){case"submit":return`${i}${e__default.gray(a)}  ${e__default.dim(r)}`;case"cancel":return`${i}${e__default.gray(a)}  ${e__default.strikethrough(e__default.dim(r))}
${e__default.gray(a)}`;default:return`${i}${e__default.cyan(a)}  ${this.value?`${e__default.green(V)} ${n}`:`${e__default.dim(P)} ${e__default.dim(n)}`} ${e__default.dim("/")} ${this.value?`${e__default.dim(P)} ${e__default.dim(s)}`:`${e__default.green(V)} ${s}`}
${e__default.cyan(m)}
`}}}).prompt()},select=t=>{const n=(s,i)=>{const r=s.label??String(s.value);switch(i){case"selected":return`${e__default.dim(r)}`;case"active":return`${e__default.green(V)} ${r} ${s.hint?e__default.dim(`(${s.hint})`):""}`;case"cancelled":return`${e__default.strikethrough(e__default.dim(r))}`;default:return`${e__default.dim(P)} ${e__default.dim(r)}`}};return new core.SelectPrompt({options:t.options,initialValue:t.initialValue,render(){const s=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`;switch(this.state){case"submit":return`${s}${e__default.gray(a)}  ${n(this.options[this.cursor],"selected")}`;case"cancel":return`${s}${e__default.gray(a)}  ${n(this.options[this.cursor],"cancelled")}
${e__default.gray(a)}`;default:return`${s}${e__default.cyan(a)}  ${O({cursor:this.cursor,options:this.options,maxItems:t.maxItems,style:(i,r)=>n(i,r?"active":"inactive")}).join(`
${e__default.cyan(a)}  `)}
${e__default.cyan(m)}
`}}}).prompt()},selectKey=t=>{const n=(s,i="inactive")=>{const r=s.label??String(s.value);return i==="selected"?`${e__default.dim(r)}`:i==="cancelled"?`${e__default.strikethrough(e__default.dim(r))}`:i==="active"?`${e__default.bgCyan(e__default.gray(` ${s.value} `))} ${r} ${s.hint?e__default.dim(`(${s.hint})`):""}`:`${e__default.gray(e__default.bgWhite(e__default.inverse(` ${s.value} `)))} ${r} ${s.hint?e__default.dim(`(${s.hint})`):""}`};return new core.SelectKeyPrompt({options:t.options,initialValue:t.initialValue,render(){const s=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`;switch(this.state){case"submit":return`${s}${e__default.gray(a)}  ${n(this.options.find(i=>i.value===this.value),"selected")}`;case"cancel":return`${s}${e__default.gray(a)}  ${n(this.options[0],"cancelled")}
${e__default.gray(a)}`;default:return`${s}${e__default.cyan(a)}  ${this.options.map((i,r)=>n(i,r===this.cursor?"active":"inactive")).join(`
${e__default.cyan(a)}  `)}
${e__default.cyan(m)}
`}}}).prompt()},multiselect=t=>{const n=(s,i)=>{const r=s.label??String(s.value);return i==="active"?`${e__default.cyan(T)} ${r} ${s.hint?e__default.dim(`(${s.hint})`):""}`:i==="selected"?`${e__default.green(f)} ${e__default.dim(r)}`:i==="cancelled"?`${e__default.strikethrough(e__default.dim(r))}`:i==="active-selected"?`${e__default.green(f)} ${r} ${s.hint?e__default.dim(`(${s.hint})`):""}`:i==="submitted"?`${e__default.dim(r)}`:`${e__default.dim(k)} ${e__default.dim(r)}`};return new core.MultiSelectPrompt({options:t.options,initialValues:t.initialValues,required:t.required??!0,cursorAt:t.cursorAt,validate(s){if(this.required&&s.length===0)return`Please select at least one option.
${e__default.reset(e__default.dim(`Press ${e__default.gray(e__default.bgWhite(e__default.inverse(" space ")))} to select, ${e__default.gray(e__default.bgWhite(e__default.inverse(" enter ")))} to submit`))}`},render(){let s=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`;const i=(r,o)=>{const c=this.value.includes(r.value);return o&&c?n(r,"active-selected"):c?n(r,"selected"):n(r,o?"active":"inactive")};switch(this.state){case"submit":return`${s}${e__default.gray(a)}  ${this.options.filter(({value:r})=>this.value.includes(r)).map(r=>n(r,"submitted")).join(e__default.dim(", "))||e__default.dim("none")}`;case"cancel":{const r=this.options.filter(({value:o})=>this.value.includes(o)).map(o=>n(o,"cancelled")).join(e__default.dim(", "));return`${s}${e__default.gray(a)}  ${r.trim()?`${r}
${e__default.gray(a)}`:""}`}case"error":{const r=this.error.split(`
`).map((o,c)=>c===0?`${e__default.yellow(m)}  ${e__default.yellow(o)}`:`   ${o}`).join(`
`);return s+e__default.yellow(a)+"  "+O({options:this.options,cursor:this.cursor,maxItems:t.maxItems,style:i}).join(`
${e__default.yellow(a)}  `)+`
`+r+`
`}default:return`${s}${e__default.cyan(a)}  ${O({options:this.options,cursor:this.cursor,maxItems:t.maxItems,style:i}).join(`
${e__default.cyan(a)}  `)}
${e__default.cyan(m)}
`}}}).prompt()},groupMultiselect=t=>{const n=(s,i,r=[])=>{const o=s.label??String(s.value),c=typeof s.group=="string",l=c&&(r[r.indexOf(s)+1]??{group:!0}),$=c&&l.group===!0,p=c?`${$?m:a} `:"";return i==="active"?`${e__default.dim(p)}${e__default.cyan(T)} ${o} ${s.hint?e__default.dim(`(${s.hint})`):""}`:i==="group-active"?`${p}${e__default.cyan(T)} ${e__default.dim(o)}`:i==="group-active-selected"?`${p}${e__default.green(f)} ${e__default.dim(o)}`:i==="selected"?`${e__default.dim(p)}${e__default.green(f)} ${e__default.dim(o)}`:i==="cancelled"?`${e__default.strikethrough(e__default.dim(o))}`:i==="active-selected"?`${e__default.dim(p)}${e__default.green(f)} ${o} ${s.hint?e__default.dim(`(${s.hint})`):""}`:i==="submitted"?`${e__default.dim(o)}`:`${e__default.dim(p)}${e__default.dim(k)} ${e__default.dim(o)}`};return new core.GroupMultiSelectPrompt({options:t.options,initialValues:t.initialValues,required:t.required??!0,cursorAt:t.cursorAt,validate(s){if(this.required&&s.length===0)return`Please select at least one option.
${e__default.reset(e__default.dim(`Press ${e__default.gray(e__default.bgWhite(e__default.inverse(" space ")))} to select, ${e__default.gray(e__default.bgWhite(e__default.inverse(" enter ")))} to submit`))}`},render(){let s=`${e__default.gray(a)}
${h(this.state)}  ${t.message}
`;switch(this.state){case"submit":return`${s}${e__default.gray(a)}  ${this.options.filter(({value:i})=>this.value.includes(i)).map(i=>n(i,"submitted")).join(e__default.dim(", "))}`;case"cancel":{const i=this.options.filter(({value:r})=>this.value.includes(r)).map(r=>n(r,"cancelled")).join(e__default.dim(", "));return`${s}${e__default.gray(a)}  ${i.trim()?`${i}
${e__default.gray(a)}`:""}`}case"error":{const i=this.error.split(`
`).map((r,o)=>o===0?`${e__default.yellow(m)}  ${e__default.yellow(r)}`:`   ${r}`).join(`
`);return`${s}${e__default.yellow(a)}  ${this.options.map((r,o,c)=>{const l=this.value.includes(r.value)||r.group===!0&&this.isGroupSelected(`${r.value}`),$=o===this.cursor;return!$&&typeof r.group=="string"&&this.options[this.cursor].value===r.group?n(r,l?"group-active-selected":"group-active",c):$&&l?n(r,"active-selected",c):l?n(r,"selected",c):n(r,$?"active":"inactive",c)}).join(`
${e__default.yellow(a)}  `)}
${i}
`}default:return`${s}${e__default.cyan(a)}  ${this.options.map((i,r,o)=>{const c=this.value.includes(i.value)||i.group===!0&&this.isGroupSelected(`${i.value}`),l=r===this.cursor;return!l&&typeof i.group=="string"&&this.options[this.cursor].value===i.group?n(i,c?"group-active-selected":"group-active",o):l&&c?n(i,"active-selected",o):c?n(i,"selected",o):n(i,l?"active":"inactive",o)}).join(`
${e__default.cyan(a)}  `)}
${e__default.cyan(m)}
`}}}).prompt()},_=t=>t.replace(ne(),""),note=(t="",n="")=>{const s=`
${t}
`.split(`
`),i=_(n).length,r=Math.max(s.reduce((c,l)=>(l=_(l),l.length>c?l.length:c),0),i)+2,o=s.map(c=>`${e__default.gray(a)}  ${e__default.dim(c)}${" ".repeat(r-_(c).length)}${e__default.gray(a)}`).join(`
`);process.stdout.write(`${e__default.gray(a)}
${e__default.green(x)}  ${e__default.reset(n)} ${e__default.gray(M.repeat(Math.max(r-i-1,1))+J)}
${o}
${e__default.gray(Y+M.repeat(r+2)+Q)}
`)},cancel=(t="")=>{process.stdout.write(`${e__default.gray(m)}  ${e__default.red(t)}

`)},intro=(t="")=>{process.stdout.write(`${e__default.gray(X)}  ${t}
`)},outro=(t="")=>{process.stdout.write(`${e__default.gray(a)}
${e__default.gray(m)}  ${t}

`)},log={message:(t="",{symbol:n=e__default.gray(a)}={})=>{const s=[`${e__default.gray(a)}`];if(t){const[i,...r]=t.split(`
`);s.push(`${n}  ${i}`,...r.map(o=>`${e__default.gray(a)}  ${o}`))}process.stdout.write(`${s.join(`
`)}
`)},info:t=>{log.message(t,{symbol:e__default.blue(ee)})},success:t=>{log.message(t,{symbol:e__default.green(te)})},step:t=>{log.message(t,{symbol:e__default.green(x)})},warn:t=>{log.message(t,{symbol:e__default.yellow(re)})},warning:t=>{log.warn(t)},error:t=>{log.message(t,{symbol:e__default.red(se)})}},spinner=()=>{const t=S?["\u25D2","\u25D0","\u25D3","\u25D1"]:["\u2022","o","O","0"],n=S?80:120;let s,i,r=!1,o="";const c=g=>{const d=g>1?"Something went wrong":"Canceled";r&&w(d,g)},l=()=>c(2),$=()=>c(1),p=()=>{process.on("uncaughtExceptionMonitor",l),process.on("unhandledRejection",l),process.on("SIGINT",$),process.on("SIGTERM",$),process.on("exit",c)},b=()=>{process.removeListener("uncaughtExceptionMonitor",l),process.removeListener("unhandledRejection",l),process.removeListener("SIGINT",$),process.removeListener("SIGTERM",$),process.removeListener("exit",c)},v=(g="")=>{r=!0,s=core.block(),o=g.replace(/\.+$/,""),process.stdout.write(`${e__default.gray(a)}
`);let d=0,y=0;p(),i=setInterval(()=>{const I=e__default.magenta(t[d]),j=".".repeat(Math.floor(y)).slice(0,3);process.stdout.write(sisteransi.cursor.move(-999,0)),process.stdout.write(sisteransi.erase.down(1)),process.stdout.write(`${I}  ${o}${j}`),d=d+1<t.length?d+1:0,y=y<t.length?y+.125:0},n)},w=(g="",d=0)=>{o=g??o,r=!1,clearInterval(i);const y=d===0?e__default.green(x):d===1?e__default.red(E):e__default.red(C);process.stdout.write(sisteransi.cursor.move(-999,0)),process.stdout.write(sisteransi.erase.down(1)),process.stdout.write(`${y}  ${o}
`),b(),s()};return{start:v,stop:w,message:(g="")=>{o=g??o}}};function ne(){const t=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");return new RegExp(t,"g")}const group=async(t,n)=>{const s={},i=Object.keys(t);for(const r of i){const o=t[r],c=await o({results:s})?.catch(l=>{throw l});if(typeof n?.onCancel=="function"&&core.isCancel(c)){s[r]="canceled",n.onCancel({results:s});continue}s[r]=c}return s},tasks=async t=>{for(const n of t){if(n.enabled===!1)continue;const s=spinner();s.start(n.title);const i=await n.task(s.message);s.stop(i||n.title)}};exports.isCancel=core.isCancel,exports.cancel=cancel,exports.confirm=confirm,exports.group=group,exports.groupMultiselect=groupMultiselect,exports.intro=intro,exports.log=log,exports.multiselect=multiselect,exports.note=note,exports.outro=outro,exports.password=password,exports.select=select,exports.selectKey=selectKey,exports.spinner=spinner,exports.tasks=tasks,exports.text=text;
//# sourceMappingURL=index.cjs.map
