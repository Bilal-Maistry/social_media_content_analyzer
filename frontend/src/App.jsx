import React, { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleFileUpload = async (file) => {
    setLoading(true);
    setErrorMsg('');
    setAnalysisData(null);

    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    setFileInfo({ name: file.name, type: isPdf ? 'PDF' : 'IMAGE' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', selectedPlatform);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('API Error:', err);
      setErrorMsg(err.message || 'Unable to connect to backend server. Make sure the Spring Boot application is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = (type) => {
    const isPdf = type === 'pdf';
    const sampleContent = isPdf
      ? "Social Media Content Strategy 2026\n\nHow we increased engagement by 300% using structured visual hooks.\n1. Write line 1 as a problem-solving curiosity hook.\n2. Keep paragraph lengths under 3 lines for high skimmability.\n3. Add an explicit call-to-action asking readers to save or comment below.\n\nDrop a comment if you found this guide helpful!"
      : "Visual Campaign Poster\n\nUnlock Your Social Media Reach\n• 5x growth through video carousels\n• Targeted hashtags for viral discovery\n• High converting call-to-action prompts\n\nSave this post for later!";

    const filename = isPdf ? 'Sample_Strategy.pdf' : 'Sample_Poster.png';
    const blob = new Blob([sampleContent], { type: isPdf ? 'application/pdf' : 'image/png' });
    const sampleFile = new File([blob], filename, { type: isPdf ? 'application/pdf' : 'image/png' });

    handleFileUpload(sampleFile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Top Header */}
      <Header selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {errorMsg && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-white shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg('')}
                className="text-zinc-400 hover:text-white font-bold text-sm px-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!loading && !analysisData && (
          <FileUploader
            onFileUpload={handleFileUpload}
            onSampleLoad={handleSampleLoad}
            selectedPlatform={selectedPlatform}
          />
        )}

        {loading && (
          <LoadingState
            fileName={fileInfo?.name}
            fileType={fileInfo?.type}
            targetPlatform={selectedPlatform}
          />
        )}

        {!loading && analysisData && (
          <ResultsDashboard
            data={analysisData}
            onReset={() => {
              setAnalysisData(null);
              setFileInfo(null);
              setErrorMsg('');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-black py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Social Media Content Analyzer. Apache PDFBox & Gemini Flash Vision Engine.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Live API Engine Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
