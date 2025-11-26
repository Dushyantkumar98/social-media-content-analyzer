import Tesseract from 'tesseract.js';


export default async function ocrImage(filePath) {
// Tesseract recognizes images from path
const res = await Tesseract.recognize(filePath, 'eng', { logger: m => {/*progress*/} });
return (res && res.data && res.data.text) ? res.data.text : '';
}