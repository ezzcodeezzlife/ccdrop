import{TextPrompt as W,PasswordPrompt as q,ConfirmPrompt as F,SelectPrompt as N,SelectKeyPrompt as U,MultiSelectPrompt as D,GroupMultiSelectPrompt as Z,isCancel as z,block as J}from"@clack/core";export{isCancel}from"@clack/core";import h from"node:process";import e from"picocolors";import{cursor as k,erase as A}from"sisteransi";function K(){return h.platform!=="win32"?h.env.TERM!=="linux":!!h.env.CI||!!h.env.WT_SESSION||!!h.env.TERMINUS_SUBLIME||h.env.ConEmuTask==="{cmd::Cmder}"||h.env.TERM_PROGRAM==="Terminus-Sublime"||h.env.TERM_PROGRAM==="vscode"||h.env.TERM==="xterm-256color"||h.env.TERM==="alacritty"||h.env.TERMINAL_EMULATOR==="JetBrains-JediTerm"}const C=K(),u=(s,n)=>C?s:n,Y=u("\u25C6","*"),P=u("\u25A0","x"),V=u("\u25B2","x"),M=u("\u25C7","o"),Q=u("\u250C","T"),a=u("\u2502","|"),$=u("\u2514","\u2014"),I=u("\u25CF",">"),T=u("\u25CB"," "),j=u("\u25FB","[\u2022]"),b=u("\u25FC","[+]"),B=u("\u25FB","[ ]"),X=u("\u25AA","\u2022"),G=u("\u2500","-"),H=u("\u256E","+"),ee=u("\u251C","+"),te=u("\u256F","+"),se=u("\u25CF","\u2022"),re=u("\u25C6","*"),ie=u("\u25B2","!"),ne=u("\u25A0","x"),y=s=>{switch(s){case"initial":case"active":return e.cyan(Y);case"cancel":return e.red(P);case"error":return e.yellow(V);case"submit":return e.green(M)}},E=s=>{const{cursor:n,options:t,style:i}=s,r=s.maxItems??1/0,o=Math.max(process.stdout.rows-4,0),c=Math.min(o,Math.max(r,5));let l=0;n>=l+c-3?l=Math.max(Math.min(n-c+3,t.length-c),0):n<l+2&&(l=Math.max(n-2,0));const d=c<t.length&&l>0,p=c<t.length&&l+c<t.length;return t.slice(l,l+c).map((S,f,x)=>{const g=f===0&&d,m=f===x.length-1&&p;return g||m?e.dim("..."):i(S,f+l===n)})},ae=s=>new W({validate:s.validate,placeholder:s.placeholder,defaultValue:s.defaultValue,initialValue:s.initialValue,render(){const n=`${e.gray(a)}
${y(this.state)}  ${s.message}
`,t=s.placeholder?e.inverse(s.placeholder[0])+e.dim(s.placeholder.slice(1)):e.inverse(e.hidden("_")),i=this.value?this.valueWithCursor:t;switch(this.state){case"error":return`${n.trim()}
${e.yellow(a)}  ${i}
${e.yellow($)}  ${e.yellow(this.error)}
`;case"submit":return`${n}${e.gray(a)}  ${e.dim(this.value||s.placeholder)}`;case"cancel":return`${n}${e.gray(a)}  ${e.strikethrough(e.dim(this.value??""))}${this.value?.trim()?`
`+e.gray(a):""}`;default:return`${n}${e.cyan(a)}  ${i}
${e.cyan($)}
`}}}).prompt(),oe=s=>new q({validate:s.validate,mask:s.mask??X,render(){const n=`${e.gray(a)}
${y(this.state)}  ${s.message}
`,t=this.valueWithCursor,i=this.masked;switch(this.state){case"error":return`${n.trim()}
${e.yellow(a)}  ${i}
${e.yellow($)}  ${e.yellow(this.error)}
`;case"submit":return`${n}${e.gray(a)}  ${e.dim(i)}`;case"cancel":return`${n}${e.gray(a)}  ${e.strikethrough(e.dim(i??""))}${i?`
`+e.gray(a):""}`;default:return`${n}${e.cyan(a)}  ${t}
${e.cyan($)}
`}}}).prompt(),ce=s=>{const n=s.active??"Yes",t=s.inactive??"No";return new F({active:n,inactive:t,initialValue:s.initialValue??!0,render(){const i=`${e.gray(a)}
${y(this.state)}  ${s.message}
`,r=this.value?n:t;switch(this.state){case"submit":return`${i}${e.gray(a)}  ${e.dim(r)}`;case"cancel":return`${i}${e.gray(a)}  ${e.strikethrough(e.dim(r))}
${e.gray(a)}`;default:return`${i}${e.cyan(a)}  ${this.value?`${e.green(I)} ${n}`:`${e.dim(T)} ${e.dim(n)}`} ${e.dim("/")} ${this.value?`${e.dim(T)} ${e.dim(t)}`:`${e.green(I)} ${t}`}
${e.cyan($)}
`}}}).prompt()},le=s=>{const n=(t,i)=>{const r=t.label??String(t.value);switch(i){case"selected":return`${e.dim(r)}`;case"active":return`${e.green(I)} ${r} ${t.hint?e.dim(`(${t.hint})`):""}`;case"cancelled":return`${e.strikethrough(e.dim(r))}`;default:return`${e.dim(T)} ${e.dim(r)}`}};return new N({options:s.options,initialValue:s.initialValue,render(){const t=`${e.gray(a)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${t}${e.gray(a)}  ${n(this.options[this.cursor],"selected")}`;case"cancel":return`${t}${e.gray(a)}  ${n(this.options[this.cursor],"cancelled")}
${e.gray(a)}`;default:return`${t}${e.cyan(a)}  ${E({cursor:this.cursor,options:this.options,maxItems:s.maxItems,style:(i,r)=>n(i,r?"active":"inactive")}).join(`
${e.cyan(a)}  `)}
${e.cyan($)}
`}}}).prompt()},ue=s=>{const n=(t,i="inactive")=>{const r=t.label??String(t.value);return i==="selected"?`${e.dim(r)}`:i==="cancelled"?`${e.strikethrough(e.dim(r))}`:i==="active"?`${e.bgCyan(e.gray(` ${t.value} `))} ${r} ${t.hint?e.dim(`(${t.hint})`):""}`:`${e.gray(e.bgWhite(e.inverse(` ${t.value} `)))} ${r} ${t.hint?e.dim(`(${t.hint})`):""}`};return new U({options:s.options,initialValue:s.initialValue,render(){const t=`${e.gray(a)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${t}${e.gray(a)}  ${n(this.options.find(i=>i.value===this.value),"selected")}`;case"cancel":return`${t}${e.gray(a)}  ${n(this.options[0],"cancelled")}
${e.gray(a)}`;default:return`${t}${e.cyan(a)}  ${this.options.map((i,r)=>n(i,r===this.cursor?"active":"inactive")).join(`
${e.cyan(a)}  `)}
${e.cyan($)}
`}}}).prompt()},$e=s=>{const n=(t,i)=>{const r=t.label??String(t.value);return i==="active"?`${e.cyan(j)} ${r} ${t.hint?e.dim(`(${t.hint})`):""}`:i==="selected"?`${e.green(b)} ${e.dim(r)}`:i==="cancelled"?`${e.strikethrough(e.dim(r))}`:i==="active-selected"?`${e.green(b)} ${r} ${t.hint?e.dim(`(${t.hint})`):""}`:i==="submitted"?`${e.dim(r)}`:`${e.dim(B)} ${e.dim(r)}`};return new D({options:s.options,initialValues:s.initialValues,required:s.required??!0,cursorAt:s.cursorAt,validate(t){if(this.required&&t.length===0)return`Please select at least one option.
${e.reset(e.dim(`Press ${e.gray(e.bgWhite(e.inverse(" space ")))} to select, ${e.gray(e.bgWhite(e.inverse(" enter ")))} to submit`))}`},render(){let t=`${e.gray(a)}
${y(this.state)}  ${s.message}
`;const i=(r,o)=>{const c=this.value.includes(r.value);return o&&c?n(r,"active-selected"):c?n(r,"selected"):n(r,o?"active":"inactive")};switch(this.state){case"submit":return`${t}${e.gray(a)}  ${this.options.filter(({value:r})=>this.value.includes(r)).map(r=>n(r,"submitted")).join(e.dim(", "))||e.dim("none")}`;case"cancel":{const r=this.options.filter(({value:o})=>this.value.includes(o)).map(o=>n(o,"cancelled")).join(e.dim(", "));return`${t}${e.gray(a)}  ${r.trim()?`${r}
${e.gray(a)}`:""}`}case"error":{const r=this.error.split(`
`).map((o,c)=>c===0?`${e.yellow($)}  ${e.yellow(o)}`:`   ${o}`).join(`
`);return t+e.yellow(a)+"  "+E({options:this.options,cursor:this.cursor,maxItems:s.maxItems,style:i}).join(`
${e.yellow(a)}  `)+`
`+r+`
`}default:return`${t}${e.cyan(a)}  ${E({options:this.options,cursor:this.cursor,maxItems:s.maxItems,style:i}).join(`
${e.cyan(a)}  `)}
${e.cyan($)}
`}}}).prompt()},de=s=>{const n=(t,i,r=[])=>{const o=t.label??String(t.value),c=typeof t.group=="string",l=c&&(r[r.indexOf(t)+1]??{group:!0}),d=c&&l.group===!0,p=c?`${d?$:a} `:"";return i==="active"?`${e.dim(p)}${e.cyan(j)} ${o} ${t.hint?e.dim(`(${t.hint})`):""}`:i==="group-active"?`${p}${e.cyan(j)} ${e.dim(o)}`:i==="group-active-selected"?`${p}${e.green(b)} ${e.dim(o)}`:i==="selected"?`${e.dim(p)}${e.green(b)} ${e.dim(o)}`:i==="cancelled"?`${e.strikethrough(e.dim(o))}`:i==="active-selected"?`${e.dim(p)}${e.green(b)} ${o} ${t.hint?e.dim(`(${t.hint})`):""}`:i==="submitted"?`${e.dim(o)}`:`${e.dim(p)}${e.dim(B)} ${e.dim(o)}`};return new Z({options:s.options,initialValues:s.initialValues,required:s.required??!0,cursorAt:s.cursorAt,validate(t){if(this.required&&t.length===0)return`Please select at least one option.
${e.reset(e.dim(`Press ${e.gray(e.bgWhite(e.inverse(" space ")))} to select, ${e.gray(e.bgWhite(e.inverse(" enter ")))} to submit`))}`},render(){let t=`${e.gray(a)}
${y(this.state)}  ${s.message}
`;switch(this.state){case"submit":return`${t}${e.gray(a)}  ${this.options.filter(({value:i})=>this.value.includes(i)).map(i=>n(i,"submitted")).join(e.dim(", "))}`;case"cancel":{const i=this.options.filter(({value:r})=>this.value.includes(r)).map(r=>n(r,"cancelled")).join(e.dim(", "));return`${t}${e.gray(a)}  ${i.trim()?`${i}
${e.gray(a)}`:""}`}case"error":{const i=this.error.split(`
`).map((r,o)=>o===0?`${e.yellow($)}  ${e.yellow(r)}`:`   ${r}`).join(`
`);return`${t}${e.yellow(a)}  ${this.options.map((r,o,c)=>{const l=this.value.includes(r.value)||r.group===!0&&this.isGroupSelected(`${r.value}`),d=o===this.cursor;return!d&&typeof r.group=="string"&&this.options[this.cursor].value===r.group?n(r,l?"group-active-selected":"group-active",c):d&&l?n(r,"active-selected",c):l?n(r,"selected",c):n(r,d?"active":"inactive",c)}).join(`
${e.yellow(a)}  `)}
${i}
`}default:return`${t}${e.cyan(a)}  ${this.options.map((i,r,o)=>{const c=this.value.includes(i.value)||i.group===!0&&this.isGroupSelected(`${i.value}`),l=r===this.cursor;return!l&&typeof i.group=="string"&&this.options[this.cursor].value===i.group?n(i,c?"group-active-selected":"group-active",o):l&&c?n(i,"active-selected",o):c?n(i,"selected",o):n(i,l?"active":"inactive",o)}).join(`
${e.cyan(a)}  `)}
${e.cyan($)}
`}}}).prompt()},R=s=>s.replace(ye(),""),me=(s="",n="")=>{const t=`
${s}
`.split(`
`),i=R(n).length,r=Math.max(t.reduce((c,l)=>(l=R(l),l.length>c?l.length:c),0),i)+2,o=t.map(c=>`${e.gray(a)}  ${e.dim(c)}${" ".repeat(r-R(c).length)}${e.gray(a)}`).join(`
`);process.stdout.write(`${e.gray(a)}
${e.green(M)}  ${e.reset(n)} ${e.gray(G.repeat(Math.max(r-i-1,1))+H)}
${o}
${e.gray(ee+G.repeat(r+2)+te)}
`)},he=(s="")=>{process.stdout.write(`${e.gray($)}  ${e.red(s)}

`)},pe=(s="")=>{process.stdout.write(`${e.gray(Q)}  ${s}
`)},ge=(s="")=>{process.stdout.write(`${e.gray(a)}
${e.gray($)}  ${s}

`)},v={message:(s="",{symbol:n=e.gray(a)}={})=>{const t=[`${e.gray(a)}`];if(s){const[i,...r]=s.split(`
`);t.push(`${n}  ${i}`,...r.map(o=>`${e.gray(a)}  ${o}`))}process.stdout.write(`${t.join(`
`)}
`)},info:s=>{v.message(s,{symbol:e.blue(se)})},success:s=>{v.message(s,{symbol:e.green(re)})},step:s=>{v.message(s,{symbol:e.green(M)})},warn:s=>{v.message(s,{symbol:e.yellow(ie)})},warning:s=>{v.warn(s)},error:s=>{v.message(s,{symbol:e.red(ne)})}},_=()=>{const s=C?["\u25D2","\u25D0","\u25D3","\u25D1"]:["\u2022","o","O","0"],n=C?80:120;let t,i,r=!1,o="";const c=g=>{const m=g>1?"Something went wrong":"Canceled";r&&x(m,g)},l=()=>c(2),d=()=>c(1),p=()=>{process.on("uncaughtExceptionMonitor",l),process.on("unhandledRejection",l),process.on("SIGINT",d),process.on("SIGTERM",d),process.on("exit",c)},S=()=>{process.removeListener("uncaughtExceptionMonitor",l),process.removeListener("unhandledRejection",l),process.removeListener("SIGINT",d),process.removeListener("SIGTERM",d),process.removeListener("exit",c)},f=(g="")=>{r=!0,t=J(),o=g.replace(/\.+$/,""),process.stdout.write(`${e.gray(a)}
`);let m=0,w=0;p(),i=setInterval(()=>{const L=e.magenta(s[m]),O=".".repeat(Math.floor(w)).slice(0,3);process.stdout.write(k.move(-999,0)),process.stdout.write(A.down(1)),process.stdout.write(`${L}  ${o}${O}`),m=m+1<s.length?m+1:0,w=w<s.length?w+.125:0},n)},x=(g="",m=0)=>{o=g??o,r=!1,clearInterval(i);const w=m===0?e.green(M):m===1?e.red(P):e.red(V);process.stdout.write(k.move(-999,0)),process.stdout.write(A.down(1)),process.stdout.write(`${w}  ${o}
`),S(),t()};return{start:f,stop:x,message:(g="")=>{o=g??o}}};function ye(){const s=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");return new RegExp(s,"g")}const ve=async(s,n)=>{const t={},i=Object.keys(s);for(const r of i){const o=s[r],c=await o({results:t})?.catch(l=>{throw l});if(typeof n?.onCancel=="function"&&z(c)){t[r]="canceled",n.onCancel({results:t});continue}t[r]=c}return t},we=async s=>{for(const n of s){if(n.enabled===!1)continue;const t=_();t.start(n.title);const i=await n.task(t.message);t.stop(i||n.title)}};export{he as cancel,ce as confirm,ve as group,de as groupMultiselect,pe as intro,v as log,$e as multiselect,me as note,ge as outro,oe as password,le as select,ue as selectKey,_ as spinner,we as tasks,ae as text};
//# sourceMappingURL=index.mjs.map
