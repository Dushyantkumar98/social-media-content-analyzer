import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';


export async function uploadFile(file, onUploadProgress) {
const form = new FormData();
form.append('file', file);
const res = await axios.post(`${API_BASE}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress });
return res.data;
}