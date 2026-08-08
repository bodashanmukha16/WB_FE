import React, { useState } from 'react';

export default function TopicContentViewer({ topic, courseTitle }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'code', 'quiz', 'cheatsheet'

  const handleCopyCode = () => {
    if (topic?.codeSnippet) {
      navigator.clipboard.writeText(topic.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSelectOption = (questionIdx, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateScore = () => {
    const quiz = topic?.quiz || [];
    let score = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Sub Navigation Bar for Topic Content */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          {[
            { id: 'theory', label: 'Theory & Concepts', icon: 'fas fa-book-open' },
            { id: 'code', label: 'Interactive Code', icon: 'fas fa-code' },
            { id: 'cheatsheet', label: 'Cheat Sheet', icon: 'fas fa-[#a855f7] fa-list-check' },
            { id: 'quiz', label: `Practice Quiz (${topic?.quiz?.length || 0})`, icon: 'fas fa-question-circle' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Reading time ~ 10 mins
        </span>
      </div>

      {/* Main Tab Body */}
      <div className="p-6 md:p-8">
        
        {/* THEORY TAB */}
        {activeTab === 'theory' && (
          <div className="prose max-w-none space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{topic?.title}</h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{topic?.summary}</p>
            </div>

            {/* Formatted Theory Material */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-gray-800 text-sm md:text-base leading-relaxed space-y-4">
              <div className="whitespace-pre-wrap font-sans">
                {topic?.theory || "Theory content is being created for this topic."}
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE CODE TAB */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Topic Code Example</h3>
                <p className="text-gray-500 text-xs md:text-sm">Copy and test this clean code snippet in your workbench environment</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-2"
              >
                <i className={`fas ${copiedCode ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="bg-gray-950 rounded-2xl p-5 border border-gray-800 shadow-2xl text-emerald-400 font-mono text-xs md:text-sm overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 text-gray-500 text-xs">
                <span><i className="fas fa-file-code mr-1.5"></i> {topic?.id || 'solution'}.js</span>
                <span>UTF-8 • JavaScript / JSX</span>
              </div>
              <pre><code>{topic?.codeSnippet || `// Code snippet loading...`}</code></pre>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs md:text-sm flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-600 text-base mt-0.5"></i>
              <div>
                <span className="font-bold">Pro Tip:</span> You can paste this code snippet into the WorkBench Compiler tool to execute and modify parameters in real-time.
              </div>
            </div>
          </div>
        )}

        {/* CHEAT SHEET TAB */}
        {activeTab === 'cheatsheet' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Reference Cheat Sheet</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(topic?.cheatSheet || ["Review topic guidelines"]).map((item, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRACTICE QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Self-Assessment Quiz</h3>
                <p className="text-gray-500 text-xs md:text-sm">Test your knowledge on key topic concepts</p>
              </div>

              {submittedQuiz && (
                <div className="px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-600"></i>
                  <span>Score: {calculateScore()} / {topic?.quiz?.length || 0}</span>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {(topic?.quiz || []).map((q, qIdx) => (
                <div key={qIdx} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">
                    Q{qIdx + 1}: {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnStyle = "bg-white border-gray-200 text-gray-700 hover:border-blue-400";
                      
                      if (submittedQuiz) {
                        if (isCorrect) {
                          btnStyle = "bg-green-500/10 border-green-500 text-green-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "bg-red-500/10 border-red-500 text-red-900";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-blue-600 text-white font-semibold shadow";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submittedQuiz}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && isCorrect && (
                            <i className="fas fa-check-circle text-green-600"></i>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-600">
                      <span className="font-bold text-gray-800">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              {submittedQuiz ? (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setUserAnswers({});
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 transition"
                >
                  Reset Quiz
                </button>
              ) : (
                <button
                  disabled={Object.keys(userAnswers).length === 0}
                  onClick={() => setSubmittedQuiz(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow hover:shadow-lg disabled:opacity-50 transition"
                >
                  Submit Quiz Answers
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
