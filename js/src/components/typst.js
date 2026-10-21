import {defineCollection} from './registry.js';
import {TypstPreview} from './typst-preview.js';
export {TypstPreview} from './typst-preview.js';
export default defineCollection({name:'typst',components:[TypstPreview]});
