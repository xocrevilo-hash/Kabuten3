'use client';

import React from 'react';
import Link from 'next/link';

export default function HeatmapPage() {
  // Updated data - Jan 22, 2026
  // Ranked by total views from top 5 posts
  const keywords = [
    { term: "memory shortage", totalViews: 4803000, trend: "hot", description: "Micron warns RAM shortage through 2026, DRAM prices soaring" },
    { term: "Rubin", totalViews: 2782000, trend: "warm", description: "NVIDIA's next-gen platform cooling post-CES, still strong" },
    { term: "AI chips", totalViews: 433000, trend: "neutral", description: "Semiconductor value chain analysis dominates discussion" },
    { term: "TSMC", totalViews: 425000, trend: "neutral", description: "Morgan Stanley $60B capex forecast, Arizona cost debate" },
    { term: "data center", totalViews: 380000, trend: "warm", description: "AI infrastructure buildout continues" },
    { term: "2nm", totalViews: 320000, trend: "warm", description: "Intel 18A, TSMC N2 production updates" },
    { term: "HBM3E", totalViews: 285000, trend: "neutral", description: "Overshadowed by HBM4 and memory shortage news" },
    { term: "EUV", totalViews: 245000, trend: "neutral", description: "ASML High-NA deliveries ongoing" },
    { term: "ASIC", totalViews: 165000, trend: "warm", description: "Custom silicon for AI inference growing" },
    { term: "export controls", totalViews: 142000, trend: "neutral", description: "China restrictions steady focus" },
    { term: "foundry", totalViews: 118000, trend: "neutral", description: "Samsung, Intel capacity updates" },
    { term: "Blackwell", totalViews: 95000, trend: "cold", description: "Attention shifted to Rubin roadmap" },
    { term: "CoWoS", totalViews: 68000, trend: "cold", description: "Packaging capacity less urgent in headlines" },
    { term: "HBM4", totalViews: 52000, trend: "cold", description: "SK Hynix 16-layer specs, limited viral reach" },
    { term: "NAND", totalViews: 38000, trend: "cold", description: "Storage overshadowed by DRAM/HBM focus" },
  ];

  const getTrendStyle = (trend) => {
    switch (trend) {
      case 'hot': return { bg: 'bg-red-50 border-red-200', text: 'text-red-600', icon: '🔥', label: 'Hot' };
      case 'warm': return { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-600', icon: '📈', label: 'Rising' };
      case 'neutral': return { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', icon: '➡️', label: 'Stable' };
      case 'cold': return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600', icon: '❄️', label: 'Cooling' };
      default: return { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', icon: '➡️', label: 'Stable' };
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(0) + 'K';
    return views.toString();
  };

  const totalViews = keywords.reduce((sum, k) => sum + k.totalViews, 0);
  const hotCount = keywords.filter(k => k.trend === 'hot').length;
  const warmCount = keywords.filter(k => k.trend === 'warm').length;
  const neutralCount = keywords.filter(k => k.trend === 'neutral').length;
  const coldCount = keywords.filter(k => k.trend === 'cold').length;

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
            <span className="text-gray-400 text-xs ml-2">𝕏 Keyword Rankings</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Updated: Jan 22, 2026 • 21:00 HKT</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        
        {/* Hero Card */}
        <div className="bg-gray-900 text-white rounded-xl p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">𝕏</span>
            <div>
              <h1 className="text-xl font-bold">Semiconductor Keyword Rankings</h1>
              <p className="text-gray-400 text-sm">Top 5 posts view count • Updated daily at 5am HKT</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{formatViews(totalViews)}</div>
              <div className="text-xs text-gray-400">Total Views</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{keywords.length}</div>
              <div className="text-xs text-gray-400">Keywords Tracked</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-red-500/20 rounded-lg p-2">
              <div className="text-lg font-bold text-red-400">{hotCount}</div>
              <div className="text-gray-400">🔥 Hot</div>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-2">
              <div className="text-lg font-bold text-orange-400">{warmCount}</div>
              <div className="text-gray-400">📈 Rising</div>
            </div>
            <div className="bg-gray-500/20 rounded-lg p-2">
              <div className="text-lg font-bold text-gray-400">{neutralCount}</div>
              <div className="text-gray-400">➡️ Stable</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-400">{coldCount}</div>
              <div className="text-gray-400">❄️ Cooling</div>
            </div>
          </div>
        </div>

        {/* Standout Topics Today */}
        <div className="mb-4 bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-3">Standout Topics Today</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-500">●</span>
              <span><strong>Memory shortage</strong> explodes: Micron warns RAM shortages last beyond 2026, Dexerto post hits 4.3M views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">●</span>
              <span><strong>Rubin</strong> cools post-CES but remains strong; energy efficiency comparisons (100x vs Hopper) trending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">●</span>
              <span><strong>TSMC</strong> Taiwan vs Arizona cost analysis circulating; Morgan Stanley projects $60B capex</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">●</span>
              <span><strong>Blackwell</strong> fading from headlines as Rubin roadmap dominates NVIDIA coverage</span>
            </div>
          </div>
        </div>

        {/* Keywords List - Ranked by Views */}
        <div className="space-y-2">
          {keywords.map((keyword, index) => {
            const style = getTrendStyle(keyword.trend);
            const rank = index + 1;
            return (
              <a
                key={keyword.term}
                href={`https://x.com/search?q=${encodeURIComponent(keyword.term)}&src=typed_query&f=top`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${style.bg} border rounded-xl p-3 hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                      {rank}
                    </div>
                    <span className="text-xl">{style.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{keyword.term}</div>
                      <div className="text-xs text-gray-500">{keyword.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatViews(keyword.totalViews)}</div>
                      <div className="text-xs text-gray-400">views</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border`}>
                      {style.label}
                    </div>
                    <span className="text-gray-300">→</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Methodology Note */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div>
              <div className="font-semibold text-amber-800 mb-1">How Rankings Work</div>
              <div className="text-sm text-amber-700">
                Each keyword is searched on X/Twitter daily at 5am HKT. We sum the view counts from the top 5 posts and rank keywords by total engagement. Trend status (Hot/Rising/Stable/Cooling) is based on week-over-week changes.
              </div>
              <div className="mt-2 text-xs text-amber-600">
                Click any keyword to see live X search results
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Part of Kabuten 株典 • Japanese Stock Intelligence</p>
          <p className="mt-1">Data collected via manual X/Twitter search analysis</p>
        </div>
      </div>
    </div>
  );
}
