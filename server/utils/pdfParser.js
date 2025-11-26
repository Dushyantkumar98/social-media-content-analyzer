import fs from 'fs';
import pdf from 'pdf-parse';


export default async function parsePDF(filePath) {
const buffer = fs.readFileSync(filePath);
const data = await pdf(buffer);
// pdf-parse returns text; you may want to preserve some simple structure
return data.text || '';
}