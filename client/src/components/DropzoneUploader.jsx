import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


export default function DropzoneUploader({ onFiles }) {
const onDrop = useCallback(acceptedFiles => { if (acceptedFiles.length) onFiles(acceptedFiles[0]); }, [onFiles]);
const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'image/*': [] }, maxFiles: 1 });


return (
<div {...getRootProps()} className="dropzone">
<input {...getInputProps()} />
{isDragActive ? (<p>Drop the file here ...</p>) : (<p>Drag 'n' drop a PDF or image here, or click to select file</p>)}
</div>
)
}