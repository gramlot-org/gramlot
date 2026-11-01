import {defineCollection} from './registry.js';
import {Uploader} from './uploader.js';
import {ImageUploader} from './image-uploader.js';
import {AttachmentManager} from './attachment-manager.js';

export {Uploader, ImageUploader, AttachmentManager};
export default defineCollection({name:'uploads', components:[Uploader, ImageUploader, AttachmentManager]});
