/** One strict JSON operation; stdout belongs exclusively to the protocol. */
import {generate} from './generate.js';
const emit = process.stdout.write.bind(process.stdout);
// Collection imports are trusted build code, but their logs must not corrupt framing.
process.stdout.write = process.stderr.write.bind(process.stderr);
let result;
try {
    if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node 22 or later is required');
    let input='';
    for await (const chunk of process.stdin) input+=chunk;
    result=await generate(JSON.parse(input));
} catch(error) {
    result={protocolVersion:1,status:'error',diagnostics:[{level:'error',code:'GENERATION_FAILED',message:error.message}]};
    process.exitCode=2;
}
emit(JSON.stringify(result)+'\n');
