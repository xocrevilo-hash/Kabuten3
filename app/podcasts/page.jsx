'use client';

import React from 'react';
import Link from 'next/link';

export default function PodcastsPage() {
  // Podcast data - updated by podcast_agent.py
  // Ordered chronologically (most recent first)
  const podcasts = [
    {
      name: "20VC",
      color: "from-purple-600 to-purple-500",
      emoji: "🎙️",
      episode: "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch",
      episodeNum: 0,
      date: "Jan 19, 2026",
      url: "https://app.podscribe.com/episode/148512142?transcriptVersionReqId=704c7fa2-f889-4a23-862c-f46c42bca3bf",
      ideas: [
        {
          summary: "Enterprise AI Adoption Facing Security Compliance Blind Spots",
          detail: "Companies are experiencing widespread 'shadow AI' adoption where employees unknowingly feed sensitive data into public AI tools like ChatGPT and Gemini, creating massive security risks. This highlights a critical gap between AI productivity benefits and enterprise security requirements that must be addressed for widespread corporate adoption.",
          timestamp: "02:05"
        },
        {
          summary: "Legal AI Market Experiencing Explosive Growth Phase",
          detail: "Harvey CEO reveals the legal AI space is growing at unprecedented speed, with the broader AI market described as 'massive' and 'exploding.' The competitive landscape includes references to Anthropic potentially reaching $3 billion in revenue, indicating the scale of current AI market expansion.",
          timestamp: "10:49"
        },
        {
          summary: "AI-Powered Compliance Automation Becoming Strategic Investment Priority",
          detail: "Enterprise security platforms like Vanta are leveraging AI automation to help companies achieve compliance faster and unlock major deals. This represents a shift toward AI-enabled infrastructure tools that address regulatory requirements while enabling innovation.",
          timestamp: "04:35"
        },
        {
          summary: "Startup Scaling Requires Distinct Product-Market and Company-Market Fit",
          detail: "Successful AI companies must navigate two separate phases: achieving product-market fit, then developing company-market fit by creating organizational structures suited to their specific vertical. This dual-phase approach is particularly relevant for AI companies operating across global markets with complex regulatory environments.",
          timestamp: "10:13"
        }
      ]
    },
    {
      name: "All-In Podcast",
      color: "from-yellow-500 to-yellow-400",
      emoji: "🎯",
      episode: "Microsoft CEO Satya Nadella on AI's Business Revolution: What Happens to SaaS, OpenAI, and Microsoft? | LIVE from Davos",
      episodeNum: 0,
      date: "January 21, 2026",
      url: "https://app.podscribe.com/episode/148512142?transcriptVersionReqId=704c7fa2-f889-4a23-862c-f46c42bca3bf",
      ideas: [
        {
          summary: "Enterprise AI Adoption Timeline Significantly Delayed",
          detail: "The podcast title indicates that enterprise AI adoption is \"years off,\" suggesting a much slower implementation timeline than many investors expect. This contradicts the current market optimism and could signal overvaluation in enterprise AI companies that are banking on rapid corporate adoption.",
          timestamp: "00:00:32"
        },
        {
          summary: "AI Model Performance Plateau Creates Investment Risk",
          detail: "The title mentions \"How Model Performance is Plateauing,\" indicating that AI model improvements are slowing down despite massive capital investments. This plateau could fundamentally alter the investment thesis for AI companies that depend on continuous performance gains to justify their valuations.",
          timestamp: "00:00:32"
        },
        {
          summary: "Shadow AI Creates Enterprise Security Crisis",
          detail: "Companies face a massive blind spot as employees use public AI tools like ChatGPT and Gemini with sensitive data, creating compliance and security risks. This presents both a threat to existing enterprises and a significant market opportunity for AI governance and security solutions like Nexos AI.",
          timestamp: "00:02:05"
        },
        {
          summary: "Startup Growth Cycles Require Strategic Pivoting",
          detail: "The founder describes a three-stage cycle: product-market fit, company-market fit, then back to product-market fit reinvention. At $190M ARR, Harvey demonstrates how successful companies must continuously oscillate between perfecting their current offering and reimagining their future direction to maintain growth momentum.",
          timestamp: "00:10:13"
        }
      ]
    },
    {
      name: "Hard Fork",
      color: "from-pink-600 to-pink-500",
      emoji: "🍴",
      episode: "Jonathan Haidt Strikes Again + What You Vibecoded + An Update on the Forkiverse",
      episodeNum: 0,
      date: "Jan 16, 2026",
      url: "https://app.podscribe.com/episode/148429306?transcriptVersionReqId=9aeea88b-c216-44be-b3eb-f2f64a4574f5",
      ideas: [
        {
          summary: "Meta's Internal Research Reveals AI Harm Evidence",
          detail: "Meta's own internal research, exposed through attorney general lawsuits and whistleblower reports, provides substantial evidence that social media platforms are causing documented harm to users, particularly teens. This creates significant regulatory and liability risks for major tech companies developing AI-powered social platforms.",
          timestamp: "07:11"
        },
        {
          summary: "AI-Powered Social Media Faces Global Regulatory Crackdown",
          detail: "High-level government officials, including President Macron, are actively pursuing regulatory action against social media platforms based on mounting evidence of harm. This suggests incoming restrictions on AI recommendation algorithms and social features that could impact tech company valuations and operational models.",
          timestamp: "16:18"
        },
        {
          summary: "Grok Implements Paid Tier for AI Features",
          detail: "Grok has rolled back its image generation feature for free users, requiring paid subscriptions for advanced AI capabilities. This indicates a broader industry trend toward monetizing AI features through premium tiers, potentially creating new revenue streams for AI companies.",
          timestamp: "02:58"
        },
        {
          summary: "Claude Code Experiments Show Enterprise AI Adoption",
          detail: "User experiments with Claude's coding capabilities are generating significant interest and impressive results, suggesting strong enterprise demand for AI coding assistants. This indicates growing market opportunities for companies providing AI development tools and programming assistance.",
          timestamp: "01:59"
        }
      ]
    },
    {
      name: "The a16z Podcast",
      color: "from-gray-700 to-gray-600",
      emoji: "🅰️",
      episode: "How Foundation Models Evolved: A PhD Journey Through AI's Breakthrough Era",
      episodeNum: 0,
      date: "Jan 16, 2026",
      url: "https://podscripts.co/podcasts/a16z-podcast/how-foundation-models-evolved-a-phd-journey-through-ais-breakthrough-era",
      ideas: [
        {
          summary: "AI Scaling Paradigm Shift to Systems Approach",
          detail: "The industry has moved away from the belief that simply scaling model parameters and pre-training data is sufficient for AI advancement. Instead, there's a focus on carefully constructed post-training pipelines, retrieval systems, and tool integration, indicating a more engineering-focused approach to AI development.",
          timestamp: "00:51"
        },
        {
          summary: "Need for New AI Programming Abstraction Layer",
          detail: "Natural language is too ambiguous and code too rigid for AI systems, requiring a new abstraction layer similar to the jump from assembly to C programming. This represents a critical infrastructure need that could determine whether AI becomes a programmable tool or remains an unpredictable oracle.",
          timestamp: "02:15"
        },
        {
          summary: "Intelligence as Foundation Technology Like Semiconductors",
          detail: "AI intelligence is compared to chip manufacturing improvements and increasing transistor counts - it's a foundational capability that enables applications rather than replacing software development. This suggests continued investment opportunities in AI infrastructure and tooling rather than viewing AI as a replacement for human programming.",
          timestamp: "14:07"
        },
        {
          summary: "Artificial Programmable Intelligence Over AGI",
          detail: "The focus should shift from pursuing Artificial General Intelligence (AGI) to developing Artificial Programmable Intelligence (API) that can reliably execute specific tasks as directed. This represents a more practical and commercially viable approach to AI development with clearer investment and product development pathways.",
          timestamp: "09:34"
        }
      ]
    },
    {
      name: "No Priors",
      color: "from-emerald-600 to-emerald-500",
      emoji: "🧠",
      episode: "No Priors: Artificial Intelligence | Technology | Startups",
      episodeNum: 0,
      date: "January 15, 2026",
      url: "https://app.podscribe.com/episode/148429306?transcriptVersionReqId=9aeea88b-c216-44be-b3eb-f2f64a4574f5",
      ideas: [
        {
          summary: "AI-Powered Consumer Products Emerging in Transportation",
          detail: "New electric AI-powered mobility solutions like 'Brain on Wheels' tricycles are being introduced to the market. This represents the continued integration of AI capabilities into everyday consumer transportation products beyond traditional automotive applications.",
          timestamp: "00:51"
        },
        {
          summary: "Premium AI Features Driving Monetization Models",
          detail: "Companies are implementing tiered pricing for AI services, with advanced features like image generation being restricted to paid users only. This trend indicates how AI capabilities are becoming key differentiators in freemium business models.",
          timestamp: "02:58"
        },
        {
          summary: "Regulatory Framework Development for AI-Adjacent Technologies",
          detail: "Government leaders are taking direct action on technology regulation, with examples of rapid policy implementation at the highest levels of government. This suggests an accelerating timeline for AI and social media regulation that could impact tech company valuations and operations.",
          timestamp: "16:18"
        },
        {
          summary: "Tech Workers Developing Solutions for Digital Wellness",
          detail: "Even those building smartphone and social media technologies are creating sophisticated systems to limit their own usage and reclaim attention. This insider behavior suggests potential market opportunities for digital wellness solutions and validates concerns about technology's addictive design.",
          timestamp: "17:34"
        }
      ]
    },
    {
      name: "Dwarkesh Podcast",
      color: "from-orange-500 to-orange-400",
      emoji: "🎤",
      episode: "Adam Marblestone – AI is missing something fundamental about the brain",
      episodeNum: 0,
      date: "Dec 30, 2025",
      url: "https://podscripts.co/podcasts/dwarkesh-podcast/adam-marblestone-ai-is-missing-something-fundamental-about-the-brain",
      ideas: [
        {
          summary: "AI Scaling Era Transitioning to Research Focus",
          detail: "According to Ilya Sutskever's episode, the AI industry is moving from the age of scaling to the age of research, suggesting that simply increasing model size and compute may no longer be the primary path forward. This shift implies that breakthroughs will increasingly come from algorithmic improvements and novel research approaches rather than brute-force scaling.",
          timestamp: "N/A"
        },
        {
          summary: "Microsoft Reveals New Fairwater 2 Data Infrastructure",
          detail: "Microsoft's Satya Nadella provided an exclusive first-look at their brand-new Fairwater 2 data center infrastructure as part of their AGI preparation strategy. This suggests Microsoft is making significant hardware investments to support advanced AI workloads and maintain competitive positioning in the AGI race.",
          timestamp: "N/A"
        },
        {
          summary: "Autonomous Robotics Breakthrough Timeline Accelerating",
          detail: "Sergey Levine from Physical Intelligence believes fully autonomous robots are much closer than expected, potentially indicating a 'self-improvement flywheel' in robotics development. This suggests significant investment opportunities in robotics companies and supply chains as physical AI applications approach commercial viability.",
          timestamp: "N/A"
        },
        {
          summary: "AI Energy Demands Creating Massive Infrastructure Needs",
          detail: "Casey Handmer's episode highlights the challenge of feeding hundreds of gigawatts of extra energy demand that AI will create over the coming decade. This massive energy requirement will likely drive significant investments in power generation, grid infrastructure, and energy-efficient computing solutions.",
          timestamp: "N/A"
        }
      ]
    },
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
          <span className="text-gray-400 text-xs">Updated daily at 05:00 HKT • Last: Jan 22, 2026 12:53 JST</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">

        {/* Summary Stats */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">🎙️ AI & Semiconductor Podcast Intelligence</h1>
              <p className="text-gray-500 text-xs mt-1">Key insights extracted from {podcasts.length} tech podcasts • Transcripts via Podscribe</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{podcasts.length}</div>
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
                    <span className="text-white/70 text-xs ml-2">{podcast.date}</span>
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
          <strong>Methodology:</strong> Transcripts sourced from Podscribe. Filtered for AI, semiconductor, chip, GPU, NVIDIA, TSMC, and related keywords. Updated daily.
          <br />
          <strong>Podcasts:</strong> 20VC, All-In, Hard Fork, No Priors, a16z, Dwarkesh
        </div>

      </div>
    </div>
  );
}
