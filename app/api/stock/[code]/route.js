import { NextResponse } from 'next/server';

// Map Kabuten stock codes to Yahoo Finance symbols
function getYahooSymbol(code) {
  // Japanese stocks - add .T suffix for Tokyo Stock Exchange
  if (/^\d{4}$/.test(code)) {
    return `${code}.T`;
  }
  
  // Taiwan stocks - already have .TW suffix
  if (code.endsWith('.TW')) {
    return code;
  }
  
  // Korean stocks - convert to Yahoo format
  if (code.endsWith('.KS')) {
    return code;
  }
  
  // China stocks - Shenzhen (.SZ)
  if (code.endsWith('.SZ')) {
    return code.replace('.SZ', '.SZ');
  }
  
  // Shanghai stocks (.SS)
  if (code.endsWith('.SS')) {
    return code;
  }
  
  return code;
}

// Format large numbers (e.g., market cap)
function formatMarketCap(value, currency) {
  if (!value) return null;
  const trillion = 1e12;
  const billion = 1e9;
  
  if (currency === 'JPY' || currency === 'KRW') {
    // Japanese Yen / Korean Won - use Trillion
    if (value >= trillion) {
      return `¥${(value / trillion).toFixed(1)}T`;
    } else if (value >= billion) {
      return `¥${(value / billion).toFixed(0)}B`;
    }
  } else if (currency === 'TWD') {
    // Taiwan Dollar
    if (value >= trillion) {
      return `NT$${(value / trillion).toFixed(1)}T`;
    } else if (value >= billion) {
      return `NT$${(value / billion).toFixed(0)}B`;
    }
  } else {
    // USD and others
    if (value >= trillion) {
      return `$${(value / trillion).toFixed(1)}T`;
    } else if (value >= billion) {
      return `$${(value / billion).toFixed(0)}B`;
    }
  }
  return value.toLocaleString();
}

// Calculate percentage change between two prices
function calcPctChange(current, past) {
  if (!past || past === 0) return null;
  return ((current - past) / past * 100).toFixed(1);
}

export async function GET(request, { params }) {
  try {
    const { code } = await params;
    const symbol = getYahooSymbol(code);
    
    // Calculate date range (3 years back for 3Y performance calc)
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (3 * 365 * 24 * 60 * 60); // 3 years ago
    
    // Fetch daily data for accurate performance calculations
    const dailyUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d&includePrePost=false`;
    
    // Fetch monthly data for candlestick chart
    const monthlyUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${endDate - (2 * 365 * 24 * 60 * 60)}&period2=${endDate}&interval=1mo&includePrePost=false`;
    
    const [dailyResponse, monthlyResponse] = await Promise.all([
      fetch(dailyUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }),
      fetch(monthlyUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
    ]);
    
    if (!dailyResponse.ok) {
      console.error(`Yahoo Finance error for ${symbol}: ${dailyResponse.status}`);
      return NextResponse.json({ error: 'Failed to fetch stock data', symbol }, { status: 500 });
    }
    
    const dailyData = await dailyResponse.json();
    const monthlyData = monthlyResponse.ok ? await monthlyResponse.json() : null;
    
    if (!dailyData.chart?.result?.[0]) {
      return NextResponse.json({ error: 'No data available', symbol }, { status: 404 });
    }
    
    const dailyResult = dailyData.chart.result[0];
    const dailyQuotes = dailyResult.indicators?.quote?.[0];
    const dailyTimestamps = dailyResult.timestamp;
    const meta = dailyResult.meta;
    
    if (!dailyQuotes || !dailyTimestamps) {
      return NextResponse.json({ error: 'Invalid data format', symbol }, { status: 500 });
    }
    
    // Current price
    const currentPrice = Math.round(meta.regularMarketPrice || 0);
    const previousClose = Math.round(meta.regularMarketPreviousClose || meta.previousClose || currentPrice);
    const dailyChange = previousClose > 0 ? ((currentPrice - previousClose) / previousClose * 100).toFixed(2) : 0;
    
    // Build daily close prices array for performance calculations
    const dailyCloses = dailyTimestamps.map((ts, i) => ({
      date: new Date(ts * 1000),
      close: dailyQuotes.close?.[i] ? Math.round(dailyQuotes.close[i]) : null
    })).filter(d => d.close !== null);
    
    // Calculate performance periods
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
    const threeYearsAgo = new Date(now - 3 * 365 * 24 * 60 * 60 * 1000);
    
    // Find closest price to each date
    const findClosestPrice = (targetDate) => {
      const sorted = dailyCloses
        .filter(d => d.date <= targetDate)
        .sort((a, b) => b.date - a.date);
      return sorted[0]?.close || null;
    };
    
    const weekAgoPrice = findClosestPrice(oneWeekAgo);
    const monthAgoPrice = findClosestPrice(oneMonthAgo);
    const yearAgoPrice = findClosestPrice(oneYearAgo);
    const threeYearAgoPrice = findClosestPrice(threeYearsAgo);
    
    const performance = {
      week1: calcPctChange(currentPrice, weekAgoPrice),
      month1: calcPctChange(currentPrice, monthAgoPrice),
      year1: calcPctChange(currentPrice, yearAgoPrice),
      year3: calcPctChange(currentPrice, threeYearAgoPrice)
    };
    
    // Key Metrics from Yahoo Finance meta
    const currency = meta.currency || 'JPY';
    const keyMetrics = {
      marketCap: formatMarketCap(meta.marketCap, currency),
      marketCapRaw: meta.marketCap || null,
      per: meta.trailingPE ? meta.trailingPE.toFixed(1) : null,
      pbr: meta.priceToBook ? meta.priceToBook.toFixed(2) : null,
      dividendYield: meta.dividendYield ? (meta.dividendYield * 100).toFixed(2) + '%' : null,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ? Math.round(meta.fiftyTwoWeekHigh) : null,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ? Math.round(meta.fiftyTwoWeekLow) : null,
      volume: meta.regularMarketVolume || null,
      avgVolume: meta.averageDailyVolume10Day || null
    };
    
    // Build OHLC data for candlestick chart (monthly)
    let ohlcData = [];
    if (monthlyData?.chart?.result?.[0]) {
      const monthlyResult = monthlyData.chart.result[0];
      const monthlyQuotes = monthlyResult.indicators?.quote?.[0];
      const monthlyTimestamps = monthlyResult.timestamp;
      
      if (monthlyQuotes && monthlyTimestamps) {
        ohlcData = monthlyTimestamps.map((ts, i) => {
          const date = new Date(ts * 1000);
          return {
            date: date.toISOString().split('T')[0],
            month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
            open: monthlyQuotes.open?.[i] ? Math.round(monthlyQuotes.open[i]) : null,
            high: monthlyQuotes.high?.[i] ? Math.round(monthlyQuotes.high[i]) : null,
            low: monthlyQuotes.low?.[i] ? Math.round(monthlyQuotes.low[i]) : null,
            close: monthlyQuotes.close?.[i] ? Math.round(monthlyQuotes.close[i]) : null,
            volume: monthlyQuotes.volume?.[i] || 0
          };
        }).filter(d => d.open !== null && d.close !== null);
      }
    }
    
    return NextResponse.json({
      symbol,
      code,
      currentPrice,
      previousClose,
      priceChange: parseFloat(dailyChange),
      currency,
      performance,
      keyMetrics,
      ohlc: ohlcData,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
