import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import { request } from 'https';
import { callbackify } from 'util';

const tmpFolter = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  diretory: tmpFolter,
  storage: multer.diskStorage({
    destination: tmpFolter,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fineName = `${fileHash}-${file.originalname}`;
      return callback(null, fineName);
    },
  }),
};
