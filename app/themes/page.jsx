'use client';

import React from 'react';

export default function KabutenThemesPage() {
  const themes = [
    { name: "SPE", href: "/themes/spe" },
    { name: "Defense", href: "/themes/defense" },
    { name: "Construction", href: "/themes/construction" },
    { name: "Trading Cos", href: "/themes/trading-cos" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <a href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
          ← Homepage
        </a>
        <h1 className="text-lg font-semibold">Kabuten 株典</h1>
        <a href="/ask" className="text-xs text-gray-500 hover:text-gray-800">Ask AI</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Investment Themes</h1>
          <p className="text-gray-500">Browse companies by investment theme</p>
        </div>

        {/* Theme Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <a
              key={theme.name}
              href={theme.href}
              className="bg-white border border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-800">{theme.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
