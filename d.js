const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch();const pg=await b.newPage();
 const t0=Date.now();let dcl=null,load=null;
 try{await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded',timeout:30000});dcl=Date.now()-t0;}catch(e){console.log('DCL:',e.message);}
 if(dcl){try{await pg.waitForNavigation({waitUntil:'load',timeout:8000});}catch(e){}}
 console.log('DCL fired at:', dcl,'ms');
 await b.close();})().catch(e=>console.error('ERR',e.message));
