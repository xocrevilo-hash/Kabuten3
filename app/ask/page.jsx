'use client';

import React, { useState } from 'react';
import { VoiceAssistant } from '../components/VoiceAssistant';

export default function AskKabutenChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.content || 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI service. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  // Handle voice transcript (what user said)
  const handleVoiceTranscript = (text) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      isVoice: true
    }]);
  };

  // Handle voice response (what AI said)
  const handleVoiceResponse = (text) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: text,
      isVoice: true
    }]);
  };

  const suggestedQuestions = [
    "Compare Sony vs Nintendo as gaming investments",
    "What are the best dividend stocks in Japanese banking?",
    "Explain the AI semiconductor theme in Japan",
    "Is Rakuten a buy at current levels?",
    "Which trading companies have the best fundamentals?",
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 text-sm">
      {/* Header - Lighter */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <a href="/" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm">
          ← Back
        </a>
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h1 className="text-lg font-semibold text-gray-800">Ask Kabuten</h1>
        </div>
        <a href="/themes" className="text-sm text-gray-500 hover:text-gray-800">Themes</a>
      </header>

      <div className="max-w-2xl mx-auto p-4 flex flex-col h-[calc(100vh-60px)]">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            // Welcome screen - Lighter
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ask me anything</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Get AI-powered insights about Japanese stocks and markets
              </p>

              <div className="text-left max-w-md mx-auto">
                <p className="text-xs text-gray-400 uppercase font-medium mb-3 px-1">Try these questions:</p>
                <div className="space-y-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat messages
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 rounded-bl-md shadow-sm'
                  } ${message.isVoice ? 'ring-2 ring-blue-300' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">🤖</span>
                      <span className="text-xs font-medium text-gray-500">Kabuten</span>
                      {message.isVoice && (
                        <span className="text-xs text-blue-500">🎤 Voice</span>
                      )}
                    </div>
                  )}
                  {message.role === 'user' && message.isVoice && (
                    <div className="flex items-center gap-1 mb-1 text-blue-200 text-xs">
                      <span>🎤</span>
                      <span>Voice</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">🤖</span>
                  <span className="text-sm text-gray-500">Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area with Voice */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
          {/* Voice Assistant */}
          <div className="border-b border-gray-100 pb-3 mb-3">
            <VoiceAssistant
              onTranscript={handleVoiceTranscript}
              onResponse={handleVoiceResponse}
              className="py-2"
            />
          </div>

          {/* Text input with divider */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span>or type your question</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about Japanese stocks..."
              className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Disclaimer - Subtle */}
        <div className="text-center text-xs text-gray-400 mt-3">
          <p>Powered by Claude AI • Not financial advice</p>
        </div>
      </div>
    </div>
  );
}
