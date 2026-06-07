const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch();const pg=await b.newPage();
 await pg.setViewport({width:1100,height:680});
 let dcl=null; const t0=Date.now();
 try{ await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded',timeout:30000}); dcl=Date.now()-t0; }catch(e){ console.log('DCL timeout:',e.message); }
 console.log('DCL fired at:', dcl, 'ms');
 await new Promise(r=>setTimeout(r,2500));
 await pg.screenshot({path:'/tmp/home_state.png'});
 // is content visible / blue gone?
 const info=await pg.evaluate(()=>({h1: (document.querySelector('h1')||{}).textContent, bodyBg: getComputedStyle(document.body).backgroundColor}));
 console.log(JSON.stringify(info));
 await b.close();})().catch(e=>console.error('ERR',e.message));
