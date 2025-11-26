import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';


const router = express.Router();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';


// configure disk storage with original extension
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, uploadDir),
filename: (req, file, cb) => {
const ext = path.extname(file.originalname);
cb(null, uuidv4() + ext);
}
});


const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });


router.post('/upload', upload.single('file'), uploadFile);


export default router;