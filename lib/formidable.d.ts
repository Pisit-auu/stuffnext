declare module 'formidable' {
    import { IncomingMessage } from 'http';
    export class IncomingForm {
      uploadDir?: string;  // เพิ่ม property uploadDir
      keepExtensions?: boolean;  // เพิ่ม property keepExtensions
  
      parse(req: IncomingMessage, callback: (err: any, fields: any, files: any) => void): void;
    }
  }
  