import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

const PostSchema = new mongoose.Schema({
  originalFileName: String,
  storedFileName: String,
  fileType: String,
  extractedText: String,
  suggestions: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export async function uploadFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const mime = req.file.mimetype || '';
    let text = '';

    // Read file buffer
    const fileBuffer = fs.readFileSync(req.file.path);

    // PDF
    if (mime === 'application/pdf' || path.extname(req.file.originalname).toLowerCase() === '.pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text || '';
    } 
    // Image
    else if (mime.startsWith('image/')) {
      const result = await Tesseract.recognize(fileBuffer, 'eng');
      text = (result.data.text || '').trim();
    } 
    else {
      text = '';
    }

    // Generate engagement suggestions
    const suggestions = generateSuggestions(text);

    // Save to DB
    const doc = await Post.create({
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      fileType: mime,
      extractedText: text,
      suggestions
    });

    res.json({ 
      id: doc._id, 
      extractedText: text, 
      suggestions, 
      fileUrl: `/uploads/${req.file.filename}` 
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

function generateSuggestions(text) {
  if (!text || typeof text !== 'string' || !text.trim()) 
    return 'No text found — try rescan with clearer image or higher-resolution PDF.';

  const length = text.trim().length;
  const avgWords = text.split(/\s+/).length;
  const hasHashtags = /#/g.test(text);
  const hasQuestions = /\?/g.test(text);

  const score = Math.max(0, Math.min(100, Math.round((Math.min(length, 280) / 280) * 100)));

  const tips = [];
  if (score < 40) tips.push('Post is short — consider adding a hook or question.');
  if (!hasHashtags) tips.push('Add 3–5 relevant hashtags to increase discoverability.');
  if (!hasQuestions) tips.push('Ask a simple question to invite comments.');
  if (avgWords > 60) tips.push('Shorten sentences — keep posts punchy and scannable.');

  return `Engagement score: ${score}/100. Tips: ${tips.join(' ')}`;
}
