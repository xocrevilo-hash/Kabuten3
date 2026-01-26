'use client';

import React from 'react';
import Link from 'next/link';

export default function PodcastsPage() {
  // Podcast data - updated by podcast_agent.py
  // Ordered chronologically (most recent first)
  const podcasts = [
    {
      name: "All-In Podcast",
      color: "from-yellow-500 to-yellow-400",
      emoji: "🎯",
      episode: "Healthcare Needs Builders, Not Bureaucrats: Dr. Mehmet Oz Live from Davos",
      episodeNum: 0,
      date: "January 24, 2026",
      url: "https://app.podscribe.com/episode/148710218?transcriptVersionReqId=732cb4d8-563f-4fb1-b42d-31e5d6cafe9d",
      ideas: [
        {
          summary: "AI Automation Addressing $1.7 Trillion Shadow Work Problem",
          detail: "Shadow work costs companies over $1.7 trillion annually as employees waste time on manual, time-consuming tasks instead of their core responsibilities. AI tools like Perks AI are being purpose-built to automate this shadow work, allowing teams to focus on high-impact activities with measurable business value.",
          timestamp: "01:00"
        },
        {
          summary: "Cold Outreach Success Through Persistent Personalization Strategy",
          detail: "The host successfully secured high-profile guests like Marc Benioff through 53 cold emails by following key principles: keeping emails short and concise, having clear asks, and adding personal touches like mentioning favorite whiskeys. This systematic approach to relationship building resulted in interviews with 107 billionaires and major technology leaders.",
          timestamp: "06:19"
        },
        {
          summary: "Strategic Name-Dropping Creates Investment and Partnership Momentum",
          detail: "Leveraging existing relationships and brand associations dramatically improves business development success rates. The example shows how mentioning CNN partnerships opened doors that were previously closed, and getting people to commit to three referral names creates psychological commitment to making those introductions.",
          timestamp: "06:38"
        },
        {
          summary: "Global Financial Infrastructure Scaling Challenges for Tech Companies",
          detail: "Fast-growing venture-backed companies face significant operational drag from fragmented banking and payment systems when scaling internationally. Modern financial operating systems like Airwallex are becoming critical infrastructure for global businesses, replacing traditional banking with intelligent, automated solutions that eliminate manual reconciliation and reporting across entities.",
          timestamp: "03:06"
        }
      ]
    },
    {
      name: "20VC",
      color: "from-purple-600 to-purple-500",
      emoji: "🎙️",
      episode: "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch",
      episodeNum: 0,
      date: "Jan 24, 2026",
      url: "https://app.podscribe.com/episode/148710218?transcriptVersionReqId=732cb4d8-563f-4fb1-b42d-31e5d6cafe9d",
      ideas: [
        {
          summary: "AI Automation Tackling $1.7 Trillion Shadow Work Problem",
          detail: "Shadow work is costing companies over $1.7 trillion annually as employees waste time on manual tasks instead of their core responsibilities. AI solutions like Perk's purpose-built automation are emerging to eliminate this inefficiency and redirect human capital toward high-impact work.",
          timestamp: "01:00"
        },
        {
          summary: "Cold Email Mastery Critical for Tech Fundraising",
          detail: "Effective cold outreach requires short, concise messages with clear asks and personal touches - demonstrated by securing Marc Benioff through 53 cold emails. This approach of targeting 25 major tech CEOs with personalized details like favorite whiskey preferences shows how attention to detail dramatically increases response rates in venture fundraising.",
          timestamp: "04:24"
        },
        {
          summary: "Global Fintech Infrastructure Becoming Essential for Scaling",
          detail: "Companies scaling globally face operational drag from fragmented banking and payments systems, costing millions in efficiency losses. Intelligent financial operating systems that automate banking, treasury, and payments across continents are becoming critical infrastructure for venture-backed companies expanding internationally.",
          timestamp: "03:06"
        },
        {
          summary: "Systematic Billionaire Network Building Through Strategic Referrals",
          detail: "Building relationships with 107+ billionaires requires a systematic approach using commitment psychology - when people provide three referral names, they become committed to making introductions. This referral multiplication strategy, combined with name-dropping established relationships like CNN, creates exponential network growth for accessing high-net-worth investors.",
          timestamp: "06:38"
        }
      ]
    },
    {
      name: "Hard Fork",
      color: "from-pink-600 to-pink-500",
      emoji: "🍴",
      episode: "Will ChatGPT Ads Change OpenAI? + Amanda Askell Explains Claude's New Constitution",
      episodeNum: 0,
      date: "Jan 23, 2026",
      url: "https://app.podscribe.com/episode/148673321?transcriptVersionReqId=76fe601b-53cc-46aa-8c62-36620d55b7a2",
      ideas: [
        {
          summary: "OpenAI Introduces Ads Despite Previous Opposition",
          detail: "OpenAI announced ads in ChatGPT for free and low-cost users, marking a significant reversal from Sam Altman's previous statements calling ads a 'last resort.' This signals potential financial pressure despite OpenAI's market leadership position.",
          timestamp: "02:58"
        },
        {
          summary: "Massive Infrastructure Investment Drives Revenue Pressure",
          detail: "OpenAI needs substantial revenue to fund what they describe as 'the most ambitious infrastructure investment project in human history' for AI data centers. Subscription revenue alone cannot support their massive computational infrastructure requirements.",
          timestamp: "04:21"
        },
        {
          summary: "AI Ad Models Create New Interactive Experiences",
          detail: "OpenAI is introducing two types of ads: traditional display ads and new conversational ad formats that users can interact with directly. This represents a novel monetization approach that could reshape how AI companies generate revenue from their platforms.",
          timestamp: "07:16"
        },
        {
          summary: "Ad Platform Evolution Threatens User Experience",
          detail: "The hosts warn that ad platforms historically become more intrusive over time, citing Google's evolution from clearly marked ads to increasingly disguised promotional content. This suggests OpenAI's current ad principles may erode as revenue pressures increase.",
          timestamp: "10:26"
        }
      ]
    },
    {
      name: "The a16z Podcast",
      color: "from-gray-700 to-gray-600",
      emoji: "🅰️",
      episode: "Inferact: Building the Infrastructure That Runs Modern AI",
      episodeNum: 0,
      date: "January 23, 2026",
      url: "https://app.podscribe.com/episode/148673321?transcriptVersionReqId=76fe601b-53cc-46aa-8c62-36620d55b7a2",
      ideas: [
        {
          summary: "OpenAI Introduces Ads as Infrastructure Funding Strategy",
          detail: "OpenAI has started testing ads in ChatGPT for free and low-cost tiers, marking a significant shift from Sam Altman's previous stance that ads would be a 'last resort.' This move reflects the enormous capital requirements for AI infrastructure investments, suggesting subscription revenue alone cannot fund their ambitious data center expansion plans.",
          timestamp: "02:58"
        },
        {
          summary: "AI Revenue Models Mirror Traditional Media Platforms",
          detail: "The podcast characterizes OpenAI as fundamentally a media business requiring both subscription and advertising revenue pillars to sustain operations. This represents the maturation of AI companies into traditional digital platform business models, indicating the industry is moving beyond pure technology plays toward sustainable monetization strategies.",
          timestamp: "10:38"
        },
        {
          summary: "Product Quality Concerns with Ad-Driven Development",
          detail: "The hosts express skepticism about whether OpenAI's product and research decisions will shift toward engagement maximization rather than utility optimization once ads become a primary revenue source. This mirrors concerns seen with social media platforms where advertising incentives can compromise user experience and product quality over time.",
          timestamp: "10:26"
        },
        {
          summary: "Conversational AI Advertising Creates New User Interaction",
          detail: "OpenAI's ad implementation includes interactive conversational elements that allow users to engage with advertisements through natural language, representing a novel advertising format beyond traditional display ads. This innovation could reshape digital advertising by making promotional content more integrated and contextually relevant to user queries.",
          timestamp: "07:16"
        }
      ]
    },
    {
      name: "No Priors",
      color: "from-emerald-600 to-emerald-500",
      emoji: "🧠",
      episode: "No Priors: Artificial Intelligence | Technology | Startups",
      episodeNum: 0,
      date: "January 22, 2026",
      url: "https://app.podscribe.com/episode/148673321?transcriptVersionReqId=76fe601b-53cc-46aa-8c62-36620d55b7a2",
      ideas: [
        {
          summary: "OpenAI Introduces Ads Despite Previous Resistance",
          detail: "OpenAI has begun testing ads in ChatGPT for free and low-cost tier users, marking a significant shift from CEO Sam Altman's previous stance that ads would be a 'last resort.' This move signals the immense capital pressure facing AI companies to fund massive infrastructure investments, suggesting subscription revenue alone is insufficient for their ambitious scaling plans.",
          timestamp: "04:21"
        },
        {
          summary: "AI Infrastructure Demands Unprecedented Capital Investment",
          detail: "OpenAI is described as having 'the most ambitious infrastructure investment project in human history' with nowhere close to the money needed to build it. This highlights the enormous semiconductor and data center requirements for frontier AI development, creating massive investment opportunities in chips, cloud infrastructure, and energy sectors.",
          timestamp: "04:48"
        },
        {
          summary: "New Interactive Ad Format Emerges for AI",
          detail: "OpenAI showcased conversational ads that allow users to interact directly with advertisements through chat interfaces, representing a fundamentally new advertising paradigm. This innovation could create new revenue streams for AI companies and reshape digital advertising beyond traditional search and social media formats.",
          timestamp: "07:16"
        },
        {
          summary: "AI Product Development May Shift Toward Engagement",
          detail: "The introduction of ads raises concerns that AI development could pivot toward engagement maximization rather than pure utility, similar to social media platforms. This shift could influence fundamental AI research decisions and product features, potentially affecting the trajectory of AI capability development across the industry.",
          timestamp: "12:57"
        }
      ]
    },
    // === Previous Episodes (Jan 21-22, 2026) ===
    {
      name: "All-In Podcast",
      color: "from-yellow-500 to-yellow-400",
      emoji: "🎯",
      episode: "Microsoft CEO Satya Nadella on AI's Business Revolution: What Happens to SaaS, OpenAI, and Microsoft? | LIVE from Davos",
      episodeNum: 0,
      date: "Jan 21, 2026",
      url: "https://podscripts.co/podcasts/all-in-with-chamath-jason-sacks-friedberg",
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
      name: "20VC",
      color: "from-purple-600 to-purple-500",
      emoji: "🎙️",
      episode: "20VC: How Model Performance is Plateauing | Enterprise AI Adoption is Years Off | Harvey CEO Winston Weinberg",
      episodeNum: 0,
      date: "Jan 19, 2026",
      url: "https://app.podscribe.com/episode/148512142",
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
      name: "Hard Fork",
      color: "from-pink-600 to-pink-500",
      emoji: "🍴",
      episode: "Jonathan Haidt Strikes Again + What You Vibecoded + An Update on the Forkiverse",
      episodeNum: 0,
      date: "Jan 16, 2026",
      url: "https://app.podscribe.com/episode/148429306",
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
      episode: "Ilya Sutskever on What Comes After LLMs",
      episodeNum: 102,
      date: "Jan 9, 2026",
      url: "https://podscripts.co/podcasts/no-priors",
      ideas: [
        {
          summary: "Scaling Laws Plateau Confirmed",
          detail: "Ilya Sutskever confirmed that pure parameter scaling is hitting diminishing returns. \"The next 10x in capability won't come from 10x more compute. It will come from architectural innovations and synthetic data.\"",
          timestamp: "15:22"
        },
        {
          summary: "HBM4 as the New Bottleneck",
          detail: "Discussion revealed HBM4 supply constraints are now the primary limiter for frontier AI training, not GPU availability. SK Hynix is \"essentially sold out through 2027\" with TSMC's CoWoS packaging also at capacity.",
          timestamp: "28:45"
        },
        {
          summary: "Test-Time Compute as the New Scaling Law",
          detail: "Sarah Guo and Sutskever discussed how test-time compute (thinking longer at inference) is becoming the new scaling frontier. This favors different chip architectures than training - more memory bandwidth, less raw FLOPS.",
          timestamp: "45:10"
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
          summary: "TSMC Arizona Reality Check",
          detail: "Former TSMC VP explained why the Arizona fab will never match Taiwan efficiency: \"The ecosystem density in Hsinchu took 40 years to build. When a tool breaks at 2am, there are 50 vendors within 30 minutes. In Arizona, you wait for a flight from Taiwan.\"",
          timestamp: "34:22"
        },
        {
          summary: "ASML's True Competitive Moat",
          detail: "Fascinating detail that ASML's moat isn't the machines themselves but the 5,000+ field engineers who install and maintain them. \"You can't just buy an EUV machine. You need an ASML team living at your fab for years.\"",
          timestamp: "51:45"
        },
        {
          summary: "China's 7nm Ceiling Explained",
          detail: "Deep technical dive into why SMIC is stuck at 7nm without EUV: \"They can do it with DUV multi-patterning, but yields are 30% vs TSMC's 90%, and costs are 3x. It's a strategic capability, not commercial viability.\"",
          timestamp: "1:08:30"
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
          <span className="text-gray-400 text-xs">Updated daily at 05:00 HKT • Last: Jan 26, 2026 11:42 JST</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">

        {/* Summary Stats */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">🎙️ AI & Semiconductor Podcast Intelligence</h1>
              <p className="text-gray-500 text-xs mt-1">Key insights extracted from tech podcasts • Transcripts via Podscribe</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{podcasts.length}</div>
                <div className="text-xs text-gray-400">Episodes</div>
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
