// Usage: node review-theme-probes.mjs /absolute/path/to/playwright/index.mjs http://localhost:8205/
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
await page.goto(new URL('w21', process.argv[3]).href);
await page.waitForSelector('gramlot-checkbox');
console.log(await page.evaluate(()=>{
 const form=document.querySelector('gramlot-formlet');
 const toggle=[...document.querySelectorAll('gramlot-checkbox')].find(e=>e.control.getAttribute('role')==='switch');
 document.documentElement.style.setProperty('--gramlot-formlet-gap','27px');
 const before={inherited:getComputedStyle(document.documentElement).getPropertyValue('--gramlot-formlet-gap'),actual:getComputedStyle(form.control).gap};
 toggle.style.setProperty('--gramlot-switch-height','40px');toggle.style.setProperty('--gramlot-switch-width','70px');
 const input=toggle.control,style=getComputedStyle(input),thumb=getComputedStyle(input,'::before');
 return {formlet:before,switch:{trackHeight:style.height,thumbWidth:thumb.width,thumbHeight:thumb.height,thumbLeft:thumb.left}};
}));
await browser.close();
