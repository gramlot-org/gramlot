import {Schema} from 'prosemirror-model';
import {schema as baseSchema,MarkdownParser,MarkdownSerializer,defaultMarkdownParser,defaultMarkdownSerializer} from 'prosemirror-markdown';
import {markdownRenderer as md} from './markdown-document.js';

/** Opaque source blocks keep syntax outside the rich editor's supported schema. */
export function createMarkdownCodec(document) {
    const image = {...baseSchema.spec.nodes.get('image'), parseDOM:[{tag:'img[src]', getAttrs:dom=>
        md.validateLink(dom.getAttribute('src')) ? {src:dom.getAttribute('src'),alt:dom.getAttribute('alt'),title:dom.getAttribute('title')} : false}]};
    const link = {...baseSchema.spec.marks.get('link'), parseDOM:[{tag:'a[href]', getAttrs:dom=>
        md.validateLink(dom.getAttribute('href')) ? {href:dom.getAttribute('href'),title:dom.getAttribute('title')} : false}]};
    const schema = new Schema({nodes:baseSchema.spec.nodes.update('image',image).append({source_block:{group:'block',atom:true,
        attrs:{source:{}},toDOM:node=>{
            const element=document.createElement('div');element.className='markdown-source-block';
            element.contentEditable='false';element.title='Preserved Markdown block — edit in Code';
            element.innerHTML=md.render(node.attrs.source);return element;
        }}}),marks:baseSchema.spec.marks.update('link',link)});
    const parser = new MarkdownParser(schema,defaultMarkdownParser.tokenizer,defaultMarkdownParser.tokens);
    const serializer = new MarkdownSerializer({...defaultMarkdownSerializer.nodes,
        source_block:(state,node)=>{state.write(node.attrs.source);state.closeBlock(node);}},defaultMarkdownSerializer.marks);
    function parse(value) {
        if (typeof value !== 'string') throw new TypeError('Markdown editor value must be a string');
        const opaque=source=>schema.nodes.source_block.create({source});
        if (/^ {0,3}\[[^\]]+\]:/m.test(value) || /^---\r?\n/.test(value)) return schema.node('doc',null,[opaque(value)]);
        const lines=value.split('\n'),tokens=md.parse(value,{}),nodes=[];
        for (const token of tokens) {
            if (token.level!==0 || !token.map || token.nesting===-1) continue;
            const source=lines.slice(token.map[0],token.map[1]).join('\n');
            const complex=!['fence','code_block'].includes(token.type) && (md.parse(source,{}).some(item=>item.type==='table_open') || /<\/?[A-Za-z][^>]*>|<!--|~~/.test(source) || /^\s*[-+*]\s+\[[ xX]\]/m.test(source));
            if (complex) nodes.push(opaque(source));
            else parser.parse(source).content.forEach(node=>nodes.push(node));
        }
        return schema.node('doc',null,nodes.length ? nodes : [schema.node('paragraph')]);
    }
    return {schema,parse,serialize:doc=>serializer.serialize(doc)};
}
