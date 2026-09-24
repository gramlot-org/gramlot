// Render Mermaid diagrams as SVG using a supplied temporary tool installation.
import {readFileSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const [toolDirectory, browserExecutable, jobFile] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(resolve(toolDirectory, 'node_modules/playwright-core/index.mjs')));
const browser = await chromium.launch({executablePath:browserExecutable, headless:true});
try {
    const page=await browser.newPage({viewport:{width:1000,height:1000}});
    await page.setContent('<html><body></body></html>');
    await page.addScriptTag({path:resolve(toolDirectory,'node_modules/mermaid/dist/mermaid.min.js')});
    await page.evaluate(() => mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',
        themeVariables:{fontFamily:'Arial, sans-serif',fontSize:'17px',primaryColor:'#eef5fa',
            primaryTextColor:'#22374b',primaryBorderColor:'#4f83a5',lineColor:'#638299'},
        flowchart:{htmlLabels:false,useMaxWidth:true,nodeSpacing:18,rankSpacing:28,padding:14}}));
    const jobs=JSON.parse(readFileSync(jobFile,'utf8'));
    for (let i=0;i<jobs.length;i++) {
        const svg=await page.evaluate(async ({source,id}) => (await mermaid.render(id,source)).svg,
            {source:jobs[i].source,id:`guideDiagram${i}`});
        writeFileSync(jobs[i].output,svg);
    }
    console.log(`Rendered ${jobs.length} vertical Mermaid diagrams.`);
} finally {await browser.close();}
