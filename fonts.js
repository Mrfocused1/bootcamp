const puppeteer=require('puppeteer');
async function check(url){
 const b=await puppeteer.launch();const pg=await b.newPage();
 await pg.evaluateOnNewDocument(()=>{window.__fr='pending';window.__t0=Date.now();document.fonts.ready.then(function(){window.__fr='resolved@'+(Date.now()-window.__t0)+'ms';});});
 await pg.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
 await new Promise(r=>setTimeout(r,4000));
 const r=await pg.evaluate(()=>({fontsReady:window.__fr, status:document.fonts.status, count:document.fonts.size}));
 await b.close(); return r;
}
(async()=>{
 console.log('HOMEPAGE:', JSON.stringify(await check('http://localhost:3000/')));
 console.log('PRICING :', JSON.stringify(await check('http://localhost:3000/pricing')));
})().catch(e=>console.error(e.message));
