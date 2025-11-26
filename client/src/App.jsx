import React, { useState } from "react";
import DropzoneUploader from "./components/DropzoneUploader";
import { uploadFile } from "./api";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleFile(f) {
    setFile(f);
    setError(null);
    setResult(null);
    setLoading(true);
    setProgress(0);

    try {
      const response = await uploadFile(f, (evt) => {
        if (evt.total) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setProgress(percent);
        }
      });

      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Social Media Content Analyzer</h1>
      <p>Upload a PDF or image to extract text & receive suggestions.</p>

      {/* Upload card */}
      <div className="card">
        <DropzoneUploader onFiles={handleFile} />

        {loading && (
          <div style={{ marginTop: 15 }}>
            <div className="progress">
              <i style={{ width: `${progress}%` }}></i>
            </div>
            <small>{progress}%</small>
          </div>
        )}

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>Results</h2>

          {result.fileUrl && (
            <p>
              <strong>Saved File:</strong> {result.fileUrl}
            </p>
          )}

          <h3>Extracted Text</h3>
          <pre className="pre">
            {result.extractedText || "(No text found in file)"}
          </pre>

          <h3>Suggestions</h3>
          <pre className="pre">{result.suggestions}</pre>
        </div>
      )}
    </div>
  );
}
