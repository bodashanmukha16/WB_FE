import React, { useState } from 'react';

export default function TopicVideoPlayer({ topic, courseTitle }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'key-points'

  const youtubeId = topic?.youtubeId || "kUMe1FH4CHE";
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <div className="px-6 py-4 bg-slate-900 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
            <i className="fas fa-play text-xs"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{courseTitle}</span>
              <span className="text-gray-500 text-xs">• Topic Video Presentation</span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-white line-clamp-1">{topic?.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <i className="fas fa-video text-[10px]"></i> HD Lecture
          </span>
          <span className="text-xs text-gray-400 font-mono">
            <i className="fas fa-clock mr-1 text-purple-400"></i>{topic?.duration || '30 min'}
          </span>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        {youtubeId ? (
          <iframe
            src={embedUrl}
            title={topic?.title || "Course Topic Video"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-center p-8 text-gray-400 space-y-3">
            <i className="fas fa-exclamation-circle text-4xl text-yellow-500"></i>
            <p className="text-sm font-semibold text-white">Video lecture loading or unavailable.</p>
            <p className="text-xs text-gray-500">Please select another topic from the syllabus tree.</p>
          </div>
        )}
      </div>

      {/* Video Details & Topic Overview Bar */}
      <div className="p-6 bg-slate-900 border-t border-gray-800 space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'summary'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <i className="fas fa-info-circle"></i>
              <span>Topic Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('key-points')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'key-points'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <i className="fas fa-list-check"></i>
              <span>Key Cheat Sheet</span>
            </button>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-2">
            <i className="fas fa-graduation-cap text-purple-400"></i>
            <span>Interactive Syllabus Engine</span>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'summary' && (
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fas fa-book-open text-blue-400 text-xs"></i> Overview & Learning Focus
            </h4>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
              {topic?.summary || "Comprehensive visual presentation covering core technical architecture and hands-on implementations."}
            </p>
          </div>
        )}

        {activeTab === 'key-points' && (
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-400 text-xs"></i> Quick Reference Bullet Points
            </h4>
            <ul className="grid md:grid-cols-2 gap-2 text-xs text-gray-300">
              {(topic?.cheatSheet || [
                "Practice hands-on code exercises for maximum retention.",
                "Review topic notes in the Theory & Code tab.",
                "Complete topic quiz questions to test your mastery."
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-gray-900 p-2.5 rounded-lg border border-gray-800">
                  <i className="fas fa-check-circle text-emerald-400 mt-0.5 shrink-0"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

    </div>
  );
}
