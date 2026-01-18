import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are Kabuten (株典), an AI assistant specializing in Japanese stock market research and analysis.

Your expertise includes:
- Japanese equities (Nikkei 225, TOPIX companies)
- Fundamental analysis (financials, valuations, earnings)
- Investment themes (AI, EV, semiconductors, fintech, etc.)
- Market trends and sector analysis
- Company comparisons

Guidelines:
- Be concise and helpful (aim for 2-3 paragraphs max)
- Use ¥ for Japanese Yen prices
- Reference stock codes (e.g., 7203 for Toyota)
- Provide balanced analysis including both bullish and bearish factors
- Cite specific metrics when discussing valuations (P/E, P/B, dividend yield)
- If asked about specific current prices or breaking news, note that your data may not be real-time
- Be friendly and professional

Key Japanese companies you know well:
- Toyota (7203): Japan's largest automaker, hybrid leader
- Sony (6758): Entertainment conglomerate, gaming, music, semiconductors
- SoftBank Group (9984): Investment holding, Arm Holdings, Vision Fund
- Rakuten (4755): E-commerce, fintech, mobile
- Nintendo (7974): Gaming, Switch console
- Keyence (6861): Factory automation, high margins
- Tokyo Electron (8035): Semiconductor equipment
- Advantest (6857): Chip testing equipment
- MUFG (8306): Japan's largest bank
- Fast Retailing (9983): UNIQLO parent company

You can help users:
- Compare companies
- Understand investment themes
- Analyze fundamentals
- Find stocks matching criteria
- Explain market concepts`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `API error: ${response.status}`,
        details: errorText 
      }, { status: 500 });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
