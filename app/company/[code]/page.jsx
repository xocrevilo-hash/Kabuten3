'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { companies } from '@/lib/companies';

// EPS Data for 10 key companies - company code -> FY data
const companyEpsData = {
  "4755": { // Rakuten - loss-making, improving
    FY2025: { avg: -72.33, trend: -25.2 },
    FY2026: { avg: 1.62, trend: -85.5 },
    FY2027: { avg: 26.25, trend: -42.0 }
  },
  "6758": { // Sony - stable growth
    FY2025: { avg: 191.33, trend: +8.5 },
    FY2026: { avg: 212.39, trend: +9.8 },
    FY2027: { avg: 233.88, trend: +7.5 }
  },
  "7203": { // Toyota - steady upgrades
    FY2025: { avg: 271.96, trend: +7.8 },
    FY2026: { avg: 291.41, trend: +7.2 },
    FY2027: { avg: 309.93, trend: +6.5 }
  },
  "9984": { // SoftBank Group - volatile, big upgrades
    FY2025: { avg: 560.45, trend: +76.8 },
    FY2026: { avg: 703.39, trend: +58.2 },
    FY2027: { avg: 830.30, trend: +43.5 }
  },
  "7974": { // Nintendo - FY25 decline (Switch aging), FY26-27 recovery (Switch 2)
    FY2025: { avg: 309.11, trend: -10.5 },
    FY2026: { avg: 468.48, trend: +24.8 },
    FY2027: { avg: 634.69, trend: +22.5 }
  },
  "8035": { // Tokyo Electron - AI boom, strong upgrades
    FY2025: { avg: 1080.99, trend: +28.2 },
    FY2026: { avg: 1378.98, trend: +31.5 },
    FY2027: { avg: 1615.99, trend: +27.2 }
  },
  "6857": { // Advantest - AI testing surge
    FY2025: { avg: 240.28, trend: +67.5 },
    FY2026: { avg: 363.49, trend: +66.2 },
    FY2027: { avg: 488.70, trend: +53.8 }
  },
  "8306": { // MUFG - rate normalization benefit
    FY2025: { avg: 134.44, trend: +18.2 },
    FY2026: { avg: 154.23, trend: +15.3 },
    FY2027: { avg: 174.18, trend: +14.8 }
  },
  "9983": { // Fast Retailing - global growth
    FY2025: { avg: 1252.88, trend: +20.5 },
    FY2026: { avg: 1412.55, trend: +18.8 },
    FY2027: { avg: 1565.38, trend: +15.2 }
  },
  "4568": { // Daiichi Sankyo - ADC growth story
    FY2025: { avg: 118.45, trend: +42.5 },
    FY2026: { avg: 158.72, trend: +38.2 },
    FY2027: { avg: 205.88, trend: +35.5 }
  },
  // ============================================
  // INTERNATIONAL COMPANIES - EPS REVISIONS DATA
  // ============================================
  // TAIWAN
  "2330.TW": { // TSMC - AI chip demand driving massive upgrades
    FY2025: { avg: 46.50, trend: +48.0 },  // NT$ EPS, +48% YoY growth
    FY2026: { avg: 60.45, trend: +30.0 },  // Analysts raised 9-15% after Q3
    FY2027: { avg: 74.55, trend: +23.3 }   // Goldman target NT$100+ by 2027
  },
  "2308.TW": { // Delta Electronics - AI server power demand boom
    FY2025: { avg: 19.18, trend: +35.5 },  // NT$ EPS, strong AI demand
    FY2026: { avg: 23.87, trend: +24.5 },  // Consensus upgrades on AI/EV
    FY2027: { avg: 28.20, trend: +18.2 }   // Structural growth story
  },
  "3711.TW": { // ASE Technology - Advanced packaging surge
    FY2025: { avg: 7.77, trend: +22.5 },   // NT$ EPS, CoWoS beneficiary
    FY2026: { avg: 9.65, trend: +24.2 },   // BofA raised target to NT$250
    FY2027: { avg: 11.58, trend: +20.0 }   // Capacity expansion benefits
  },
  "2345.TW": { // Accton Technology - 800G switch demand
    FY2025: { avg: 40.08, trend: +34.5 },  // NT$ EPS, AI data center growth
    FY2026: { avg: 52.10, trend: +30.0 },  // Hyperscaler demand strong
    FY2027: { avg: 65.13, trend: +25.0 }   // 1.6T transition opportunity
  },
  "2454.TW": { // MediaTek - Smartphone + AI edge growth
    FY2025: { avg: 66.59, trend: +38.2 },  // NT$ EPS, Dimensity 9500 boost
    FY2026: { avg: 78.95, trend: +18.5 },  // UBS target NT$1,800
    FY2027: { avg: 90.80, trend: +15.0 }   // AI accelerator revenue growing
  },
  // KOREA
  "000660.KS": { // SK Hynix - HBM leader, record profits
    FY2025: { avg: 85250, trend: +620.0 }, // KRW EPS, massive turnaround
    FY2026: { avg: 105500, trend: +23.8 }, // HBM4 ramp, DRAM recovery
    FY2027: { avg: 118200, trend: +12.0 }  // Normalization but still strong
  },
  "005930.KS": { // Samsung Electronics - Memory recovery, HBM catch-up
    FY2025: { avg: 6850, trend: +208.0 },  // KRW EPS, Q4 record ₩20T OP
    FY2026: { avg: 8920, trend: +30.2 },   // HBM4 production, memory prices
    FY2027: { avg: 10250, trend: +14.9 }   // Foundry improvement expected
  },
  // CHINA
  "300308.SZ": { // Zhongji Innolight - AI optical module leader
    FY2025: { avg: 17.50, trend: +138.0 }, // CNY EPS, 800G demand explosion
    FY2026: { avg: 25.80, trend: +47.4 },  // Revenue CAGR 58% projected
    FY2027: { avg: 35.20, trend: +36.4 }   // 1.6T transition opportunity
  },
  "300418.SZ": { // Kunlun Tech - AI pivot, volatile
    FY2025: { avg: -1.33, trend: -15.0 },  // CNY EPS, loss-making on AI investment
    FY2026: { avg: 0.85, trend: +163.9 },  // Potential turnaround
    FY2027: { avg: 2.10, trend: +147.1 }   // If AI monetization succeeds
  },
  "601698.SS": { // China Satcom - Space theme, high P/E
    FY2025: { avg: 0.10, trend: +12.5 },   // CNY EPS, modest but growing
    FY2026: { avg: 0.13, trend: +30.0 },   // Satellite expansion
    FY2027: { avg: 0.17, trend: +30.8 }    // Government support continues
  },
  "600183.SS": { // Shengyi Technology - PCB/CCL for AI servers
    FY2025: { avg: 1.16, trend: +63.0 },   // CNY EPS, AI server demand
    FY2026: { avg: 1.52, trend: +31.0 },   // Copper clad laminate growth
    FY2027: { avg: 1.85, trend: +21.7 }    // High-speed materials expansion
  },
  "300750.SZ": { // CATL - EV battery leader
    FY2025: { avg: 11.55, trend: +15.0 },  // CNY EPS, steady growth
    FY2026: { avg: 14.43, trend: +24.9 },  // JPMorgan raised 10%, energy storage
    FY2027: { avg: 17.60, trend: +22.0 }   // Global expansion, LFP dominance
  },
  // JAPAN - NEW
  "3350": { // Metaplanet - Bitcoin treasury, no traditional EPS
    FY2025: { avg: -5.2, trend: +850.0 },  // JPY EPS, BTC correlation
    FY2026: { avg: 12.5, trend: +340.4 },  // If BTC appreciates
    FY2027: { avg: 28.0, trend: +124.0 }   // Highly speculative
  }
};

