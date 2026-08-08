import React, { useState } from 'react';

export default function CourseAITutor({ topic, courseTitle }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Learning Assistant for "${topic?.title || 'this topic'}". Ask me anything about theory, code debugging, or practical exercises!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptText = inputValue;
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponseText = `Regarding **"${topic?.title || 'Topic'}"**: ${promptText}. `;
      if (promptText.toLowerCase().includes("code") || promptText.toLowerCase().includes("example")) {
        aiResponseText += `Here is a best practice tip: Always structure code with clear variable names and modular functions. For instance, in ${topic?.title}, ensure async operations handle edge errors using try/catch.`;
      } else if (promptText.toLowerCase().includes("quiz") || promptText.toLowerCase().includes("exam")) {
        aiResponseText += `Key points to remember for tests: 1) Understand core concepts. 2) Practice implementation. 3) Review the topic cheat sheet!`;
      } else {
        aiResponseText += `Great question! In ${courseTitle}, this topic emphasizes scalable design principles and efficient resource utilization. Try running the code snippet in the compiler to observe its execution flow.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <i className="fas fa-robot text-lg"></i>
          </div>
          <div>
            <h4 className="font-bold text-sm md:text-base">AI Course Assistant</h4>
            <p className="text-blue-100 text-xs">{topic?.title}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-green-500/20 text-green-200 border border-green-400/30 text-xs font-semibold rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span> Online
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold p-2">
            <i className="fas fa-circle-notch animate-spin"></i>
            <span>AI Tutor is formulating response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2 rounded-b-2xl">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask AI about ${topic?.title || 'this topic'}...`}
          className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-xs md:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow hover:opacity-90 disabled:opacity-50 transition"
        >
          <i className="fas fa-paper-plane mr-1"></i> Send
        </button>
      </form>

    </div>
  );
}
