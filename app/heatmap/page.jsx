'use client';

import React from 'react';
import Link from 'next/link';

export default function HeatmapPage() {
  // Heatmap data - will be updated by scraper
  const heatmapData = [
    { name: "SMIC", type: "company", views: 3500000, change: 12.5 },
    { name: "ASML", type: "company", views: 1700000, change: -3.2 },
    { name: "TSMC", type: "company", views: 890000, change: 8.7 },
    { name: "NVIDIA", type: "company", views: 750000, change: 15.3 },
    { name: "Samsung Electronics", type: "company", views: 520000, change: -1.8 },
    { name: "SK Hynix", type: "company", views: 430000, change: 22.1 },
    { name: "Intel", type: "company", views: 380000, change: -8.5 },
    { name: "AMD", type: "company", views: 290000, change: 5.2 },
    { name: "Micron", type: "company", views: 185000, change: 3.1 },
    { name: "Tokyo Electron", type: "company", views: 125000, change: 18.4 },
    { name: "HBM", type: "keyword", views: 98000, change: 45.2 },
    { name: "Advantest", type: "company", views: 87000, change: 7.8 },
    { name: "CoWoS", type: "keyword", views: 72000, change: 28.3 },
    { name: "EUV", type: "keyword", views: 65000, change: -2.1 },
    { name: "Zhongji Innolight", type: "company", views: 58000, change: 92.5 },
    { name: "Applied Materials", type: "company", views: 52000, change: 4.3 },
    { name: "Lam Research", type: "company", views: 48000, change: 1.2 },
    { name: "AI chips", type: "keyword", views: 45000, change: 33.7 },
    { name: "SCREEN Holdings", type: "company", views: 38000, change: 11.2 },
    { name: "Disco", type: "company", views: 35000, change: 6.8 },
    { name: "Renesas", type: "company", views: 32000, change: -4.2 },
    { name: "Lasertec", type: "company", views: 28000, change: 15.6 },
    { name: "export controls", type: "keyword", views: 25000, change: 8.9 },
    { name: "MediaTek", type: "company", views: 22000, change: 2.3 },
    { name: "Qualcomm", type: "company", views: 19000, change: -1.5 },
    { name: "GlobalFoundries", type: "company", views: 16000, change: 0.8 },
    { name: "UMC", type: "company", views: 14000, change: 3.4 },
    { name: "CHIPS Act", type: "keyword", views: 12000, change: -5.2 },
    { name: "Arm", type: "company", views: 11000, change: 7.1 },
    { name: "Rapidus", type: "company", views: 9500, change: 125.0 },
    { name: "DRAM", type: "keyword", views: 9200, change: 4.5 },
    { name: "NAND", type: "keyword", views: 8800, change: -2.3 },
    { name: "foundry", type: "keyword", views: 8500, change: 6.7 },
    { name: "wafer", type: "keyword", views: 8200, change: 3.2 },
    { name: "fab", type: "keyword", views: 7900, change: 11.4 },
    { name: "Broadcom", type: "company", views: 7600, change: 5.8 },
    { name: "Texas Instruments", type: "company", views: 7300, change: -0.9 },
    { name: "Infineon", type: "company", views: 7000, change: 2.1 },
    { name: "STMicro", type: "company", views: 6700, change: -3.4 },
    { name: "NXP", type: "company", views: 6400, change: 1.8 },
  ];

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(0) + 'K';
    return views.toString();
  };

  const getChangeColor = (change) => {
    if (change > 5) return 'text-emerald-600';
    if (change < -5) return 'text-red-500';
    return 'text-amber-500';
  };

  const totalViews = heatmapData.reduce((sum, item) => sum + item.views, 0);
  const avgChange = heatmapData.reduce((sum, item) => sum + item.change, 0) / heatmapData.length;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
            ← Homepage
          </Link>
          <div>
            <span className="font-semibold">Semiconductor Buzz</span>
            <span className="text-gray-400 text-xs ml-2">X/Twitter mentions</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Updated every 8 hours • Last: Jan 18, 2026 10:00 JST</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4">
        
        {/* Summary Stats */}
        <div className="bg-gray-900 text-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">𝕏</span>
              <div>
                <h1 className="text-lg font-bold">Semiconductor Buzz</h1>
                <p className="text-gray-400 text-xs">View counts from latest X posts</p>
              </div>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <div className="text-xl font-bold">{formatViews(totalViews)}</div>
                <div className="text-xs text-gray-400">Total views</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${avgChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {avgChange > 0 ? '+' : ''}{avgChange.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">vs yesterday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {heatmapData.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${
                  index < 3 ? 'bg-amber-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold ${index < 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                  <span className={item.type === 'company' ? 'text-blue-600 font-medium' : 'text-gray-800'}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-medium w-16 text-right">
                    {formatViews(item.views)}
                  </span>
                  <span className={`w-16 text-right font-medium ${getChangeColor(item.change)}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
          Sum of view counts from latest X posts • <span className="text-blue-600">Blue = Company</span>, Black = Keyword
          <br />
          Data refreshed every 8 hours via X search
        </div>
        
      </div>
    </div>
  );
}
