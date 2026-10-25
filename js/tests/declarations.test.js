import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

test('TypeScript consumers can use IDE, resolver and renderer runtime contracts', () => {
    const fixture = fileURLToPath(new URL('./fixtures/types/review-contracts.mts', import.meta.url));
    const program = ts.createProgram([fixture], {
        noEmit: true, strict: true, target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    const output = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: path => path,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
    });
    assert.equal(diagnostics.length, 0, output);
});
