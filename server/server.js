import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';
import fs from 'fs';


dotenv.config();


const PORT = process.env.PORT || 5000;
//const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/social-analyzer';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';


// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });


const app = express();
app.use(cors());
app.use(express.json());
app.use(`/uploads`, express.static(path.join(process.cwd(), UPLOAD_DIR)));


app.use('/api', uploadRoutes);


app.get('/', (req, res) => res.send('Social Analyzer API running'));


// mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
// console.log('Connected to MongoDB');
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch(err => {
// console.error('Mongo connection error', err.message);
// });