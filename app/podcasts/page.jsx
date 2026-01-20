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
      episode: "20VC: How Model Performance is Plateauing | Two Key Rules for Effective Deal-Making | Company Building Lessons from Keith Rabois, Brian Halligan and Pat Grady | Why Enterprise AI Adoption is Years Off with Harvey CEO Winston Weinberg",
      episodeNum: 0,
      date: "Jan 19, 2026",
      url: "https://app.podscribe.com/episode/148512142?transcriptVersionReqId=704c7fa2-f889-4a23-862c-f46c42bca3bf",
      ideas: [
        {
          summary: "Legal AI Market Experiencing Explosive Growth",
          detail: "Harvey CEO discusses the rapid expansion of the legal AI space, with the company reaching $190M ARR. The CEO emphasizes that the entire AI market is exploding, not just legal AI, indicating massive opportunities across sectors.",
          timestamp: "10:49"
        },
        {
          summary: "Shadow AI Creates Enterprise Security Risks",
          detail: "Companies face significant compliance and security blind spots as employees use public AI tools like ChatGPT and Gemini with sensitive company data. This creates a critical need for AI governance platforms that provide visibility and control over enterprise AI usage.",
          timestamp: "02:05"
        },
        {
          summary: "Enterprise AI Adoption Still Years Away",
          detail: "Despite rapid growth in AI capabilities, the podcast title suggests that widespread enterprise AI adoption remains years off. This indicates a significant gap between AI development and practical enterprise implementation.",
          timestamp: "00:32"
        },
        {
          summary: "AI Model Performance Showing Signs of Plateauing",
          detail: "The podcast title highlights concerns about model performance plateauing, suggesting that the rapid improvements in AI capabilities may be slowing. This has major implications for AI investment strategies and expectations for future breakthroughs.",
          timestamp: "00:00"
        }
      ]
    },
    {
      name: "ChinaTalk",
      color: "from-red-600 to-red-500",
      emoji: "🇨🇳",
      episode: "Party Time! Jon Czin on US-China in 2025 and 2026",
      episodeNum: 0,
      date: "Jan 19, 2026",
      url: "https://app.podscribe.com/episode/148544099",
      ideas: [
        {
          summary: "Transcript Content Not Available",
          detail: "The podcast transcript for 'Party Time! Jon Czin on US-China in 2025 and 2026' is behind a paywall and requires payment to access. Without the actual transcript content, no specific insights about AI, semiconductors, technology, or investing can be extracted.",
          timestamp: "00:00"
        }
      ]
    },
    {
      name: "All-In Podcast",
      color: "from-yellow-500 to-yellow-400",
      emoji: "🎯",
      episode: "Iran's Breaking Point, Trump's Greenland Acquisition, and Solving Energy Costs",
      episodeNum: 0,
      date: "Jan 17, 2026",
      url: "https://podscripts.co/podcasts/all-in-with-chamath-jason-sacks-friedberg",
      ideas: [
        {
          summary: "Harvey AI Shows Legal AI Rapid Growth",
          detail: "Harvey, a legal AI company, has emerged as a front-runner in the legal AI space with impressive growth trajectory, reaching $190M ARR. This demonstrates the significant market opportunity for vertical-specific AI applications in professional services sectors.",
          timestamp: "00:32"
        },
        {
          summary: "Shadow AI Creates Enterprise Security Risks",
          detail: "Employees are feeding sensitive company data into public AI tools like ChatGPT and Gemini, creating massive security and compliance blind spots. This presents both risks for enterprises and investment opportunities in AI governance solutions like Nexos AI.",
          timestamp: "02:05"
        },
        {
          summary: "AI Security Platforms Enable Safe Enterprise Adoption",
          detail: "Companies need unified platforms that provide visibility and control over AI usage while implementing guardrails to protect sensitive data. This represents a growing market for AI governance and security solutions as enterprises seek to enable productivity without blocking innovation.",
          timestamp: "02:05"
        },
        {
          summary: "Product-Market Fit Cycles in AI Companies",
          detail: "AI companies experience recurring cycles of product-market fit as they evolve from initial PMF to company-market fit and back to reinventing PMF. This suggests AI startups must continuously adapt their product strategy as the technology and market mature, creating ongoing investment evaluation challenges.",
          timestamp: "10:13"
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
          summary: "Grok AI Restricts Image Generation for Free Users",
          detail: "Grok has rolled back its image generation feature, now requiring paid subscriptions for AI-powered image creation capabilities. This represents a broader trend of AI companies monetizing advanced features and moving away from freemium models as compute costs remain high.",
          timestamp: "02:58"
        },
        {
          summary: "Meta's Internal Research Reveals Platform Harm Evidence",
          detail: "Leaked Meta internal studies through attorney general lawsuits show extensive evidence of social media platforms causing harm to users, particularly teens. This creates significant legal and regulatory risks for major tech platforms and could impact their valuations and operational costs.",
          timestamp: "07:11"
        },
        {
          summary: "Government Action Against Big Tech Platforms Accelerating",
          detail: "High-level government officials like French President Macron are taking direct action on tech regulation after reviewing platform harm data. This suggests increased regulatory pressure and potential policy changes that could significantly impact major tech companies' business models and growth prospects.",
          timestamp: "16:18"
        },
        {
          summary: "Legal Liability Wave Targeting Social Media Companies",
          detail: "Plaintiff's lawyers are actively building cases against social media platforms using internal research and harm evidence. This creates substantial financial risk for tech giants through potential class-action settlements and damages, which could materially impact their market valuations.",
          timestamp: "16:54"
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
      date: "Jan 15, 2026",
      url: "https://podscripts.co/podcasts/no-priors-artificial-intelligence-technology-startups/",
      ideas: [
        {
          summary: "AI Adoption Accelerating in Conservative Industries",
          detail: "Despite bubble concerns, traditionally slow-adopting sectors like medicine and law are embracing AI at unprecedented rates. This suggests AI's value proposition has crossed a critical threshold for risk-averse industries, indicating sustainable demand beyond hype cycles.",
          timestamp: "N/A"
        },
        {
          summary: "NVIDIA Positioned Beyond Moore's Law Transition",
          detail: "Jensen Huang discusses NVIDIA's strategic positioning as Moore's Law ends, emphasizing reasoning models and robotics expansion. The company's dominance extends beyond AI training to inference and emerging applications, suggesting continued market leadership.",
          timestamp: "N/A"
        },
        {
          summary: "Enterprise AI Agents Transforming Business Operations",
          detail: "Companies like Decagon and Harvey are deploying AI agents to replace traditional human-intensive operations like call centers and legal work. This shift from AI tools to autonomous agents represents a fundamental change in how businesses structure operations and labor.",
          timestamp: "N/A"
        },
        {
          summary: "AI Infrastructure Driving Energy Grid Transformation",
          detail: "Explosive AI energy demand is forcing fundamental changes to electrical grid architecture and energy production. Companies like Base Power are emerging to address this infrastructure gap, creating new investment opportunities in the AI-energy nexus.",
          timestamp: "N/A"
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
    {
      name: "BG2 Pod",
      color: "from-blue-600 to-blue-500",
      emoji: "💼",
      episode: "AI Enterprise - Databricks & Glean | BG2 Guest Interview",
      episodeNum: 0,
      date: "Dec 23, 2025",
      url: "https://app.podscribe.com/episode/147927460",
      ideas: [
        {
          summary: "Transcript Content Not Available for Analysis",
          detail: "The provided transcript excerpt indicates the content is not yet available and requires payment to generate. Without access to the actual discussion content, no insights about AI enterprise adoption, semiconductor developments, or investment implications can be extracted from this source.",
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
          <span className="text-gray-400 text-xs">Updated daily at 05:00 HKT • Last: Jan 20, 2026 20:02 JST</span>
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
          <strong>Podcasts:</strong> 20VC, All-In, Hard Fork, ChinaTalk, No Priors, BG2 Pod, a16z, Dwarkesh
        </div>

      </div>
    </div>
  );
}
