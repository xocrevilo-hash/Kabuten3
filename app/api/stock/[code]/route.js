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
    // Yahoo uses different format for China
    return code.replace('.SZ', '.SZ');
  }
  
  // Shanghai stocks (.SS)
  if (code.endsWith('.SS')) {
    return code;
  }
  
  return code;
}

export async function GET(request, { params }) {
  try {
    const { code } = await params;
    const symbol = getYahooSymbol(code);
    
    // Calculate date range (2 years back)
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (2 * 365 * 24 * 60 * 60); // 2 years ago
    
    // Yahoo Finance v8 API for historical data
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1mo&includePrePost=false`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance error for ${symbol}: ${response.status}`);
      return NextResponse.json({ error: 'Failed to fetch stock data', symbol }, { status: 500 });
    }
    
    const data = await response.json();
    
    if (!data.chart?.result?.[0]) {
      return NextResponse.json({ error: 'No data available', symbol }, { status: 404 });
    }
    
    const result = data.chart.result[0];
    const quotes = result.indicators?.quote?.[0];
    const timestamps = result.timestamp;
    
    if (!quotes || !timestamps) {
      return NextResponse.json({ error: 'Invalid data format', symbol }, { status: 500 });
    }
    
    // Build OHLC data array
    const ohlcData = timestamps.map((ts, i) => {
      const date = new Date(ts * 1000);
      return {
        date: date.toISOString().split('T')[0],
        month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        open: quotes.open?.[i] ? Math.round(quotes.open[i]) : null,
        high: quotes.high?.[i] ? Math.round(quotes.high[i]) : null,
        low: quotes.low?.[i] ? Math.round(quotes.low[i]) : null,
        close: quotes.close?.[i] ? Math.round(quotes.close[i]) : null,
        volume: quotes.volume?.[i] || 0
      };
    }).filter(d => d.open !== null && d.close !== null);
    
    // Get current price and metadata
    const meta = result.meta;
    const currentPrice = Math.round(meta.regularMarketPrice || ohlcData[ohlcData.length - 1]?.close || 0);
    const previousClose = Math.round(meta.chartPreviousClose || meta.previousClose || currentPrice);
    const priceChange = previousClose > 0 ? ((currentPrice - previousClose) / previousClose * 100).toFixed(2) : 0;
    
    return NextResponse.json({
      symbol,
      code,
      currentPrice,
      previousClose,
      priceChange: parseFloat(priceChange),
      currency: meta.currency || 'JPY',
      ohlc: ohlcData,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
