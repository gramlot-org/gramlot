/** One strict JSON operation; stdout belongs exclusively to the protocol. */
import {generate} from './generate.js';
const emit = process.stdout.write.bind(process.stdout);
// Collection imports are trusted build code, but their logs must not corrupt framing.
process.stdout.write = process.stderr.write.bind(process.stderr);
let result;
try {
    if (![22,24,26].includes(Number(process.versions.node.split('.')[0]))) throw new Error('Supported Node lines: 22, 24, 26');
    let input='';
    for await (const chunk of process.stdin) input+=chunk;
    result=await generate(JSON.parse(input));
} catch(error) {
    result={protocolVersion:1,status:'error',diagnostics:[{level:'error',code:'GENERATION_FAILED',message:error.message}]};
    process.exitCode=2;
}
emit(JSON.stringify(result)+'\n');
