import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function FileUploader({ onFileUpload, onSampleLoad, selectedPlatform }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMsg('');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg('');
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setErrorMsg(`Unsupported file type (.${ext}). Please upload a PDF document or image file (PNG, JPG, WEBP).`);
      setSelectedFile(null);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 25 MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isPdf = selectedFile?.name?.toLowerCase().endsWith('.pdf');

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Title Header with top spacing */}
      <div className="text-center mb-8 mt-8 pt-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Upload Content for Analysis
        </h2>
      </div>

      {/* Upload Box Container */}
      <div className="glow-border rounded-2xl overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-10 rounded-2xl transition-all">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-white bg-zinc-900 scale-[1.01]'
                : selectedFile
                ? 'border-zinc-400 bg-zinc-900/60'
                : 'border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp"
              className="hidden"
            />

            {!selectedFile ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center mb-4 text-white shadow-inner transition-transform">
                  <UploadCloud className="w-8 h-8 text-white" />
                </div>
                <p className="text-base font-semibold text-zinc-200 text-center">
                  Drag and drop your file here, or <span className="text-white underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-zinc-400 mt-2 text-center">
                  Supports PDF (.pdf) & Images (.png, .jpg, .jpeg, .webp) up to 25MB
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" /> PDF Parsing
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <ImageIcon className="w-3.5 h-3.5 text-white" /> Image Vision OCR
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center mb-3 text-white">
                  {isPdf ? <FileText className="w-7 h-7 text-white" /> : <ImageIcon className="w-7 h-7 text-white" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-base">{selectedFile.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Size: {formatSize(selectedFile.size)} • Type: {isPdf ? 'PDF Document' : 'Image File'}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-3 text-xs text-zinc-400 hover:text-white underline"
                >
                  Change File
                </button>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              disabled={!selectedFile}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                selectedFile
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              }`}
            >
              <span>Analyze Content ({selectedPlatform})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Sample Test Loaders */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-zinc-400 hidden lg:inline">Quick Test:</span>
              <button
                type="button"
                onClick={() => onSampleLoad('pdf')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400" /> Sample PDF
              </button>
              <button
                type="button"
                onClick={() => onSampleLoad('image')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-white" /> Sample Image
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
