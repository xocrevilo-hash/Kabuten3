'use client';

import React from 'react';
import Link from 'next/link';

export default function PodcastsPage() {
  // Podcast data - will be updated by scraper
  const podcasts = [
    {
      name: "Hard Fork",
      color: "from-pink-600 to-pink-500",
      emoji: "🍴",
      episode: "AI Agents Are Here. Now What?",
      episodeNum: 158,
      date: "Jan 16, 2026",
      url: "https://podscripts.co/podcasts/hard-fork",
      ideas: [
        {
          summary: "AI agent infrastructure demands",
          detail: "Kevin Roose argued that AI agents performing tasks autonomously will require \"10x more inference compute than chatbots\" because agents make multiple API calls per task. This is bullish for inference-optimized chips and edge AI hardware.",
          timestamp: "18:40"
        },
        {
          summary: "Microsoft Copilot agent rollout",
          detail: "Microsoft is deploying Copilot agents across enterprise customers, with early data showing 40% of compute now going to agent workloads vs 60% for chat. Casey Newton noted this shift could reshape datacenter GPU allocation.",
          timestamp: "25:15"
        },
        {
          summary: "Anthropic's computer use capability",
          detail: "Discussion of how Claude's computer use feature enables agent behaviors that were previously impossible. The hosts debated whether this creates a moat for Anthropic or if OpenAI and Google will quickly match the capability.",
          timestamp: "42:30"
        }
      ]
    },
    {
      name: "All-In Podcast",
      color: "from-yellow-500 to-yellow-400",
      emoji: "🎯",
      episode: "All-In's 2026 Predictions",
      episodeNum: 257,
      date: "Jan 10, 2026",
      url: "https://podscripts.co/podcasts/all-in-with-chamath-jason-sacks-friedberg",
      ideas: [
        {
          summary: "NVIDIA margin compression prediction",
          detail: "Jason Calacanis predicted NVIDIA's gross margins will compress from 75% to 55% by end of 2026 as AMD and custom silicon (Google TPU, Amazon Trainium) gain meaningful share in inference workloads. Chamath disagreed, citing CUDA moat.",
          timestamp: "31:18"
        },
        {
          summary: "Cerebras IPO and inference silicon renaissance",
          detail: "Friedberg highlighted the OpenAI-Cerebras partnership as validation that \"decode silicon\" optimized for inference is becoming critical. Predicted 3-4 inference chip companies will go public in 2026.",
          timestamp: "38:45"
        },
        {
          summary: "China semiconductor self-sufficiency timeline",
          detail: "Sacks argued China will achieve 28nm self-sufficiency by 2027 and 7nm by 2030 despite export controls. \"The restrictions accelerated their timeline, not delayed it.\" Cited SMIC's progress with DUV multi-patterning.",
          timestamp: "52:20"
        }
      ]
    },
    {
      name: "No Priors",
      color: "from-emerald-600 to-emerald-500",
      emoji: "🧠",
      episode: "Ilya Sutskever on What Comes After LLMs",
      episodeNum: 102,
      date: "Jan 9, 2026",
      url: "https://podscripts.co/podcasts/no-priors",
      ideas: [
        {
          summary: "Scaling laws plateau confirmed",
          detail: "Ilya Sutskever confirmed that pure parameter scaling is hitting diminishing returns. \"The next 10x in capability won't come from 10x more compute. It will come from architectural innovations and synthetic data.\"",
          timestamp: "15:22"
        },
        {
          summary: "HBM4 as the new bottleneck",
          detail: "Discussion revealed HBM4 supply constraints are now the primary limiter for frontier AI training, not GPU availability. SK Hynix is \"essentially sold out through 2027\" with TSMC's CoWoS packaging also at capacity.",
          timestamp: "28:45"
        },
        {
          summary: "Test-time compute as the new scaling law",
          detail: "Sarah Guo and Sutskever discussed how test-time compute (thinking longer at inference) is becoming the new scaling frontier. This favors different chip architectures than training - more memory bandwidth, less raw FLOPS.",
          timestamp: "45:10"
        }
      ]
    },
    {
      name: "Big Technology Podcast",
      color: "from-blue-600 to-blue-500",
      emoji: "📱",
      episode: "Inside Microsoft's $80B AI Bet",
      episodeNum: 192,
      date: "Jan 7, 2026",
      url: "https://podscripts.co/podcasts/big-technology-podcast",
      ideas: [
        {
          summary: "Microsoft AI infrastructure spend breakdown",
          detail: "Alex Kantrowitz revealed Microsoft is spending $80B annually on AI infrastructure in 2026, up from $50B in 2025. Breakdown: 55% NVIDIA GPUs, 25% AMD MI300X, 20% internal Maia chips. \"The Maia percentage will double by 2027.\"",
          timestamp: "12:30"
        },
        {
          summary: "OpenAI custom chip ambitions",
          detail: "Sources told Kantrowitz that OpenAI is in advanced talks with TSMC for dedicated 3nm capacity, potentially spending $8-10B on custom AI chips by 2027. \"They want to reduce NVIDIA dependency below 50%.\"",
          timestamp: "24:15"
        }
      ]
    },
    {
      name: "Dwarkesh Podcast",
      color: "from-orange-500 to-orange-400",
      emoji: "🎤",
      episode: "Former TSMC Exec on the Chip Wars",
      episodeNum: 78,
      date: "Jan 3, 2026",
      url: "https://podscripts.co/podcasts/dwarkesh-podcast",
      ideas: [
        {
          summary: "TSMC Arizona reality check",
          detail: "Former TSMC VP explained why the Arizona fab will never match Taiwan efficiency: \"The ecosystem density in Hsinchu took 40 years to build. When a tool breaks at 2am, there are 50 vendors within 30 minutes. In Arizona, you wait for a flight from Taiwan.\"",
          timestamp: "34:22"
        },
        {
          summary: "ASML's true competitive moat",
          detail: "Fascinating detail that ASML's moat isn't the machines themselves but the 5,000+ field engineers who install and maintain them. \"You can't just buy an EUV machine. You need an ASML team living at your fab for years.\"",
          timestamp: "51:45"
        },
        {
          summary: "China's 7nm ceiling explained",
          detail: "Deep technical dive into why SMIC is stuck at 7nm without EUV: \"They can do it with DUV multi-patterning, but yields are 30% vs TSMC's 90%, and costs are 3x. It's a strategic capability, not commercial viability.\"",
          timestamp: "1:08:30"
        }
      ]
    }
  ];

  const totalIdeas = podcasts.reduce((sum, p) => sum + p.ideas.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
            ← Homepage
          </Link>
          <div>
            <span className="font-semibold">Podcast Ideas Tracker</span>
            <span className="text-gray-400 text-xs ml-2">AI & Semiconductor insights</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Updated every 2 days • Last: Jan 18, 2026 10:00 JST</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        
        {/* Summary Stats */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">🎙️ AI & Semiconductor Podcast Intelligence</h1>
              <p className="text-gray-500 text-xs mt-1">Key insights extracted from 5 tech podcasts • Transcripts via PodScripts.co</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">5</div>
                <div className="text-xs text-gray-400">Podcasts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalIdeas}</div>
                <div className="text-xs text-gray-400">Ideas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast Cards */}
        <div className="space-y-4">
          {podcasts.map((podcast) => (
            <div key={podcast.name} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              {/* Podcast Header */}
              <div className={`px-4 py-3 border-b border-gray-200 bg-gradient-to-r ${podcast.color} flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{podcast.emoji}</span>
                  <div>
                    <span className="text-white font-semibold">{podcast.name}</span>
                    <span className="text-white/70 text-xs ml-2">E{podcast.episodeNum} • {podcast.date}</span>
                  </div>
                </div>
                <a 
                  href={podcast.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                >
                  View Transcript →
                </a>
              </div>
              
              {/* Episode Title */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-gray-700 font-medium">"{podcast.episode}"</span>
              </div>
              
              {/* Ideas */}
              <div className="p-4 space-y-4">
                {podcast.ideas.map((idea, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-purple-500 mt-0.5 text-base">💡</span>
                    <div>
                      <p className="text-gray-800">
                        <strong>{idea.summary}:</strong> {idea.detail}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Timestamp: {idea.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Footer */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
          <strong>Methodology:</strong> Transcripts sourced from PodScripts.co. Filtered for AI, semiconductor, chip, GPU, NVIDIA, TSMC, and related keywords. Updated every 2 days.
          <br />
          <strong>Podcasts:</strong> All-In, Big Technology, No Priors, Dwarkesh Podcast, Hard Fork
        </div>
        
      </div>
    </div>
  );
}
