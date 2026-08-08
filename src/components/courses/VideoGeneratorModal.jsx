import React, { useState, useEffect } from 'react';

export default function VideoGeneratorModal({ isOpen, onClose, topic, courseTitle, onCompleteGeneration }) {
  const [voicePresenter, setVoicePresenter] = useState("tech-educator");
  const [themeStyle, setThemeStyle] = useState("cyber-dark");
  const [detailDepth, setDetailDepth] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const generationSteps = [
    { label: "Analyzing Topic Theory & Code Syntax...", icon: "fas fa-code" },
    { label: "Generating AI Script & Speech Transcript...", icon: "fas fa-file-alt" },
    { label: "Synthesizing AI Presenter Voiceover...", icon: "fas fa-[#a855f7]" },
    { label: "Compiling Animated Canvas Slides & Graphics...", icon: "fas fa-[#3b82f6]" },
    { label: "Encoding 1080p HD Video Presentation...", icon: "fas fa-film" }
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setStepIndex(0);
    setProgressPercent(0);
  };

  useEffect(() => {
    let timer = null;
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              onCompleteGeneration && onCompleteGeneration();
              onClose();
            }, 600);
            return 100;
          }
          const next = prev + 4;
          const currentStep = Math.min(Math.floor((next / 100) * generationSteps.length), generationSteps.length - 1);
          setStepIndex(currentStep);
          return next;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-gray-100 relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Topic Video Generator</h3>
              <p className="text-gray-400 text-xs">{topic?.title || 'Selected Topic'}</p>
            </div>
          </div>
          <button
            disabled={isGenerating}
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl p-1 transition"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isGenerating ? (
            <>
              {/* Voice Presenter Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  1. Select AI Voice Presenter
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "tech-educator", name: "Alex (Tech Educator)", icon: "fas fa-user-tie" },
                    { id: "academic-scientist", name: "Dr. Elena (Academic)", icon: "fas fa-microscope" },
                    { id: "casual-tutor", name: "Sam (Casual Tutor)", icon: "fas fa-smile" },
                    { id: "code-master", name: "Cyber Matrix (AI Synthesizer)", icon: "fas fa-robot" }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoicePresenter(v.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 text-xs md:text-sm font-medium transition ${
                        voicePresenter === v.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                          : 'bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <i className={`${v.icon} text-purple-400 text-base`}></i>
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  2. Visual Theme & Slide Layout
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "cyber-dark", name: "Dark Cyber", color: "bg-slate-900 border-purple-500" },
                    { id: "clean-light", name: "Clean Light", color: "bg-slate-800 border-blue-500" },
                    { id: "synth-neon", name: "Synth Neon", color: "bg-purple-950 border-pink-500" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeStyle(t.id)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${t.color} ${
                        themeStyle === t.id ? 'ring-2 ring-purple-500 text-white' : 'text-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Depth */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  3. Video Duration & Detail Level
                </label>
                <div className="flex rounded-xl bg-gray-800 p-1 border border-gray-700">
                  {[
                    { id: "quick", label: "Quick (2 Min)" },
                    { id: "standard", label: "Standard (5 Min)" },
                    { id: "deep", label: "Deep Dive (10 Min)" }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDetailDepth(d.id)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                        detailDepth === d.id ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Progress State */
            <div className="py-8 text-center space-y-6">
              
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                <span className="text-xl font-bold font-mono text-purple-400">{progressPercent}%</span>
              </div>

              <div>
                <h4 className="text-white font-bold text-base mb-1">Generating AI Video Presentation</h4>
                <p className="text-xs text-purple-400 font-mono animate-pulse">
                  {generationSteps[stepIndex].label}
                </p>
              </div>

              {/* Step checklist */}
              <div className="space-y-2 text-left bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs">
                {generationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded ${
                      idx < stepIndex
                        ? 'text-green-400 bg-green-500/10'
                        : idx === stepIndex
                        ? 'text-purple-300 bg-purple-500/20 font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <i className={`fas ${idx < stepIndex ? 'fa-check-circle text-green-400' : 'fa-circle-notch text-purple-400 animate-spin'}`}></i>
                      {step.label}
                    </span>
                    <span className="font-mono text-gray-500">{idx < stepIndex ? 'Done' : idx === stepIndex ? 'Processing' : 'Queued'}</span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isGenerating && (
          <div className="px-6 py-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartGeneration}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition flex items-center gap-2"
            >
              <i className="fas fa-play"></i> Generate Topic Video
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
