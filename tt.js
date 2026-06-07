const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch();const pg=await b.newPage();
 await pg.setViewport({width:1000,height:620});
 await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded',timeout:60000});
 let offs=[];
 for(let i=0;i<12;i++){const v=await pg.evaluate(()=>{const p=document.querySelector('.transition-scribble path');return p?Math.round(parseFloat(getComputedStyle(p).strokeDashoffset)||0):null;});offs.push(v);await new Promise(r=>setTimeout(r,150));}
 console.log('offsets:',JSON.stringify(offs),'animated:',new Set(offs).size>1);
 await pg.screenshot({path:'/tmp/scrib_test.png'});
 await b.close();})().catch(e=>console.error('ERR',e.message));
