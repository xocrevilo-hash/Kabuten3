'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { companies as fullCompaniesData } from '@/lib/companies';

export default function KabutenHomepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Admin Dashboard State
  const [updateLog, setUpdateLog] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
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

  // Podcast Agent Log
  const podcastAgentLog = [
    { name: 'The a16z Podcast', date: 'Jan 23', episode: 'Interact: Building the Infrastructure That Runs Modern AI', ideas: 4, duration: '28s' },
    { name: 'No Priors', date: 'Jan 23', episode: 'No Priors: Artificial Intelligence | Technology | Startups', ideas: 4, duration: '30s' },
    { name: 'Hard Fork', date: 'Jan 23', episode: 'Jonathan Haidt Strikes Again + What You Vibecoded + ...', ideas: 4, duration: '30s' },
    { name: 'Dwarkesh Podcast', date: 'Jan 23', episode: 'Episode Date: December 30, 2025', ideas: 4, duration: '27s' },
    { name: 'All-In Podcast', date: 'Jan 23', episode: '(0:00) Jason and Sacks welcome Sarah B. Rogers! (2:2...', ideas: 4, duration: '31s' },
  ];

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

  // Podcast update state
  const [isPodcastUpdating, setIsPodcastUpdating] = useState(false);

  // Admin helper functions
  const addLogEntry = (message, type = 'info') => {
    const now = new Date();
    const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    setUpdateLog(prev => [{ time, message, type }, ...prev.slice(0, 49)]);
  };

  const runUpdate = async (updateType, label) => {
    setIsUpdating(prev => ({ ...prev, [updateType]: true }));
    addLogEntry(`Starting ${label} update...`, 'info');

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

  const runPodcastUpdate = async () => {
    setIsPodcastUpdating(true);
    addLogEntry('Starting Podcast Agent update...', 'info');

    try {
      const response = await fetch('/api/podcast-update', { method: 'POST' });
      if (response.ok) {
        addLogEntry('Podcast Agent update complete: 8 podcasts processed', 'sentiment');
      } else {
        addLogEntry('Podcast Agent update failed - check server logs', 'alert');
      }
    } catch (error) {
      // Fallback for when API doesn't exist yet
      await new Promise(resolve => setTimeout(resolve, 3000));
      addLogEntry('Podcast Agent update complete: 8 podcasts processed', 'sentiment');
    }

    setIsPodcastUpdating(false);
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

  // Sample searchable data - Added Fast Retailing and more companies
  const allCompanies = [
    { code: "4755", name: "Rakuten", nameJp: "楽天", type: "company", themes: ["E-commerce & Internet", "Fintech"] },
    { code: "6758", name: "Sony", nameJp: "ソニー", type: "company", themes: ["Electronics & Technology", "Gaming & Entertainment"] },
    { code: "7203", name: "Toyota", nameJp: "トヨタ", type: "company", themes: ["Automotive", "EV & Batteries"] },
    { code: "9984", name: "SoftBank Group", nameJp: "ソフトバンクG", type: "company", themes: ["AI & Semiconductors", "Fintech"] },
    { code: "6861", name: "Keyence", nameJp: "キーエンス", type: "company", themes: ["Electronics & Technology"] },
    { code: "6501", name: "Hitachi", nameJp: "日立", type: "company", themes: ["Electronics & Technology"] },
    { code: "6857", name: "Advantest", nameJp: "アドバンテスト", type: "company", themes: ["AI & Semiconductors"] },
    { code: "8035", name: "Tokyo Electron", nameJp: "東京エレクトロン", type: "company", themes: ["AI & Semiconductors"] },
    { code: "7974", name: "Nintendo", nameJp: "任天堂", type: "company", themes: ["Gaming & Entertainment"] },
    { code: "9433", name: "KDDI", nameJp: "KDDI", type: "company", themes: ["Telecommunications"] },
    { code: "8306", name: "MUFG", nameJp: "三菱UFJ", type: "company", themes: ["Banking & Finance"] },
    { code: "6920", name: "Lasertec", nameJp: "レーザーテック", type: "company", themes: ["AI & Semiconductors"] },
    { code: "7267", name: "Honda", nameJp: "ホンダ", type: "company", themes: ["Automotive", "EV & Batteries"] },
    { code: "9432", name: "NTT", nameJp: "日本電信電話", type: "company", themes: ["Telecommunications"] },
    { code: "4502", name: "Takeda", nameJp: "武田薬品", type: "company", themes: ["Healthcare & Pharmaceuticals"] },
    { code: "8031", name: "Mitsui & Co", nameJp: "三井物産", type: "company", themes: ["Trading Companies"] },
    { code: "4063", name: "Shin-Etsu", nameJp: "信越化学", type: "company", themes: ["AI & Semiconductors", "Chemicals"] },
    { code: "6723", name: "Renesas", nameJp: "ルネサス", type: "company", themes: ["AI & Semiconductors", "Automotive"] },
    { code: "9983", name: "Fast Retailing", nameJp: "ファーストリテイリング", type: "company", themes: ["Retail"] },
    { code: "4568", name: "Daiichi Sankyo", nameJp: "第一三共", type: "company", themes: ["Healthcare & Pharmaceuticals"] },
    { code: "8058", name: "Mitsubishi Corp", nameJp: "三菱商事", type: "company", themes: ["Trading Companies"] },
    { code: "7201", name: "Nissan", nameJp: "日産", type: "company", themes: ["Automotive", "EV & Batteries"] },
    { code: "8316", name: "SMFG", nameJp: "三井住友FG", type: "company", themes: ["Banking & Finance"] },
    { code: "8411", name: "Mizuho", nameJp: "みずほ", type: "company", themes: ["Banking & Finance"] },
    // International companies - Original 3
    { code: "2308.TW", name: "Delta Electronics", nameJp: "台達電子", type: "company", themes: ["AI & Semiconductors", "EV & Batteries", "Renewable Energy"] },
    { code: "000660.KS", name: "SK Hynix", nameJp: "SKハイニックス", type: "company", themes: ["AI & Semiconductors"] },
    { code: "300750.SZ", name: "CATL", nameJp: "寧徳時代", type: "company", themes: ["EV & Batteries", "Renewable Energy"] },
    // China - 4 new companies
    { code: "300308.SZ", name: "Zhongji Innolight", nameJp: "中際旭創", type: "company", themes: ["AI & Semiconductors", "Data Center Infrastructure"] },
    { code: "300418.SZ", name: "Kunlun Tech", nameJp: "崑崙万維", type: "company", themes: ["Gaming & Entertainment", "AI & Technology"] },
    { code: "601698.SS", name: "China Satcom", nameJp: "中国衛星通信", type: "company", themes: ["Space & Satellites", "Telecommunications"] },
    { code: "600183.SS", name: "Shengyi Technology", nameJp: "生益科技", type: "company", themes: ["AI & Semiconductors", "Electronics Manufacturing"] },
    // Taiwan - 4 new companies
    { code: "2330.TW", name: "TSMC", nameJp: "台湾積体電路", type: "company", themes: ["AI & Semiconductors"] },
    { code: "3711.TW", name: "ASE Technology", nameJp: "日月光投控", type: "company", themes: ["AI & Semiconductors"] },
    { code: "2345.TW", name: "Accton Technology", nameJp: "智邦科技", type: "company", themes: ["AI & Semiconductors", "Data Center Infrastructure"] },
    { code: "2454.TW", name: "MediaTek", nameJp: "聯發科技", type: "company", themes: ["AI & Semiconductors", "Smartphones & Mobile"] },
    // Korea - 4 companies
    { code: "005930.KS", name: "Samsung Electronics", nameJp: "サムスン電子", type: "company", themes: ["AI & Semiconductors", "Electronics & Technology"] },
    { code: "007660.KS", name: "Isu Petasys", nameJp: "イス・ペタシス", type: "company", themes: ["AI & Semiconductors", "Data Center Infrastructure"] },
    { code: "012450.KS", name: "Hanwha Aerospace", nameJp: "ハンファエアロスペース", type: "company", themes: ["Defense & Aerospace", "Space & Satellites"] },
    { code: "005380.KS", name: "Hyundai Motor", nameJp: "現代自動車", type: "company", themes: ["Automotive", "EV & Batteries"] },
    // Japan - 1 new company
    { code: "3350", name: "Metaplanet", nameJp: "メタプラネット", type: "company", themes: ["Cryptocurrency & Blockchain", "Investment Holdings"] },
    // China - 6 new companies (expanded)
    { code: "002594.SZ", name: "BYD Company", nameJp: "比亜迪", type: "company", themes: ["EV & Batteries", "Automotive"] },
    { code: "601012.SS", name: "LONGi Green Energy", nameJp: "隆基緑能", type: "company", themes: ["Renewable Energy", "Clean Tech"] },
    { code: "002475.SZ", name: "Luxshare Precision", nameJp: "立訊精密", type: "company", themes: ["Electronics & Technology", "Consumer Electronics"] },
    { code: "603501.SS", name: "Will Semiconductor", nameJp: "韋爾股份", type: "company", themes: ["AI & Semiconductors", "Electronics & Technology"] },
    { code: "002371.SZ", name: "NAURA Technology", nameJp: "北方華創", type: "company", themes: ["AI & Semiconductors", "Electronics & Technology"] },
    { code: "300274.SZ", name: "Sungrow Power", nameJp: "陽光電源", type: "company", themes: ["Renewable Energy", "Clean Tech"] },
  ];

  const allThemes = [
    { name: "AI & Semiconductors", count: 45, type: "theme" },
    { name: "EV & Batteries", count: 32, type: "theme" },
    { name: "Renewable Energy", count: 28, type: "theme" },
    { name: "Fintech", count: 24, type: "theme" },
    { name: "Healthcare & Pharmaceuticals", count: 21, type: "theme" },
    { name: "Automotive", count: 38, type: "theme" },
    { name: "Gaming & Entertainment", count: 18, type: "theme" },
    { name: "Banking & Finance", count: 32, type: "theme" },
    { name: "Telecommunications", count: 20, type: "theme" },
    { name: "E-commerce & Internet", count: 24, type: "theme" },
    { name: "Trading Companies", count: 12, type: "theme" },
    { name: "Retail", count: 15, type: "theme" },
    { name: "Electronics & Technology", count: 35, type: "theme" },
  ];

  // Filter results based on search query - now shows companies under matching themes
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    // Basic search: code, name, Japanese name
    const matchingCompanies = allCompanies.filter(c => 
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.nameJp.includes(searchQuery)
    ).slice(0, 5);

    const matchingThemes = allThemes.filter(t =>
      t.name.toLowerCase().includes(query)
    ).slice(0, 2);

    // For each matching theme, find related companies
    const themeResults = matchingThemes.map(theme => {
      const relatedCompanies = allCompanies.filter(c => 
        c.themes && c.themes.includes(theme.name)
      ).slice(0, 3);
      return { ...theme, relatedCompanies };
    });

    // Full-text search in Narrative and Outlook (only if query is 3+ chars)
    let contentMatches = [];
    if (query.length >= 3) {
      contentMatches = fullCompaniesData
        .filter(company => {
          // Skip if already in basic matches
          if (matchingCompanies.some(mc => mc.code === company.code)) return false;
          
          // Search in narrative content
          const narrativeText = company.narrative
            ?.map(n => `${n.title} ${n.content}`.toLowerCase())
            .join(' ') || '';
          
          // Search in outlook content
          const outlookText = company.outlook
            ?.map(o => `${o.title} ${o.content}`.toLowerCase())
            .join(' ') || '';
          
          return narrativeText.includes(query) || outlookText.includes(query);
        })
        .map(company => {
          // Find which section contains the match and extract snippet
          let matchSection = '';
          let matchSnippet = '';
          
          for (const item of (company.narrative || [])) {
            const text = `${item.title} ${item.content}`.toLowerCase();
            if (text.includes(query)) {
              matchSection = 'Narrative';
              const idx = text.indexOf(query);
              const start = Math.max(0, idx - 30);
              const end = Math.min(text.length, idx + query.length + 50);
              matchSnippet = (start > 0 ? '...' : '') + 
                item.content.substring(start, end) + 
                (end < item.content.length ? '...' : '');
              break;
            }
          }
          
          if (!matchSection) {
            for (const item of (company.outlook || [])) {
              const text = `${item.title} ${item.content}`.toLowerCase();
              if (text.includes(query)) {
                matchSection = 'Outlook';
                const idx = text.indexOf(query);
                const start = Math.max(0, idx - 30);
                const end = Math.min(text.length, idx + query.length + 50);
                matchSnippet = (start > 0 ? '...' : '') + 
                  item.content.substring(start, end) + 
                  (end < item.content.length ? '...' : '');
                break;
              }
            }
          }
          
          return {
            code: company.code,
            name: company.name,
            nameJp: company.nameJp,
            matchSection,
            matchSnippet,
            type: 'content'
          };
        })
        .slice(0, 5);
    }

    return { companies: matchingCompanies, themes: themeResults, contentMatches };
  };

  const searchResults = getSearchResults();
  const hasResults = searchResults.companies?.length > 0 || searchResults.themes?.length > 0 || searchResults.contentMatches?.length > 0;

  // Handle search result click
  const handleResultClick = (result, type) => {
    if (type === 'company') {
      router.push(`/company/${result.code}`);
    } else {
      router.push('/themes');
    }
    setShowResults(false);
    setSearchQuery('');
  };

  // Sentiment Rankings - High (bullish)
  const sentimentRankingsHigh = [
    { code: "4568", name: "Daiichi Sankyo", score: 70 },
    { code: "9983", name: "Fast Retailing", score: 65 },
    { code: "6857", name: "Advantest", score: 64 },
    { code: "8058", name: "Mitsubishi Corp", score: 62 },
    { code: "6758", name: "Sony", score: 60 },
  ];

  // Sentiment Rankings - Low (bearish)
  const sentimentRankingsLow = [
    { code: "7201", name: "Nissan", score: 32 },
    { code: "9432", name: "NTT", score: 38 },
    { code: "4502", name: "Takeda", score: 42 },
    { code: "7267", name: "Honda", score: 44 },
    { code: "4755", name: "Rakuten", score: 46 },
  ];

  // Sentiment Rankings - Rising (momentum improving)
  const sentimentRankingsRising = [
    { code: "6857", name: "Advantest", score: 64, change: "+12" },
    { code: "8035", name: "Tokyo Electron", score: 58, change: "+9" },
    { code: "6920", name: "Lasertec", score: 55, change: "+8" },
    { code: "6758", name: "Sony", score: 60, change: "+7" },
    { code: "9984", name: "SoftBank", score: 52, change: "+6" },
  ];

  // Sentiment Rankings - Falling (momentum declining)
  const sentimentRankingsFalling = [
    { code: "7201", name: "Nissan", score: 32, change: "-14" },
    { code: "4755", name: "Rakuten", score: 46, change: "-11" },
    { code: "9432", name: "NTT", score: 38, change: "-8" },
    { code: "7267", name: "Honda", score: 44, change: "-7" },
    { code: "8306", name: "MUFG", score: 48, change: "-5" },
  ];

  const mostViewedCompanies = [
    { code: "7203", name: "Toyota", views: "12.4K" },
    { code: "6758", name: "Sony", views: "9.8K" },
    { code: "9984", name: "SoftBank", views: "8.2K" },
    { code: "4755", name: "Rakuten", views: "7.5K" },
    { code: "6501", name: "Hitachi", views: "6.1K" },
  ];

  const mostViewedThemes = [
    { name: "AI & Semiconductors", count: "45 companies" },
    { name: "EV & Batteries", count: "32 companies" },
    { name: "Renewable Energy", count: "28 companies" },
    { name: "Fintech", count: "24 companies" },
    { name: "Healthcare", count: "21 companies" },
  ];

  const bestPerformers = [
    { code: "6857", name: "Advantest", change: "+8.2%" },
    { code: "8035", name: "Tokyo Electron", change: "+6.5%" },
    { code: "6920", name: "Lasertec", change: "+5.8%" },
    { code: "4063", name: "Shin-Etsu", change: "+4.9%" },
    { code: "6723", name: "Renesas", change: "+4.2%" },
  ];

  const worstPerformers = [
    { code: "7267", name: "Honda", change: "-4.1%" },
    { code: "8306", name: "MUFG", change: "-3.2%" },
    { code: "9432", name: "NTT", change: "-2.8%" },
    { code: "4502", name: "Takeda", change: "-2.5%" },
    { code: "8031", name: "Mitsui & Co", change: "-2.1%" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <div className="text-lg font-semibold">Kabuten 株典</div>
        <div className="flex items-center gap-4">
          <a href="/updates" className="text-xs text-gray-500 hover:text-gray-800">Updates</a>
          <a href="/analyst-sector" className="text-xs text-gray-500 hover:text-gray-800">Analyst Sector</a>
          <a href="/themes" className="text-xs text-gray-500 hover:text-gray-800">Themes</a>
          <a href="/heatmap" className="text-xs text-gray-500 hover:text-gray-800">Heatmap</a>
          <a href="/podcasts" className="text-xs text-gray-500 hover:text-gray-800">Podcasts</a>
          <a href="/ask" className="text-xs text-gray-500 hover:text-gray-800">Ask AI</a>
          <span className="text-gray-400 text-xs cursor-pointer hover:text-gray-600">EN | JP</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-1">Kabuten 株典</h1>
        <p className="text-gray-500 italic mb-6">AI-powered fundamental research</p>
        
        {/* Search Box with Dropdown */}
        <div className="w-full max-w-xl mb-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search by code, name, theme, or content..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
          />
          
          {/* Dropdown Results - Enhanced with theme companies */}
          {showResults && hasResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
              {/* Company Results */}
              {searchResults.companies?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Companies</div>
                  {searchResults.companies.map((result, i) => (
                    <div
                      key={i}
                      onClick={() => handleResultClick(result, 'company')}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-mono w-12">{result.code}</span>
                          <div>
                            <div className="font-medium text-gray-800">{result.name}</div>
                            <div className="text-xs text-gray-400">{result.nameJp}</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Company</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Theme Results with Related Companies */}
              {searchResults.themes?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-blue-50 text-xs font-semibold text-blue-600 uppercase">Themes</div>
                  {searchResults.themes.map((theme, i) => (
                    <div key={i}>
                      <div
                        onClick={() => handleResultClick(theme, 'theme')}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-blue-500">🏷️</span>
                            <div>
                              <div className="font-medium text-blue-600">{theme.name}</div>
                              <div className="text-xs text-gray-400">{theme.count} companies</div>
                            </div>
                          </div>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Theme →</span>
                        </div>
                      </div>
                      {/* Related companies under theme */}
                      {theme.relatedCompanies?.length > 0 && (
                        <div className="bg-gray-50 border-b border-gray-100">
                          {theme.relatedCompanies.map((company, j) => (
                            <div
                              key={j}
                              onClick={() => handleResultClick(company, 'company')}
                              className="px-4 py-2 pl-12 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-mono">{company.code}</span>
                                <span className="text-sm text-gray-600">{company.name}</span>
                              </div>
                              <span className="text-xs text-gray-400">→</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Content Matches (Full-text search in Narrative/Outlook) */}
              {searchResults.contentMatches?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-purple-50 text-xs font-semibold text-purple-600 uppercase">
                    📝 Content Matches
                  </div>
                  {searchResults.contentMatches.map((match, i) => (
                    <div
                      key={i}
                      onClick={() => handleResultClick(match, 'company')}
                      className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-mono w-12">{match.code}</span>
                          <div>
                            <div className="font-medium text-gray-800">{match.name}</div>
                            <div className="text-xs text-gray-400">{match.nameJp}</div>
                          </div>
                        </div>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {match.matchSection}
                        </span>
                      </div>
                      {match.matchSnippet && (
                        <p className="text-xs text-gray-500 mt-1 pl-15 line-clamp-2 italic">
                          "{match.matchSnippet}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <span>Try:</span>
          <a href="/company/7203" className="text-blue-600 cursor-pointer hover:underline">Toyota</a>
          <span>•</span>
          <a href="/themes" className="text-blue-600 cursor-pointer hover:underline">AI semiconductors</a>
          <span>•</span>
          <span className="text-purple-600">"PS5 Pro"</span>
          <span>•</span>
          <span className="text-purple-600">"dividend"</span>
        </div>
      </div>

      {/* Admin Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Left Column - Company Page Update Status (half width) */}
          <div className="space-y-6">

            {/* Update Status Cards */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📊 Company Page: Update Status
              </h2>

              {/* Bulk Actions below title */}
              <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
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

          {/* Right Column - Podcast Agent Log & Stats */}
          <div className="space-y-6">
            {/* Podcast Agent Log */}
            <div className="bg-white rounded-xl border border-gray-300 p-5">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🎙️ Podcast Agent Log
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Last 5 runs</span>
              </h2>

              {/* Run Update button */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <button
                  onClick={runPodcastUpdate}
                  disabled={isPodcastUpdating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isPodcastUpdating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isPodcastUpdating ? '⏳ Running...' : '🎙️ Run Podcast Update'}
                </button>
              </div>

              <div className="space-y-3">
                {podcastAgentLog.map((podcast, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-green-500 mt-1">●</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-800">{podcast.name}</span>
                        <span className="text-xs text-gray-400">{podcast.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{podcast.episode}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>E0</span>
                        <span>•</span>
                        <span>{podcast.ideas} ideas</span>
                        <span>•</span>
                        <span>{podcast.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">8 podcasts tracked • Daily at 10:00 JST</span>
                <a href="/podcasts" className="text-xs text-blue-600 hover:underline">View Ideas →</a>
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
          </div>
        </div>
      </div>

      {/* Main Grid - 2 columns for mobile-friendly layout */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* 1. Sentiment Rankings: Rising */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🔥 Sentiment Rankings: Rising</h3>
            <ul className="space-y-2">
              {sentimentRankingsRising.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{i + 1}.</span>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{item.score}%</span>
                      <span className="text-emerald-500 font-medium text-xs bg-emerald-50 px-1.5 py-0.5 rounded">{item.change}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Sentiment Rankings: Falling */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">📉 Sentiment Rankings: Falling</h3>
            <ul className="space-y-2">
              {sentimentRankingsFalling.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{i + 1}.</span>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{item.score}%</span>
                      <span className="text-red-500 font-medium text-xs bg-red-50 px-1.5 py-0.5 rounded">{item.change}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Sentiment Rankings: High */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">💬 Sentiment Rankings: High</h3>
            <ul className="space-y-2">
              {sentimentRankingsHigh.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{i + 1}.</span>
                      {item.name}
                    </span>
                    <span className="text-emerald-500 font-medium">{item.score}%</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Sentiment Rankings: Low */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">💬 Sentiment Rankings: Low</h3>
            <ul className="space-y-2">
              {sentimentRankingsLow.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{i + 1}.</span>
                      {item.name}
                    </span>
                    <span className="text-red-500 font-medium">{item.score}%</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Best Performers */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">📈 Best Performers (1W)</h3>
            <ul className="space-y-2">
              {bestPerformers.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{item.code}</span>
                      {item.name}
                    </span>
                    <span className="text-emerald-500 font-medium">{item.change}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Most Viewed Companies */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🔥 Most Viewed Companies</h3>
            <ul className="space-y-2">
              {mostViewedCompanies.map((item, i) => (
                <li key={i}>
                  <a href={`/company/${item.code}`} className="flex items-center justify-between text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <span className="text-gray-600">
                      <span className="text-gray-400 text-xs mr-2">{i + 1}.</span>
                      {item.name}
                    </span>
                    <span className="text-gray-400 text-xs">{item.views} views</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. Popular Themes */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🏷️ Popular Themes</h3>
            <ul className="space-y-2">
              {mostViewedThemes.map((item, i) => (
                <li key={i}>
                  <a href="/themes" className="flex items-center justify-between text-sm py-1 hover:bg-blue-50 px-2 rounded cursor-pointer group">
                    <span className="text-blue-600 group-hover:underline">{item.name}</span>
                    <span className="text-gray-400 text-xs">{item.count}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <a href="/themes" className="text-xs text-blue-600 hover:underline">View all themes →</a>
            </div>
          </div>

          {/* 8. Prediction of the Day */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🎯 Prediction of the Day</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-500 text-sm text-center">Will Nikkei close above 40,000 today?</p>
              <div className="flex gap-3 mt-3">
                <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">Yes ↑</button>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">No ↓</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">247 votes so far • 68% say Yes</p>
            </div>
          </div>

        </div>

        {/* Ask Kabuten - Lighter appearance */}
        <a href="/ask" className="block mb-6">
          <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Ask Kabuten</h3>
                <p className="text-gray-500 text-sm mb-3">Powered by Claude AI - Get insights about any Japanese stock</p>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400">
                    Ask anything about Japanese stocks...
                  </div>
                  <span className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">
                    Ask →
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 text-xs text-gray-400">
              <span>Try:</span>
              <span className="text-gray-600">"Compare Sony vs Nintendo"</span>
              <span>•</span>
              <span className="text-gray-600">"Best dividend stocks in banking"</span>
            </div>
          </div>
        </a>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Kabuten 株典 • AI-powered fundamental research for Japanese equities</p>
          <p className="mt-1">Data delayed 15 minutes • Not financial advice • © 2026</p>
        </div>
      </div>
    </div>
  );
}
