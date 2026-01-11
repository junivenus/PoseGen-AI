
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import PosePresets from './components/PosePresets';
import { generateVariation } from './services/geminiService';
import { GenerationResult } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("DATA_OVERFLOW: 画像サイズは5MB以下にしてください。");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!imagePreview || (!selectedPreset && !customPrompt)) {
      setError("INPUT_REQUIRED: 画像とポーズを指定してください。");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imageFile?.type || 'image/png';
      const promptText = customPrompt || selectedPreset || "";

      const resultUrl = await generateVariation(base64Data, mimeType, promptText);

      if (resultUrl) {
        const newResult: GenerationResult = {
          originalUrl: imagePreview,
          generatedUrl: resultUrl,
          prompt: promptText,
          timestamp: Date.now(),
        };
        setResults((prev) => [newResult, ...prev]);
        setSelectedPreset(null);
        setCustomPrompt('');
      } else {
        throw new Error("CORE_FAULT: 画像の生成に失敗しました。");
      }
    } catch (err: any) {
      setError(err.message || "SYSTEM_ERROR: 予期せぬエラーが発生しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    setSelectedPreset(null);
    setCustomPrompt('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-20 relative">
      {/* Background Grid Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Control Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a0a0f] border-l-4 border-cyan-400 p-6 shadow-[10px_10px_0_rgba(0,243,255,0.05)] relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                <i className="fas fa-qrcode text-6xl text-cyan-400"></i>
              </div>
              
              <h2 className="text-sm font-black mb-4 cyber-font flex items-center text-cyan-400 tracking-[0.2em]">
                <span className="w-2.5 h-2.5 bg-cyan-400 mr-2 shadow-[0_0_8px_#00f3ff]"></span>
                UPLOAD_DATA
              </h2>
              
              {!imagePreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 bg-black/60 h-64 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/10 transition-all group relative"
                >
                  <div className="mono-font text-[11px] absolute top-2 right-2 text-cyan-500/60 font-bold tracking-widest">ST_BY: IDLE</div>
                  <div className="w-16 h-16 border-2 border-gray-600 group-hover:border-cyan-400 flex items-center justify-center mb-4 transition-colors">
                    <i className="fas fa-plus text-2xl text-gray-200 group-hover:text-cyan-400"></i>
                  </div>
                  <p className="text-xs font-black cyber-font text-white group-hover:text-cyan-400 uppercase tracking-[0.2em]">Select Source File</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="relative group border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                  <img 
                    src={imagePreview} 
                    alt="Upload Preview" 
                    className="w-full h-64 object-cover filter brightness-90 group-hover:brightness-100 transition-all"
                  />
                  <div className="absolute inset-0 border-2 border-cyan-400/30 pointer-events-none"></div>
                  <button 
                    onClick={clearSelection}
                    className="absolute top-0 right-0 bg-red-600 text-white w-10 h-10 flex items-center justify-center hover:bg-red-500 transition-colors shadow-xl z-10"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                  <div className="absolute bottom-0 left-0 bg-cyan-500 text-black px-2 py-1 text-[11px] font-black cyber-font uppercase tracking-wider">
                    FILE_CONFIRMED
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0a0a0f] border-l-4 border-magenta-500 p-6 shadow-[10px_10px_0_rgba(255,0,255,0.05)] relative ring-1 ring-white/5">
              <h2 className="text-sm font-black mb-4 cyber-font flex items-center text-magenta-400 tracking-[0.2em]">
                <span className="w-2.5 h-2.5 bg-magenta-500 mr-2 shadow-[0_0_8px_#ff00ff]"></span>
                POSE_PARAMETERS
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-gray-200 mb-2 block mono-font uppercase tracking-[0.2em]">Preset_Protocols</label>
                  <PosePresets 
                    onSelect={(p) => { setSelectedPreset(p); setCustomPrompt(''); }}
                    disabled={isGenerating || !imagePreview}
                    selectedPose={selectedPreset}
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-black text-gray-200 mb-2 block mono-font uppercase tracking-[0.2em]">Override_Prompt</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPreset(null); }}
                      placeholder="Input custom behavior sequence..."
                      disabled={isGenerating || !imagePreview}
                      className="w-full bg-black border border-gray-600 px-4 py-3 text-sm font-bold focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none mono-font text-white placeholder-gray-500"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-400 shadow-[0_0_5px_#00f3ff]"></div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/40 border-2 border-red-500 text-white text-[11px] font-black mono-font flex items-center uppercase tracking-wider italic">
                    <i className="fas fa-exclamation-triangle mr-2 text-red-400"></i>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !imagePreview || (!selectedPreset && !customPrompt)}
                  className={`
                    w-full py-4 cyber-font font-black text-sm tracking-[0.3em] uppercase transition-all flex items-center justify-center relative group overflow-hidden
                    ${isGenerating || !imagePreview || (!selectedPreset && !customPrompt)
                      ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                      : 'bg-cyan-500 text-black hover:bg-white hover:shadow-[0_0_25px_#00f3ff] active:scale-[0.97] glitch-hover'
                    }
                  `}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <i className="fas fa-sync-alt fa-spin mr-3"></i>
                      PROCESSING_UNIT...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <i className="fas fa-bolt mr-3"></i>
                      EXECUTE_SEQUENCE
                    </span>
                  )}
                  {/* Decorative diagonal lines */}
                  <div className="absolute top-0 right-0 w-8 h-full bg-black/10 skew-x-[45deg] translate-x-12 group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Results Panel */}
          <div className="lg:col-span-7">
            <div className="bg-[#0a0a0f] border border-gray-700 p-6 min-h-[600px] shadow-2xl relative ring-1 ring-white/5">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-magenta-500"></div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-magenta-500"></div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-400"></div>

              <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-sm font-black cyber-font flex items-center text-white tracking-[0.2em] italic">
                  <i className="fas fa-terminal text-magenta-400 mr-3 shadow-[0_0_5px_#ff00ff]"></i>
                  OUTPUT_LOGS
                </h2>
                <div className="flex items-center space-x-4">
                    <span className="text-[11px] mono-font text-cyan-300 font-black uppercase tracking-widest">Buffer: {results.length} blocks</span>
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[450px] text-gray-500">
                  <div className="w-24 h-24 border-2 border-gray-700 rounded-full flex items-center justify-center mb-6 relative">
                    <i className="fas fa-ghost text-4xl opacity-40"></i>
                    <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <p className="text-xs font-black cyber-font text-gray-300 uppercase tracking-[0.2em] mb-1">Waiting for transmission...</p>
                  <p className="text-[11px] mono-font italic text-gray-400">Establish uplink via control panel</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {results.map((result) => (
                    <div key={result.timestamp} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-magenta-500 to-cyan-500 opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                      <div className="relative bg-black border border-gray-600 p-5">
                        <div className="flex flex-col md:flex-row gap-5 mb-5">
                          <div className="flex-1 relative overflow-hidden group/img">
                            <p className="text-[10px] font-black text-gray-300 mono-font mb-2 uppercase tracking-widest flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 mr-2"></span>
                              REF_SOURCE
                            </p>
                            <img 
                              src={result.originalUrl} 
                              alt="Original" 
                              className="w-full h-56 object-cover border-2 border-gray-800 grayscale-[0.3] hover:grayscale-0 transition-all cursor-crosshair"
                            />
                            <div className="absolute top-8 left-0 w-full h-[1px] bg-white/10 pointer-events-none"></div>
                          </div>
                          <div className="flex items-center justify-center py-2 md:py-0">
                            <div className="w-12 h-12 border-2 border-magenta-500 shadow-[0_0_10px_rgba(255,0,255,0.2)] flex items-center justify-center rotate-45 text-white bg-magenta-600/20">
                              <i className="fas fa-exchange-alt -rotate-45 text-sm"></i>
                            </div>
                          </div>
                          <div className="flex-1 relative overflow-hidden group/img">
                            <p className="text-[10px] font-black text-cyan-300 mono-font mb-2 uppercase tracking-widest flex items-center">
                              <span className="w-1.5 h-1.5 bg-cyan-400 mr-2 shadow-[0_0_5px_#00f3ff]"></span>
                              RECONSTRUCTED_OUTPUT
                            </p>
                            <img 
                              src={result.generatedUrl} 
                              alt="Generated" 
                              className="w-full h-56 object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.15)] group-hover/img:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all"
                            />
                            <div className="absolute top-0 left-0 bg-cyan-500 text-black px-2 py-0.5 text-[10px] font-black cyber-font uppercase tracking-tighter shadow-lg">SYNCED</div>
                            <a 
                              href={result.generatedUrl} 
                              download={`output-${result.timestamp}.png`}
                              className="absolute bottom-3 right-3 bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-2xl z-10"
                            >
                              <i className="fas fa-download text-sm"></i>
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t-2 border-gray-800 pt-4">
                          <div className="flex items-center bg-gray-900 border border-gray-600 px-4 py-2 w-full sm:w-auto shadow-inner">
                            <i className="fas fa-hashtag mr-3 text-magenta-400 text-xs shadow-[0_0_5px_#ff00ff]"></i>
                            <span className="text-[11px] font-black mono-font text-white truncate max-w-[300px] uppercase tracking-wider">CMD: {result.prompt}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-[10px] font-black mono-font text-gray-300 uppercase tracking-widest bg-black px-2">
                            <span className="flex items-center"><i className="far fa-clock mr-1.5 text-cyan-400"></i>{new Date(result.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400 shadow-[0_0_5px_#00f3ff]">CRC_OK</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Persistent CTA Bar - Higher Contrast */}
      {!imagePreview && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t-2 border-cyan-400 p-5 md:hidden z-50 shadow-[0_-10px_30px_rgba(0,243,255,0.2)]">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-magenta-600 text-white cyber-font font-black text-sm tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(255,0,255,0.5)] active:scale-[0.98] glitch-hover border-b-4 border-magenta-800"
          >
            <i className="fas fa-upload mr-3"></i>
            Initialize Data Link
          </button>
        </div>
      )}
      
      {/* Decorative footer label - More visible */}
      <footer className="fixed bottom-4 left-6 z-0 pointer-events-none hidden md:block">
        <p className="text-[10px] mono-font text-gray-500 font-black uppercase tracking-[0.6em] flex items-center">
          <span className="w-1.5 h-1.5 bg-green-500 mr-3 rounded-full animate-pulse"></span>
          Neural_Net_Processor_V8.0_Status:_ACTIVE
        </p>
      </footer>
    </div>
  );
};

export default App;