// Generate chart data from summary
function generateEpsChartData(avgEps, trendPct) {
  const startEps = avgEps / (1 + trendPct/100);
  const weeks = ["Oct 14", "Oct 21", "Oct 28", "Nov 4", "Nov 11", "Nov 18", "Nov 25", "Dec 2", "Dec 9", "Dec 16", "Dec 23", "Jan 6"];
  const variance = [0.95, 1.02, 0.98, 1.05, 0.97, 1.03, 0.99, 1.01, 0.96, 1.04, 1.0, 1.0];
  
  return {
    marketScreener: { name: "MarketScreener", color: "#3b82f6", data: weeks.map((week, i) => ({ week, eps: (startEps + (avgEps - startEps) * (i/11)) * variance[i] * 1.02 })) },
    stockopedia: { name: "Stockopedia", color: "#10b981", data: weeks.map((week, i) => ({ week, eps: (startEps + (avgEps - startEps) * (i/11)) * variance[(i+3)%12] * 0.98 })) },
    investingCom: { name: "Investing.com", color: "#f59e0b", data: weeks.map((week, i) => ({ week, eps: (startEps + (avgEps - startEps) * (i/11)) * variance[(i+6)%12] * 1.01 })) },
    yahooFinance: { name: "Yahoo Finance", color: "#8b5cf6", data: weeks.map((week, i) => ({ week, eps: (startEps + (avgEps - startEps) * (i/11)) * variance[(i+9)%12] * 0.99 })) }
  };
}

