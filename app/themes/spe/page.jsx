'use client';

import React from 'react';

export default function SPEPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <a href="/themes" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
          ← Themes
        </a>
        <h1 className="text-lg font-semibold">Kabuten 株典</h1>
        <a href="/ask" className="text-xs text-gray-500 hover:text-gray-800">Ask AI</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">SPE</h1>
        </div>

        {/* Companies Box */}
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <p className="text-gray-800">Tokyo Electron, Advantest, Screen, Disco.</p>
        </div>
      </div>
    </div>
  );
}
