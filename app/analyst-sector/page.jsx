'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnalystSectorPage() {
  const [selectedSector, setSelectedSector] = useState('SPE');

  const sectors = [
    { id: 'SPE', label: 'SPE' },
    { id: 'trading', label: 'Trading Companies' },
    { id: 'construction', label: 'Construction' },
    { id: 'defense', label: 'Defense' },
  ];

  // Sample data for each section
  const companies = [
    { code: '8035', name: 'Tokyo Electron', price: '¥23,450', change: '+2.3%', positive: true },
    { code: '6857', name: 'Advantest', price: '¥5,890', change: '+1.8%', positive: true },
    { code: '6920', name: 'Lasertec', price: '¥28,100', change: '-0.5%', positive: false },
    { code: '7735', name: 'Screen Holdings', price: '¥12,340', change: '+3.1%', positive: true },
    { code: '6146', name: 'Disco Corp', price: '¥45,200', change: '+0.9%', positive: true },
  ];

  const actionLog = [
    { time: 'Jan 23', action: 'Upgraded', company: 'Tokyo Electron', detail: 'PT ¥28,000 → ¥32,000', type: 'upgrade' },
    { time: 'Jan 22', action: 'Initiated', company: 'Lasertec', detail: 'Buy rating, PT ¥35,000', type: 'initiate' },
    { time: 'Jan 20', action: 'Downgraded', company: 'Screen Holdings', detail: 'Hold → Sell', type: 'downgrade' },
    { time: 'Jan 18', action: 'Note Published', company: 'Advantest', detail: 'HBM demand outlook', type: 'note' },
    { time: 'Jan 15', action: 'Meeting', company: 'Disco Corp', detail: 'IR meeting notes added', type: 'meeting' },
  ];

  const newsflow = [
    { date: 'Jan 23', headline: 'TSMC raises capex guidance, positive for SPE names', source: 'Reuters', sentiment: 'positive' },
    { date: 'Jan 22', headline: 'China export controls may tighten further in Q2', source: 'Nikkei', sentiment: 'negative' },
    { date: 'Jan 21', headline: 'Intel delays Ohio fab, equipment orders pushed back', source: 'Bloomberg', sentiment: 'negative' },
    { date: 'Jan 20', headline: 'Samsung HBM4 development ahead of schedule', source: 'Korea Times', sentiment: 'positive' },
    { date: 'Jan 19', headline: 'ASML bookings beat expectations in Q4', source: 'Company Filing', sentiment: 'positive' },
  ];

  const earnings = [
    { company: 'Tokyo Electron', date: 'Feb 8', quarter: 'Q3 FY24', consensus: '¥420B rev', status: 'upcoming' },
    { company: 'Advantest', date: 'Jan 31', quarter: 'Q3 FY24', consensus: '¥180B rev', status: 'upcoming' },
    { company: 'Lasertec', date: 'Feb 14', quarter: 'Q2 FY24', consensus: '¥85B rev', status: 'upcoming' },
    { company: 'Screen Holdings', date: 'Jan 30', quarter: 'Q3 FY24', consensus: '¥150B rev', status: 'upcoming' },
    { company: 'Disco Corp', date: 'Feb 5', quarter: 'Q3 FY24', consensus: '¥95B rev', status: 'upcoming' },
  ];

  const valuations = [
    { company: 'Tokyo Electron', pe: '22.5x', pbv: '4.2x', evEbitda: '14.8x', divYield: '2.1%' },
    { company: 'Advantest', pe: '28.3x', pbv: '5.8x', evEbitda: '18.2x', divYield: '1.2%' },
    { company: 'Lasertec', pe: '35.1x', pbv: '8.9x', evEbitda: '25.4x', divYield: '0.8%' },
    { company: 'Screen Holdings', pe: '18.2x', pbv: '2.9x', evEbitda: '11.5x', divYield: '2.8%' },
    { company: 'Disco Corp', pe: '31.2x', pbv: '6.1x', evEbitda: '20.3x', divYield: '1.5%' },
  ];

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

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold hover:text-gray-600">Kabuten 株典</Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Analyst Sector</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/themes" className="text-xs text-gray-500 hover:text-gray-800">Themes</Link>
          <Link href="/heatmap" className="text-xs text-gray-500 hover:text-gray-800">Heatmap</Link>
          <Link href="/podcasts" className="text-xs text-gray-500 hover:text-gray-800">Podcasts</Link>
          <Link href="/ask" className="text-xs text-gray-500 hover:text-gray-800">Ask AI</Link>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Analyst Sector</h1>
        <p className="text-sm text-gray-500 mt-1">Track companies, news, earnings, and valuations by sector</p>
      </div>

      {/* Sector Buttons */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-3">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSector === sector.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {sector.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Section: Title area + Investment Recommendation */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - empty or can be used for other content */}
          <div className="lg:col-span-2"></div>

          {/* Investment Recommendation Box - Top Right */}
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                📈 Investment Recommendation
              </h2>
              <span className="px-3 py-1 bg-emerald-600 text-white text-sm font-bold rounded-full">
                OVERWEIGHT
              </span>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong className="text-emerald-700">Bullish outlook for SPE sector.</strong> We maintain our positive stance driven by structural tailwinds from AI infrastructure buildout and advanced packaging demand.
              </p>
              <p>
                TSMC's raised capex guidance and Samsung's accelerated HBM4 timeline validate our thesis. Japanese SPE names remain best-positioned to capture incremental wafer fab equipment spend through 2026-2027.
              </p>
              <div className="pt-3 border-t border-emerald-200">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Top Pick:</span>
                  <span className="font-semibold text-emerald-700">Tokyo Electron (8035)</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Target Upside:</span>
                  <span className="font-semibold text-emerald-700">+18% to ¥28,000</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-600">Jan 23, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Companies Box */}
          <div className="bg-white rounded-xl border border-gray-300 p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🏢 Companies
            </h2>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-xs text-gray-500 font-medium pb-2 border-b border-gray-200">
                <span>Code</span>
                <span>Name</span>
                <span className="text-right">Price</span>
                <span className="text-right">Change</span>
              </div>
              {companies.map((company, index) => (
                <Link
                  key={index}
                  href={`/company/${company.code}`}
                  className="grid grid-cols-4 text-sm py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <span className="text-gray-500 font-mono">{company.code}</span>
                  <span className="font-medium text-gray-800">{company.name}</span>
                  <span className="text-right text-gray-700">{company.price}</span>
                  <span className={`text-right font-medium ${company.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {company.change}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Log Box */}
          <div className="bg-white rounded-xl border border-gray-300 p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📋 Action Log
            </h2>
            <div className="space-y-3">
              {actionLog.map((item, index) => (
                <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-400 w-16 flex-shrink-0">{item.time}</span>
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

          {/* Newsflow Box */}
          <div className="bg-white rounded-xl border border-gray-300 p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📰 Newsflow
            </h2>
            <div className="space-y-3">
              {newsflow.map((item, index) => (
                <div key={index} className="py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{item.source}</span>
                    <span className={`text-xs ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment === 'positive' ? '▲' : item.sentiment === 'negative' ? '▼' : '●'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{item.headline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Box */}
          <div className="bg-white rounded-xl border border-gray-300 p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Earnings
            </h2>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-xs text-gray-500 font-medium pb-2 border-b border-gray-200">
                <span>Company</span>
                <span>Date</span>
                <span>Quarter</span>
                <span>Consensus</span>
              </div>
              {earnings.map((item, index) => (
                <div key={index} className="grid grid-cols-4 text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-800">{item.company}</span>
                  <span className="text-gray-600">{item.date}</span>
                  <span className="text-gray-500">{item.quarter}</span>
                  <span className="text-gray-600">{item.consensus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Valuations Box - Full Width */}
          <div className="bg-white rounded-xl border border-gray-300 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              💰 Valuations
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 font-medium border-b border-gray-200">
                    <th className="text-left py-2">Company</th>
                    <th className="text-right py-2">P/E</th>
                    <th className="text-right py-2">P/BV</th>
                    <th className="text-right py-2">EV/EBITDA</th>
                    <th className="text-right py-2">Div Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((item, index) => (
                    <tr key={index} className="text-sm border-b border-gray-100 last:border-0">
                      <td className="py-3 font-medium text-gray-800">{item.company}</td>
                      <td className="py-3 text-right text-gray-700">{item.pe}</td>
                      <td className="py-3 text-right text-gray-700">{item.pbv}</td>
                      <td className="py-3 text-right text-gray-700">{item.evEbitda}</td>
                      <td className="py-3 text-right text-gray-700">{item.divYield}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Financial Data Box - Full Width at Bottom */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl border border-gray-300 p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📊 Financial Data
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 font-medium border-b border-gray-200">
                  <th className="text-left py-2">Company</th>
                  <th className="text-right py-2">Revenue (¥B)</th>
                  <th className="text-right py-2">YoY Growth</th>
                  <th className="text-right py-2">Op. Margin</th>
                  <th className="text-right py-2">Net Income (¥B)</th>
                  <th className="text-right py-2">ROE</th>
                  <th className="text-right py-2">D/E Ratio</th>
                  <th className="text-right py-2">FCF (¥B)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-800">Tokyo Electron</td>
                  <td className="py-3 text-right text-gray-700">2,090</td>
                  <td className="py-3 text-right text-emerald-600">+12.4%</td>
                  <td className="py-3 text-right text-gray-700">28.5%</td>
                  <td className="py-3 text-right text-gray-700">428</td>
                  <td className="py-3 text-right text-gray-700">24.2%</td>
                  <td className="py-3 text-right text-gray-700">0.08x</td>
                  <td className="py-3 text-right text-gray-700">385</td>
                </tr>
                <tr className="text-sm border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-800">Advantest</td>
                  <td className="py-3 text-right text-gray-700">640</td>
                  <td className="py-3 text-right text-emerald-600">+18.7%</td>
                  <td className="py-3 text-right text-gray-700">31.2%</td>
                  <td className="py-3 text-right text-gray-700">142</td>
                  <td className="py-3 text-right text-gray-700">28.9%</td>
                  <td className="py-3 text-right text-gray-700">0.12x</td>
                  <td className="py-3 text-right text-gray-700">118</td>
                </tr>
                <tr className="text-sm border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-800">Lasertec</td>
                  <td className="py-3 text-right text-gray-700">285</td>
                  <td className="py-3 text-right text-emerald-600">+24.1%</td>
                  <td className="py-3 text-right text-gray-700">42.8%</td>
                  <td className="py-3 text-right text-gray-700">89</td>
                  <td className="py-3 text-right text-gray-700">35.4%</td>
                  <td className="py-3 text-right text-gray-700">0.05x</td>
                  <td className="py-3 text-right text-gray-700">72</td>
                </tr>
                <tr className="text-sm border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-800">Screen Holdings</td>
                  <td className="py-3 text-right text-gray-700">520</td>
                  <td className="py-3 text-right text-emerald-600">+8.2%</td>
                  <td className="py-3 text-right text-gray-700">18.4%</td>
                  <td className="py-3 text-right text-gray-700">68</td>
                  <td className="py-3 text-right text-gray-700">16.8%</td>
                  <td className="py-3 text-right text-gray-700">0.22x</td>
                  <td className="py-3 text-right text-gray-700">45</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-3 font-medium text-gray-800">Disco Corp</td>
                  <td className="py-3 text-right text-gray-700">310</td>
                  <td className="py-3 text-right text-emerald-600">+15.3%</td>
                  <td className="py-3 text-right text-gray-700">38.6%</td>
                  <td className="py-3 text-right text-gray-700">95</td>
                  <td className="py-3 text-right text-gray-700">22.1%</td>
                  <td className="py-3 text-right text-gray-700">0.03x</td>
                  <td className="py-3 text-right text-gray-700">82</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <span>Data as of FY2024 Q3 (Oct-Dec 2025) • Revenue and Net Income in billions of yen</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="text-center text-xs text-gray-400">
          <p>Kabuten 株典 • AI-powered fundamental research for Japanese equities</p>
          <p className="mt-1">Data delayed 15 minutes • Not financial advice • © 2026</p>
        </div>
      </div>
    </div>
  );
}
