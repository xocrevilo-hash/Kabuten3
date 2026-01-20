'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [updateLog, setUpdateLog] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
  const [podcastAgentLog, setPodcastAgentLog] = useState([]);

  // Simple password check (in production, use proper auth)
  const ADMIN_PASSWORD = 'kabuten2026';

  // Update status state
  const [updateStatus, setUpdateStatus] = useState({
    stockPrices: { completed: 60, total: 60, lastRun: '15 min ago', status: 'ok' },
    keyMetrics: { completed: 60, total: 60, lastRun: 'Today 06:00 JST', status: 'ok' },
    sentiment: { completed: 58, total: 60, lastRun: 'Today 07:00 JST', status: 'warning' },
    epsRevisions: { completed: 60, total: 60, lastRun: 'Jan 12, 2026', status: 'ok' },
    narrative: { completed: 57, total: 60, lastRun: 'Jan 10, 2026', status: 'warning' },
    outlook: { completed: 60, total: 60, lastRun: 'Dec 28, 2025', status: 'ok' },
    analystRatings: { completed: 60, total: 60, lastRun: 'Jan 11, 2026', status: 'ok' },
    heatmap: { completed: 96, total: 96, lastRun: '2 hours ago', status: 'ok' },
    podcasts: { completed: 5, total: 5, lastRun: 'Jan 17, 2026', status: 'ok' },
  });

  const [pendingReviews, setPendingReviews] = useState([
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
  ]);

  // Initialize update log
  useEffect(() => {
    setUpdateLog([
      { time: '09:15', message: 'Sony (6758) price updated ¥3,245 → ¥3,268', type: 'price' },
      { time: '09:15', message: 'Toyota (7203) price updated ¥2,890 → ¥2,912', type: 'price' },
      { time: '09:00', message: 'Materiality triggered: Rakuten (4755) - Earnings released', type: 'alert' },
      { time: '07:00', message: 'Sentiment batch complete: 58/60 companies updated', type: 'sentiment' },
      { time: '06:00', message: 'Key metrics batch complete: 60/60 companies', type: 'metrics' },
      { time: 'Jan 12', message: 'EPS revisions updated for 60 companies', type: 'eps' },
    ]);
  }, []);

  // Fetch podcast agent log
  useEffect(() => {
    const fetchPodcastLog = async () => {
      try {
        const response = await fetch('/data/podcast_agent_log.json');
        if (response.ok) {
          const data = await response.json();
          setPodcastAgentLog(data.runs || []);
        }
      } catch (error) {
        console.error('Failed to fetch podcast agent log:', error);
      }
    };
    fetchPodcastLog();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const addLogEntry = (message, type = 'info') => {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    setUpdateLog(prev => [{ time, message, type }, ...prev.slice(0, 49)]);
  };

  const runUpdate = async (updateType, label) => {
    setIsUpdating(prev => ({ ...prev, [updateType]: true }));
    addLogEntry(`Starting ${label} update...`, 'info');
    
    // Simulate update process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUpdateStatus(prev => ({
      ...prev,
      [updateType]: {
        ...prev[updateType],
        completed: prev[updateType].total,
        lastRun: 'Just now',
        status: 'ok'
      }
    }));
    
    addLogEntry(`${label} update complete: ${updateStatus[updateType].total}/${updateStatus[updateType].total} companies`, updateType);
    setIsUpdating(prev => ({ ...prev, [updateType]: false }));
  };

  const handleReview = (index, action) => {
    const review = pendingReviews[index];
    if (action === 'skip') {
      addLogEntry(`Skipped ${review.type} review for ${review.name} (${review.code})`, 'info');
    } else {
      addLogEntry(`Opening ${review.type} editor for ${review.name} (${review.code})`, 'info');
      alert(`Editor would open for ${review.name} - ${review.type}\nReason: ${review.reason}`);
    }
    setPendingReviews(prev => prev.filter((_, i) => i !== index));
  };

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">🔐 Kabuten Admin</h1>
            <p className="text-gray-400 text-sm mt-2">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <div>
            <h1 className="text-xl font-bold">Kabuten Admin</h1>
            <p className="text-gray-400 text-xs">Data Update Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Last full run: Jan 13, 2026 09:00 JST</span>
          <a href="/" className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">← Back to Site</a>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 bg-red-600 rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Update Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Update Status Cards */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📊 Update Status by Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'stockPrices', label: 'Box 1-3: Price/Metrics', schedule: '✓ Live on load', live: true },
                  { key: 'narrative', label: 'Box 4: Narrative', schedule: 'Weekend batch', live: false },
                  { key: 'outlook', label: 'Box 5: Outlook', schedule: 'Weekend batch', live: false },
                  { key: 'sentiment', label: 'Box 6: Social Media', schedule: 'Weekend batch', live: false },
                  { key: 'analystRatings', label: 'Box 7: Analyst Ratings', schedule: 'Weekend batch', live: false },
                  { key: 'epsRevisions', label: 'Box 8: EPS Revisions', schedule: 'Weekend batch', live: false },
                  { key: 'heatmap', label: '📊 Heatmap Scrape', schedule: 'Weekend batch', live: false },
                  { key: 'podcasts', label: '🎙️ Podcast Ideas', schedule: 'As needed', live: false },
                ].map(({ key, label, schedule, live }) => (
                  <div key={key} className={`rounded-lg p-3 border ${live ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-lg">{live ? '🟢' : getStatusIcon(updateStatus[key]?.status || 'ok')}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {live ? 'Real-time via Yahoo Finance API' : `${updateStatus[key]?.completed || 60}/${updateStatus[key]?.total || 60} companies`}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {live ? 'Fetched on page load' : `Last: ${updateStatus[key]?.lastRun || 'Jan 18, 2026'}`}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${live ? 'text-green-600 font-medium' : 'text-blue-600'}`}>{schedule}</span>
                      {!live && (
                        <button
                          onClick={() => runUpdate(key, label)}
                          disabled={isUpdating[key]}
                          className={`px-2 py-1 text-xs rounded ${
                            isUpdating[key] 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isUpdating[key] ? '⏳ Running...' : 'Run'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Bulk Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    runUpdate('stockPrices', 'Stock Prices');
                    runUpdate('keyMetrics', 'Key Metrics');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  🔄 Run Daily Updates
                </button>
                <button
                  onClick={() => {
                    ['stockPrices', 'keyMetrics', 'sentiment', 'epsRevisions', 'analystRatings'].forEach(key => {
                      runUpdate(key, key);
                    });
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                >
                  ⚡ Run All Updates
                </button>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
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
                            <span className="font-semibold">{review.name}</span>
                            <span className="text-xs font-mono bg-white/50 px-1.5 py-0.5 rounded">{review.code}</span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded">
                              {review.type}
                            </span>
                          </div>
                          <p className="text-sm">{review.reason}</p>
                          <p className="text-xs mt-1 opacity-70">Detected: {review.detected}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(index, 'review')}
                            className="px-3 py-1.5 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50 border border-gray-300"
                          >
                            ✏️ Review
                          </button>
                          <button
                            onClick={() => handleReview(index, 'skip')}
                            className="px-3 py-1.5 bg-white/50 text-gray-600 rounded text-sm hover:bg-white/70"
                          >
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
          </div>

          {/* Right Column - Update Log */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📜 Recent Update Log
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {updateLog.map((entry, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-base">{getLogIcon(entry.type)}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-400 text-xs">{entry.time}</span>
                      <p className="text-gray-700 text-xs mt-0.5 break-words">{entry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-4">📈 Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Companies</span>
                  <span className="font-semibold">60</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Japan</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">International</span>
                  <span className="font-semibold">13</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">API Calls Today</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Errors Today</span>
                  <span className="font-semibold text-emerald-600">0</span>
                </div>
              </div>
            </div>

            {/* Schedule Reference */}
            <div className="bg-gray-800 text-white rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-3">⏰ Update Schedule</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Prices/Chart (Box 1)</span>
                  <span className="text-green-400">✓ Live on page load</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Performance % (Box 2)</span>
                  <span className="text-green-400">✓ Live on page load</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Key Metrics (Box 3)</span>
                  <span className="text-green-400">✓ Live on page load</span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Narrative (Box 4)</span>
                  <span>Weekend batch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Outlook (Box 5)</span>
                  <span>Weekend batch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Social Media (Box 6)</span>
                  <span>Weekend batch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Analyst Ratings (Box 7)</span>
                  <span>Weekend batch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">EPS Revisions (Box 8)</span>
                  <span>Weekend batch</span>
                </div>
              </div>
            </div>

            {/* Weekend To Do */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-3 text-amber-800">📋 Weekend Update To Do</h2>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-amber-300" />
                  <span className="text-gray-700">Box 4: Update Narrative (news, earnings)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-amber-300" />
                  <span className="text-gray-700">Box 5: Update Outlook (if material change)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-amber-300" />
                  <span className="text-gray-700">Box 6: Scrape X/Twitter sentiment (17 companies)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-amber-300" />
                  <span className="text-gray-700">Box 7: Update Analyst Ratings (consensus, targets)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-amber-300" />
                  <span className="text-gray-700">Box 8: Update EPS Revisions (TBD data source)</span>
                </label>
                <div className="pt-2 mt-2 border-t border-amber-200 text-xs text-amber-600">
                  Best time: Saturday/Sunday morning (JST)
                </div>
              </div>
            </div>

            {/* Podcast Agent Log */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                🎙️ Podcast Agent Log
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-normal">
                  Last 5 runs
                </span>
              </h2>
              <div className="space-y-3">
                {podcastAgentLog.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No agent runs yet
                  </div>
                ) : (
                  podcastAgentLog.slice(0, 5).map((run, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${run.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="font-medium text-sm text-gray-800">{run.podcast}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(run.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-1" title={run.episode}>
                        {run.episode}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>E{run.episodeNum}</span>
                        <span>•</span>
                        <span>{run.ideasGenerated} ideas</span>
                        <span>•</span>
                        <span>{run.duration}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200 flex items-center justify-between">
                <span className="text-xs text-purple-600">
                  8 podcasts tracked • Daily at 10:00 JST
                </span>
                <a
                  href="/podcasts"
                  className="text-xs text-purple-700 hover:text-purple-900 font-medium"
                >
                  View Ideas →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
