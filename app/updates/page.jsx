'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UpdatesPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  // Company Page Update Status (from Homepage)
  const companyPageUpdates = [
    { key: 'stockPrices', label: 'Box 1-3: Price/Metrics', schedule: 'Live on load', lastRun: '15 min ago', status: 'ok', live: true },
    { key: 'narrative', label: 'Box 4: Narrative', schedule: 'Weekend batch', lastRun: 'Jan 10, 2026', status: 'warning', live: false },
    { key: 'outlook', label: 'Box 5: Outlook', schedule: 'Weekend batch', lastRun: 'Dec 28, 2025', status: 'ok', live: false },
    { key: 'sentiment', label: 'Box 6: Social Media', schedule: 'Weekend batch', lastRun: 'Today 07:00 JST', status: 'warning', live: false },
    { key: 'analystRatings', label: 'Box 7: Analyst Ratings', schedule: 'Weekend batch', lastRun: 'Jan 11, 2026', status: 'ok', live: false },
    { key: 'epsRevisions', label: 'Box 8: EPS Revisions', schedule: 'Weekend batch', lastRun: 'Jan 12, 2026', status: 'ok', live: false },
    { key: 'heatmap', label: 'Heatmap Scrape', schedule: 'Weekend batch', lastRun: '2 hours ago', status: 'ok', live: false },
  ];

  // Podcast Agent Log (from Homepage)
  const podcastAgentLog = [
    { name: 'The a16z Podcast', date: 'Jan 23', episode: 'Interact: Building the Infrastructure That Runs Modern AI', ideas: 4, duration: '28s' },
    { name: 'No Priors', date: 'Jan 23', episode: 'No Priors: Artificial Intelligence | Technology | Startups', ideas: 4, duration: '30s' },
    { name: 'Hard Fork', date: 'Jan 23', episode: 'Jonathan Haidt Strikes Again + What You Vibecoded + ...', ideas: 4, duration: '30s' },
    { name: 'Dwarkesh Podcast', date: 'Jan 23', episode: 'Episode Date: December 30, 2025', ideas: 4, duration: '27s' },
    { name: 'All-In Podcast', date: 'Jan 23', episode: '(0:00) Jason and Sacks welcome Sarah B. Rogers! (2:2...', ideas: 4, duration: '31s' },
  ];

  // Analyst Sector Action Log (from Analyst Sector page)
  const analystActionLog = [
    { time: 'Jan 21', action: 'Upgraded', company: 'Advantest', detail: 'JP Morgan: OW, PT ¥26,000 - raised GPU test estimates 80% YoY', type: 'upgrade' },
    { time: 'Jan 21', action: 'Upgraded', company: 'Screen Holdings', detail: 'JP Morgan: OW, PT ¥20,000 (from ¥15,000)', type: 'upgrade' },
    { time: 'Jan 10', action: 'Upgraded', company: 'Tokyo Electron', detail: 'JP Morgan: PT ¥45,000 (from ¥38,000), P/E 34x', type: 'upgrade' },
    { time: 'Jan 8', action: 'Note Published', company: 'SPE Sector', detail: 'Jefferies: "Expecting healthy fundamentals again in 2026"', type: 'note' },
    { time: 'Jan 5', action: 'Upgraded', company: 'Tokyo Electron', detail: 'Bernstein: Outperform, PT ¥44,200 at 30x P/E', type: 'upgrade' },
  ];

  // Analyst Sector Newsflow (from Analyst Sector page)
  const analystNewsflow = [
    { date: 'Jan 23', headline: 'Berenberg: WFE spending to rise 17% in 2026, TSMC accelerating A14 node roadmap', source: 'Analyst Note', sentiment: 'positive' },
    { date: 'Jan 22', headline: 'Memory "supercycle" underway - DRAM bit growth expected to reach 26% (Huatai)', source: 'Analyst Note', sentiment: 'positive' },
    { date: 'Jan 21', headline: 'JP Morgan sharply raises Advantest estimates - GPU test time growth now 80% YoY', source: 'Analyst Note', sentiment: 'positive' },
    { date: 'Jan 14', headline: 'SEMICON Japan: Positive outlook for memory and advanced packaging', source: 'Huatai Research', sentiment: 'positive' },
    { date: 'Jan 8', headline: 'Jefferies: SPE sector to see healthy fundamentals again in 2026', source: 'Analyst Note', sentiment: 'positive' },
  ];

  // General Update Log (from Homepage)
  const updateLog = [
    { time: '09:15', date: 'Jan 23', message: 'Sony (6758) price updated ¥3,245 → ¥3,268', type: 'price' },
    { time: '09:15', date: 'Jan 23', message: 'Toyota (7203) price updated ¥2,890 → ¥2,912', type: 'price' },
    { time: '09:00', date: 'Jan 23', message: 'Materiality triggered: Rakuten (4755) - Earnings released', type: 'alert' },
    { time: '07:00', date: 'Jan 23', message: 'Sentiment batch complete: 58/60 companies updated', type: 'sentiment' },
    { time: '06:00', date: 'Jan 23', message: 'Key metrics batch complete: 60/60 companies', type: 'metrics' },
    { time: '14:00', date: 'Jan 12', message: 'EPS revisions updated for 60 companies', type: 'eps' },
  ];

  // Pending Reviews (from Homepage)
  const pendingReviews = [
    {
      code: '4755',
      name: 'Rakuten',
      type: 'Narrative',
      reason: 'Earnings released Jan 12',
      priority: 'high',
      detected: 'Jan 13, 2026 09:00'
    },
    {
      code: '7201',
      name: 'Nissan',
      type: 'Narrative',
      reason: 'Price down 18% this month',
      priority: 'high',
      detected: 'Jan 13, 2026 08:30'
    },
    {
      code: '9984',
      name: 'SoftBank Group',
      type: 'Outlook',
      reason: 'ARM stake sale announced',
      priority: 'medium',
      detected: 'Jan 12, 2026 14:00'
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'price': return '💹';
      case 'sentiment': return '💬';
      case 'metrics': return '📊';
      case 'eps': return '📈';
      case 'alert': return '🚨';
      case 'narrative': return '📝';
      case 'outlook': return '🔮';
      default: return 'ℹ️';
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'upgrade': return 'text-emerald-600 bg-emerald-50';
      case 'downgrade': return 'text-red-600 bg-red-50';
      case 'initiate': return 'text-blue-600 bg-blue-50';
      case 'note': return 'text-purple-600 bg-purple-50';
      case 'meeting': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'company', label: 'Company Page' },
    { id: 'analyst', label: 'Analyst Sector' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'reviews', label: 'Pending Reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold hover:text-gray-600">Kabuten 株典</Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">All Updates</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/analyst-sector" className="text-xs text-gray-500 hover:text-gray-800">Analyst Sector</Link>
          <Link href="/themes" className="text-xs text-gray-500 hover:text-gray-800">Themes</Link>
          <Link href="/heatmap" className="text-xs text-gray-500 hover:text-gray-800">Heatmap</Link>
          <Link href="/podcasts" className="text-xs text-gray-500 hover:text-gray-800">Podcasts</Link>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">All Updates</h1>
        <p className="text-sm text-gray-500 mt-1">Consolidated view of all update logs, agent runs, and pending actions across the site</p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-gray-900 border border-gray-300 border-b-white -mb-[1px]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.id === 'reviews' && pendingReviews.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                  {pendingReviews.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">

        {/* All Updates / Company Page Tab */}
        {(selectedTab === 'all' || selectedTab === 'company') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Company Page Update Status */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  📊 Company Page: Update Status
                </h2>
                <Link href="/" className="text-xs text-blue-600 hover:underline">Go to Homepage →</Link>
              </div>
              <div className="space-y-2">
                {companyPageUpdates.map((item) => (
                  <div key={item.key} className={`flex items-center justify-between py-2 px-3 rounded-lg ${item.live ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.live ? '🟢' : getStatusIcon(item.status)}</span>
                      <div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <div className="text-xs text-gray-400">{item.schedule}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{item.lastRun}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* General Update Log */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📋 Recent Activity Log
              </h2>
              <div className="space-y-2">
                {updateLog.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-lg">{getLogIcon(log.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{log.message}</p>
                      <span className="text-xs text-gray-400">{log.date} {log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analyst Sector Tab */}
        {(selectedTab === 'all' || selectedTab === 'analyst') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Analyst Action Log */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  📋 Analyst Action Log
                </h2>
                <Link href="/analyst-sector" className="text-xs text-blue-600 hover:underline">Go to Analyst Sector →</Link>
              </div>
              <div className="space-y-3">
                {analystActionLog.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 w-14 flex-shrink-0">{item.time}</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getActionColor(item.type)}`}>
                      {item.action}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800">{item.company}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyst Newsflow */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📰 Analyst Newsflow
              </h2>
              <div className="space-y-3">
                {analystNewsflow.map((item, index) => (
                  <div key={index} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">{item.date}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{item.source}</span>
                      <span className={`text-xs ${item.sentiment === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.sentiment === 'positive' ? '▲' : '▼'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{item.headline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Podcasts Tab */}
        {(selectedTab === 'all' || selectedTab === 'podcasts') && (
          <div className="bg-white rounded-xl border border-gray-300 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                🎙️ Podcast Agent Log
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Last 5 runs</span>
              </h2>
              <Link href="/podcasts" className="text-xs text-blue-600 hover:underline">View All Ideas →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {podcastAgentLog.map((podcast, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-green-500 mt-1">●</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-800">{podcast.name}</span>
                      <span className="text-xs text-gray-400">{podcast.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{podcast.episode}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{podcast.ideas} ideas</span>
                      <span>•</span>
                      <span>{podcast.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
              8 podcasts tracked • Daily at 10:00 JST • Transcripts via Podscribe
            </div>
          </div>
        )}

        {/* Pending Reviews Tab */}
        {(selectedTab === 'all' || selectedTab === 'reviews') && (
          <div className="bg-white rounded-xl border border-gray-300 p-5 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚠️ Pending Reviews
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                {pendingReviews.length} items
              </span>
            </h2>

            {pendingReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl">✅</span>
                <p className="mt-2">No pending reviews</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((review, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(review.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/company/${review.code}`} className="font-semibold hover:underline">{review.name}</Link>
                          <span className="text-xs font-mono bg-white/50 px-1.5 py-0.5 rounded">{review.code}</span>
                          <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded">
                            {review.type}
                          </span>
                        </div>
                        <p className="text-sm">{review.reason}</p>
                        <p className="text-xs mt-1 opacity-70">Detected: {review.detected}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50 border border-gray-300">
                          ✏️ Review
                        </button>
                        <button className="px-3 py-1.5 bg-white/50 text-gray-600 rounded text-sm hover:bg-white/70">
                          Skip
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Materiality Rules Reference */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">📋 Materiality Thresholds</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Narrative:</strong> Earnings release, major news, price move ≥15%</p>
                <p><strong>Outlook:</strong> M&A, CEO change, strategic shift, segment restructure, credit event</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">60</div>
            <div className="text-xs text-gray-500">Companies Tracked</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">24</div>
            <div className="text-xs text-gray-500">Podcast Ideas (Week)</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">5</div>
            <div className="text-xs text-gray-500">Analyst Upgrades (Week)</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{pendingReviews.length}</div>
            <div className="text-xs text-gray-500">Pending Reviews</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="text-center text-xs text-gray-400">
          <p>Kabuten 株典 • AI-powered fundamental research for Japanese equities</p>
          <p className="mt-1">Last updated: Jan 23, 2026 • © 2026</p>
        </div>
      </div>
    </div>
  );
}