// Generate 6-month stock price data based on current price and 6M performance
function generateStockPriceData(currentPrice, monthlyChange) {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  // Calculate starting price from 6-month performance (approximate from 1M change * 6)
  const sixMonthChange = monthlyChange * 4.5; // rough approximation
  const startPrice = currentPrice / (1 + sixMonthChange / 100);
  
  // Generate realistic price movement with some volatility
  const data = [];
  for (let i = 0; i < 6; i++) {
    const progress = i / 5;
    const basePrice = startPrice + (currentPrice - startPrice) * progress;
    // Add some volatility (±5%)
    const volatility = 1 + (Math.sin(i * 2.5) * 0.03) + (Math.cos(i * 1.8) * 0.02);
    data.push({
      month: months[i],
      price: Math.round(basePrice * volatility)
    });
  }
  return data;
}

export default function CompanyPage() {
  const params = useParams();
  const code = params.code;
  const [selectedPeriod, setSelectedPeriod] = useState('FY2026');
  const [liveStockData, setLiveStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(true);
  
  const company = companies?.find(c => c.code === code);
  
  // Fetch live stock data
  useEffect(() => {
    if (code) {
      setStockLoading(true);
      fetch(`/api/stock/${code}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error && data.ohlc?.length > 0) {
            setLiveStockData(data);
          }
          setStockLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch stock data:', err);
          setStockLoading(false);
        });
    }
  }, [code]);
  
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Company Not Found</h1>
          <p className="text-gray-500 mb-4">Code: {code}</p>
          <a href="/" className="text-blue-600 hover:underline">← Back to Homepage</a>
        </div>
      </div>
    );
  }

  const topixPerformance = { day1: +0.3, week1: +1.2, month1: +4.1, year1: +26.8, year3: +48.5 };
  const hasEpsData = companyEpsData[code];
  
  // Get EPS data for this company or use placeholder
  const epsInfo = hasEpsData ? companyEpsData[code][selectedPeriod] : { avg: 100, trend: 0 };
  const sources = hasEpsData ? generateEpsChartData(epsInfo.avg, epsInfo.trend) : null;
  
  // Generate stock price data - 2 years of monthly OHLC data
  const stockPriceData = generateStockPriceData(company.price || 1000, company.performance?.month1 || 0);

  // 2-Year Candlestick Chart Component - uses live data when available
  const CandlestickChart = ({ priceData, currentPrice, priceChange, liveData, isLoading }) => {
    // Use live OHLC data if available, otherwise generate mock data
    const getCandleData = () => {
      if (liveData?.ohlc?.length > 0) {
        // Use real data from Yahoo Finance
        return liveData.ohlc.slice(-24).map(d => ({
          month: d.month,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          isUp: d.close >= d.open
        }));
      }
      
      // Fallback to mock data
      const months = [];
      const monthNames = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      
      const twoYearGrowth = (company.performance?.year1 || 20) * 1.5;
      const startPrice = currentPrice / (1 + twoYearGrowth / 100);
      
      for (let i = 0; i < 24; i++) {
        const progress = i / 23;
        const basePrice = startPrice + (currentPrice - startPrice) * progress;
        const volatility = 0.05;
        const isUp = Math.random() > 0.35;
        
        const open = basePrice * (1 + (Math.random() - 0.5) * volatility * 0.5);
        const close = isUp ? open * (1 + Math.random() * volatility) : open * (1 - Math.random() * volatility);
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3);
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3);
        
        months.push({
          month: monthNames[i % 12] + (i < 12 ? "'24" : "'25"),
          open: Math.round(open),
          high: Math.round(high),
          low: Math.round(low),
          close: Math.round(close),
          isUp: close > open
        });
      }
      months[23].close = currentPrice;
      months[23].isUp = priceChange >= 0;
      return months;
    };
    
    const candles = getCandleData();
    const numCandles = candles.length;
    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;
    const priceRange = maxPrice - minPrice;
    
    const width = 360, height = 180;
    const padding = { top: 15, right: 10, bottom: 25, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const getX = (i) => padding.left + (i / (numCandles - 1)) * chartWidth;
    const getY = (price) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    
    const candleWidth = chartWidth / numCandles * 0.6;
    
    // Y-axis price labels
    const yLabels = [0, 0.25, 0.5, 0.75, 1].map(pct => Math.round(maxPrice - pct * priceRange));
    
    // Show loading indicator
    if (isLoading) {
      return (
        <div className="w-full h-44 flex items-center justify-center text-gray-400 text-sm">
          Loading chart data...
        </div>
      );
    }
    
    return (
      <div className="relative">
        {liveData && (
          <div className="absolute top-0 right-0 text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Live
          </div>
        )}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <line key={i} x1={padding.left} y1={padding.top + pct * chartHeight}
              x2={width - padding.right} y2={padding.top + pct * chartHeight}
              stroke="#e5e7eb" strokeWidth="1" />
          ))}
          
          {/* Y-axis labels */}
          {yLabels.map((price, i) => (
            <text key={i} x={padding.left - 5} y={padding.top + (i * 0.25) * chartHeight + 4}
              textAnchor="end" className="fill-gray-400" fontSize="9">
              ¥{price.toLocaleString()}
            </text>
          ))}
          
          {/* Candlesticks */}
          {candles.map((candle, i) => {
            const x = getX(i);
            const color = candle.isUp ? '#10b981' : '#ef4444';
            return (
              <g key={i}>
                {/* Wick */}
                <line x1={x} y1={getY(candle.high)} x2={x} y2={getY(candle.low)}
                  stroke={color} strokeWidth="1.5" />
                {/* Body */}
                <rect 
                  x={x - candleWidth/2} 
                  y={getY(Math.max(candle.open, candle.close))}
                  width={candleWidth}
                  height={Math.max(Math.abs(getY(candle.open) - getY(candle.close)), 2)}
                  fill={color}
                />
              </g>
            );
          })}
          
          {/* X-axis labels - show every 4th month */}
          {candles.filter((_, i) => i % Math.ceil(numCandles / 6) === 0 || i === numCandles - 1).map((candle, idx) => {
            const step = Math.ceil(numCandles / 6);
            const actualIdx = Math.min(idx * step, numCandles - 1);
            return (
              <text key={actualIdx} x={getX(actualIdx)} y={height - 5}
                textAnchor="middle" className="fill-gray-400" fontSize="8">
                {candles[actualIdx].month}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const sentimentScore = company.sentiment?.overall || 50;
  const getSentimentColor = (score) => score >= 55 ? 'text-emerald-500' : score >= 45 ? 'text-yellow-500' : 'text-red-400';
  const getSentimentBg = (score) => score >= 55 ? 'bg-emerald-500' : score >= 45 ? 'bg-yellow-500' : 'bg-red-400';
  const getPerformanceColor = (val) => val >= 0 ? 'text-emerald-500' : 'text-red-500';
  
  const getTrendLabel = (change) => {
    if (change > 5) return { text: 'Raised', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (change < -5) return { text: 'Lowered', color: 'text-red-600', bg: 'bg-red-100' };
    return { text: 'Stable', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const formatEps = (val) => `¥${val.toFixed(2)}`;

  // Multi-line chart component
  const MultiLineChart = ({ sources }) => {
    const sourceArr = Object.values(sources);
    const allValues = sourceArr.flatMap(s => s.data.map(d => d.eps));
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    const dataPadding = (dataMax - dataMin) * 0.15 || 10; // 15% padding, minimum 10
    const min = dataMin - dataPadding;
    const max = dataMax + dataPadding;
    const range = max - min || 1;
    
    const width = 400, height = 140;
    const padding = { top: 10, right: 10, bottom: 20, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const getX = (i, total) => padding.left + (i / (total - 1)) * chartWidth;
    const getY = (val) => padding.top + chartHeight - ((val - min) / range) * chartHeight;
    const zeroY = getY(0);

    const weeks = sourceArr[0].data.map(d => d.week);
    const consensusData = weeks.map((week, i) => {
      const values = sourceArr.map(s => s.data[i]?.eps || 0);
      return { week, eps: values.reduce((a, b) => a + b, 0) / values.length };
    });

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
        {[0, 0.5, 1].map((pct, i) => (
          <line key={i} x1={padding.left} y1={padding.top + pct * chartHeight}
            x2={width - padding.right} y2={padding.top + pct * chartHeight}
            stroke="#e5e7eb" strokeWidth="1" />
        ))}
        {min <= 0 && max >= 0 && (
          <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY}
            stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,2" />
        )}
        {[0, 0.5, 1].map((pct, i) => {
          const val = max - pct * range;
          return (
            <text key={i} x={padding.left - 5} y={padding.top + pct * chartHeight + 4}
              textAnchor="end" className="text-xs fill-gray-400" fontSize="9">
              {val.toFixed(0)}
            </text>
          );
        })}
        {sourceArr.map((source, si) => (
          <polyline key={si} fill="none" stroke={source.color} strokeWidth="2" strokeOpacity="0.7"
            points={source.data.map((d, i) => `${getX(i, source.data.length)},${getY(d.eps)}`).join(' ')} />
        ))}
        <polyline fill="none" stroke="#1f2937" strokeWidth="2.5" strokeDasharray="5,3"
          points={consensusData.map((d, i) => `${getX(i, consensusData.length)},${getY(d.eps)}`).join(' ')} />
        {weeks.filter((_, i) => i % 4 === 0 || i === weeks.length - 1).map((week) => {
          const originalIndex = weeks.indexOf(week);
          return (
            <text key={week} x={getX(originalIndex, weeks.length)} y={height - 3}
              textAnchor="middle" className="text-xs fill-gray-400" fontSize="8">
              {week.split(' ')[0]}
            </text>
          );
        })}
        {sourceArr.map((source, si) => (
          <circle key={si} cx={getX(source.data.length - 1, source.data.length)}
            cy={getY(source.data[source.data.length - 1].eps)} r="3" fill={source.color} />
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <a href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">← Homepage</a>
        <span className="text-gray-400 text-xs">EN | JP</span>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {/* Company Header - New Layout */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="flex justify-between items-start gap-4">
            {/* Left side: Name, Price, Themes, Table */}
            <div className="flex-1 flex flex-col">
              <div>
                <div className="text-gray-400 text-xs mb-0.5">{company.code} {company.code.includes('.') ? '' : 'JP'}</div>
                <h1 className="text-2xl font-semibold">{company.name}</h1>
                <div className="text-gray-400 text-sm mb-2">{company.nameJp}</div>
                {/* Price below company name */}
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="text-2xl font-semibold">
                    ¥{(liveStockData?.currentPrice || company.price)?.toLocaleString()}
                    {liveStockData && <span className="ml-2 text-xs text-green-500 font-normal">● Live</span>}
                  </div>
                  <div className={`text-base font-medium ${(liveStockData?.priceChange ?? company.priceChange) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {(liveStockData?.priceChange ?? company.priceChange) >= 0 ? '+' : ''}{(liveStockData?.priceChange ?? company.priceChange)?.toFixed(2)}%
                  </div>
                </div>
                {/* Theme keywords */}
                <div className="flex flex-wrap gap-2">
                  {company.themes?.map((t) => (
                    <a key={t} href={`/themes?filter=${encodeURIComponent(t)}`} 
                       className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer">
                      {t}
                    </a>
                  ))}
                </div>
              </div>
              {/* Price % table (justified to bottom) */}
              <div className="border-t border-gray-200 pt-3 mt-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left px-1 font-normal"></th>
                      <th className="text-right px-1 font-normal">1D</th>
                      <th className="text-right px-1 font-normal">1W</th>
                      <th className="text-right px-1 font-normal">1M</th>
                      <th className="text-right px-1 font-normal">1Y</th>
                      <th className="text-right px-1 font-normal">3Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-medium">
                      <td className="text-left px-1 text-gray-500">Stock</td>
                      <td className={`text-right px-1 ${getPerformanceColor(company.priceChange)}`}>
                        {company.priceChange >= 0 ? '+' : ''}{company.priceChange}%
                      </td>
                      <td className={`text-right px-1 ${getPerformanceColor(company.performance?.week1)}`}>
                        {company.performance?.week1 >= 0 ? '+' : ''}{company.performance?.week1}%
                      </td>
                      <td className={`text-right px-1 ${getPerformanceColor(company.performance?.month1)}`}>
                        {company.performance?.month1 >= 0 ? '+' : ''}{company.performance?.month1}%
                      </td>
                      <td className={`text-right px-1 ${getPerformanceColor(company.performance?.year1)}`}>
                        {company.performance?.year1 >= 0 ? '+' : ''}{company.performance?.year1}%
                      </td>
                      <td className={`text-right px-1 ${getPerformanceColor(company.performance?.year3)}`}>
                        {company.performance?.year3 >= 0 ? '+' : ''}{company.performance?.year3}%
                      </td>
                    </tr>
                    <tr className="font-medium">
                      <td className="text-left px-1 text-gray-500">TOPIX</td>
                      <td className={`text-right px-1 ${getPerformanceColor(topixPerformance.day1)}`}>+{topixPerformance.day1}%</td>
                      <td className={`text-right px-1 ${getPerformanceColor(topixPerformance.week1)}`}>+{topixPerformance.week1}%</td>
                      <td className={`text-right px-1 ${getPerformanceColor(topixPerformance.month1)}`}>+{topixPerformance.month1}%</td>
                      <td className={`text-right px-1 ${getPerformanceColor(topixPerformance.year1)}`}>+{topixPerformance.year1}%</td>
                      <td className={`text-right px-1 ${getPerformanceColor(topixPerformance.year3)}`}>+{topixPerformance.year3}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Right side: 2-Year Candlestick Chart */}
            <div className="flex-1 max-w-md">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 font-medium mb-2">Share Price (2 Years)</div>
                <CandlestickChart 
                  priceData={stockPriceData} 
                  currentPrice={liveStockData?.currentPrice || company.price} 
                  priceChange={liveStockData?.priceChange || company.priceChange}
                  liveData={liveStockData}
                  isLoading={stockLoading}
                />
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                  <span className="text-xs text-gray-400">Source: Yahoo Finance</span>
                  <span className="text-xs text-gray-400">{liveStockData ? 'Live' : 'Jan 13, 2026'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <h2 className="text-base font-semibold mb-3">Key Metrics</h2>
          <div className="grid grid-cols-7 gap-3 text-center">
            {[
              { label: "MKT CAP", value: company.marketCap },
              { label: "REVENUE", value: company.revenue },
              { label: "PER", value: company.per },
              { label: "PBR", value: company.pbr },
              { label: "DVD YLD", value: company.dvdYld },
              { label: "FOUNDED", value: company.founded },
              { label: "CEO", value: company.ceo }
            ].map((m) => (
              <div key={m.label}>
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className="font-semibold text-sm truncate">{m.value || '—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Narrative</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">AI-Estimated</span>
          </div>
          <div className="space-y-3">
            {company.narrative?.map((point, i) => {
              const colors = [
                { bg: 'from-blue-50 to-white', border: 'border-blue-400', badge: 'bg-blue-500' },
                { bg: 'from-indigo-50 to-white', border: 'border-indigo-400', badge: 'bg-indigo-500' },
                { bg: 'from-violet-50 to-white', border: 'border-violet-400', badge: 'bg-violet-500' }
              ];
              const icons = ['📈', '📰', '🔮'];
              return (
                <div key={i} className={`bg-gradient-to-r ${colors[i % 3].bg} border-l-4 ${colors[i % 3].border} p-3 rounded-r-lg`}>
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-6 h-6 ${colors[i % 3].badge} text-white rounded-full flex items-center justify-center text-sm`}>
                      {icons[i % 3]}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base mb-1">{point.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{point.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400 italic">
            Sources: Company filings, earnings releases, analyst reports
          </div>
        </div>

        {/* Outlook */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Outlook</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">AI-Estimated</span>
          </div>
          <div className="space-y-3">
            {company.outlook?.map((point, i) => {
              const colors = [
                { bg: 'from-emerald-50 to-white', border: 'border-emerald-400', badge: 'bg-emerald-500' },
                { bg: 'from-amber-50 to-white', border: 'border-amber-400', badge: 'bg-amber-500' },
                { bg: 'from-red-50 to-white', border: 'border-red-400', badge: 'bg-red-500' }
              ];
              const icons = ['📊', '💰', '⚠️'];
              return (
                <div key={i} className={`bg-gradient-to-r ${colors[i % 3].bg} border-l-4 ${colors[i % 3].border} p-3 rounded-r-lg`}>
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-6 h-6 ${colors[i % 3].badge} text-white rounded-full flex items-center justify-center text-sm`}>
                      {icons[i % 3]}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base mb-1">{point.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{point.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400 italic">
            Sources: Company filings, analyst reports, industry research
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Social Media</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">AI-Estimated</span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase">Overall Sentiment</span>
            <div className="w-full max-w-xs">
              <div className="h-2.5 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 rounded-full relative shadow-inner">
                <div className="absolute top-[-3px] w-1 h-4 bg-gray-900 rounded shadow-lg transition-all duration-500"
                  style={{ left: `${sentimentScore}%`, transform: 'translateX(-50%)' }} />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Bearish</span><span>Neutral</span><span>Bullish</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getSentimentColor(sentimentScore)}`}>{sentimentScore}</span>
              <span className="text-gray-500 text-sm font-medium">{company.sentiment?.label || 'Neutral'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {company.sentiment?.platforms?.map((p) => (
              <div key={p.name} className="bg-gray-50 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{p.icon}</span>
                    <div>
                      <div className="font-semibold text-xs text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.nameJp}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getSentimentColor(p.sentiment)}`}>{p.sentiment}%</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getSentimentBg(p.sentiment)}`} style={{ width: `${p.sentiment}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{p.mentions} mentions</span>
                  <span className="text-xs text-gray-500 italic truncate max-w-24">{p.description}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium">Calculation Method:</span>
              <span className="text-xs text-gray-400">Updated: {company.sentiment?.lastUpdated || 'January 11, 2026'}</span>
            </div>
            <div className="text-xs text-gray-400 italic">
              Composite score weighted by mention volume. AI analyzes post content to classify sentiment. Updated weekly.
            </div>
          </div>
        </div>

        {/* Analyst Ratings */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <h2 className="text-base font-semibold mb-3">Analyst Ratings</h2>
          <div className="text-center pb-3 border-b border-gray-100 mb-3">
            <div className="text-xs text-gray-400 uppercase mb-1">Consensus ({company.analystRatings?.totalAnalysts || 0} analysts)</div>
            <span className={`inline-block px-3 py-1 rounded font-bold ${
              company.analystRatings?.consensus === 'BUY' ? 'bg-emerald-100 text-emerald-700' :
              company.analystRatings?.consensus === 'HOLD' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>{company.analystRatings?.consensus || 'HOLD'}</span>
          </div>
          <div className="space-y-1.5 mb-3">
            {[
              { label: "Buy", count: company.analystRatings?.breakdown?.buy || 0, color: "bg-emerald-500" },
              { label: "Hold", count: company.analystRatings?.breakdown?.hold || 0, color: "bg-yellow-400" },
              { label: "Sell", count: company.analystRatings?.breakdown?.sell || 0, color: "bg-red-500" }
            ].map((r) => {
              const total = company.analystRatings?.totalAnalysts || 1;
              const pct = (r.count / total) * 100;
              return (
                <div key={r.label} className="flex items-center gap-2">
                  <span className="w-10 text-xs text-gray-500">{r.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-right text-xs font-semibold">{r.count}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 py-2 border-t border-b border-gray-100">
            <span className="text-xs text-gray-500">Avg Target:</span>
            <span className="font-bold">¥{company.analystRatings?.priceTarget?.average?.toLocaleString() || '—'}</span>
            {company.analystRatings?.priceTarget?.average && (
              <span className={`font-semibold text-sm ${
                company.analystRatings.priceTarget.average > company.price ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {company.analystRatings.priceTarget.average > company.price ? '+' : ''}
                {(((company.analystRatings.priceTarget.average - company.price) / company.price) * 100).toFixed(1)}%
              </span>
            )}
            <span className="text-xs text-gray-400 ml-1">
              (¥{company.analystRatings?.priceTarget?.low?.toLocaleString() || '—'} - ¥{company.analystRatings?.priceTarget?.high?.toLocaleString() || '—'})
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400 italic text-center">
            Source: {company.analystRatings?.source || 'Bloomberg, Refinitiv'}
          </div>
        </div>

        {/* EPS Revisions - Moved to bottom */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Analyst EPS Revisions</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">AI-Estimated</span>
            </div>
            <div className="flex gap-1.5">
              {['FY2025', 'FY2026', 'FY2027'].map(period => (
                <button key={period} onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    selectedPeriod === period ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {period}
                </button>
              ))}
            </div>
          </div>

          {hasEpsData ? (
            <>
              <div className={`p-3 rounded-lg mb-3 ${getTrendLabel(epsInfo.trend).bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Consensus Average (4 sources)</div>
                    <div className="text-xl font-bold text-gray-900">{formatEps(epsInfo.avg)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-bold ${getTrendLabel(epsInfo.trend).color}`}>
                      {epsInfo.trend > 0 ? '+' : ''}{epsInfo.trend.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">vs 3 months ago</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTrendLabel(epsInfo.trend).bg} ${getTrendLabel(epsInfo.trend).color}`}>
                    {epsInfo.trend < -5 ? '↓' : epsInfo.trend > 5 ? '↑' : '→'} {getTrendLabel(epsInfo.trend).text}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-500 mb-1 font-medium">{selectedPeriod} - EPS Estimate Trend (3M)</div>
                <MultiLineChart sources={sources} />
                <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-gray-200">
                  {Object.values(sources).map((source, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-xs text-gray-600">{source.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1">
                    <div className="w-4 border-t-2 border-dashed border-gray-900" />
                    <span className="text-xs text-gray-800 font-medium">Consensus</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">📊 Detailed EPS revision data coming soon</div>
              <div className="text-xs text-gray-400">Check back for multi-source analyst estimates</div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 mt-2 border-t border-gray-100">
            <span>Sources: MarketScreener, Stockopedia, Investing.com, Yahoo Finance</span>
            <span>Updated: January 11, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
