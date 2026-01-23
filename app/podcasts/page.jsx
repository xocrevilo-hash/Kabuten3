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
      episode: "(0:00) Jason and Sacks welcome Sarah B. Rogers! (2:22) Free speech, EU censorship, OSA/DSA overreach? (13:44) Censorship on mass migration policies, m...",
      episodeNum: 0,
      date: "January 22, 2026",
      url: "https://app.podscribe.com/episode/148622308?transcriptVersionReqId=695fabbe-136c-49b9-89ef-13472edef476",
      ideas: [
        {
          summary: "Public Market Multiples Challenge Venture Capital Model",
          detail: "Public markets are creating a sifting mechanism where low-growth companies receive drastically lower multiples while high-growth companies like Palantir (at 70x forward sales) command premium valuations. This dynamic reinforces that venture success depends on being in rapidly growing sectors rather than broadly diversified portfolios.",
          timestamp: "04:46"
        },
        {
          summary: "AI Enterprise Implementation Gap Despite Model Quality",
          detail: "While AI models are incredibly powerful, enterprise adoption faces significant challenges due to fragmented data, legacy systems, and manual workarounds - described as 'a Ferrari engine in a shopping cart.' Companies like Invisible are addressing this by training top AI models and adapting them to messy business realities.",
          timestamp: "03:10"
        },
        {
          summary: "AI Success Stories Emerging in Sports Analytics",
          detail: "Real-world AI implementation is showing tangible results, with examples like the Charlotte Hornets using AI to process years of game tape and analog scouting data to improve draft decisions in weeks rather than seasons. This demonstrates AI's potential when properly integrated with cleaned enterprise data.",
          timestamp: "03:10"
        },
        {
          summary: "High-Growth Tech Companies Still Command Premium Valuations",
          detail: "Despite overall market pressures on slower-growing tech stocks like Figma and DataDog, companies demonstrating exceptional growth rates continue to receive massive valuations from both public and private markets. This creates opportunities for venture investors who can identify and invest in these high-velocity companies early.",
          timestamp: "05:50"
        }
      ]
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
      episode: "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch",
      episodeNum: 0,
      date: "Jan 22, 2026",
      url: "https://app.podscribe.com/episode/148622308?transcriptVersionReqId=695fabbe-136c-49b9-89ef-13472edef476",
      ideas: [
        {
          summary: "AI Implementation Gap in Enterprise",
          detail: "Despite AI models being \"insanely good,\" implementation remains the biggest challenge for enterprises. Companies struggle with legacy tech and manual workarounds, described as \"a Ferrari engine in a shopping cart,\" requiring proper data organization before AI can deliver P&L impact.",
          timestamp: "03:10"
        },
        {
          summary: "Public Market Bifurcation Favors Venture",
          detail: "Markets are heavily polarizing between low-growth companies getting discarded at low valuations and high-growth trendy companies receiving absurdly high multiples like Palantir at 70x forward sales. This trend-driven dynamic actually benefits venture capital as a \"trend business.\"",
          timestamp: "05:29"
        },
        {
          summary: "Growth Multiple Compression Risk Warning",
          detail: "When paying premium valuations for high-growth companies, even slight growth deceleration can trigger severe multiple compression and prolonged underperformance. This creates significant risk for investors anchored to peak valuations during liquidity-rich periods.",
          timestamp: "07:00"
        },
        {
          summary: "Venture's Historical Winners-Take-All Thesis",
          detail: "Despite individual company failures in tech waves, the venture model works because massive winners like Microsoft justify the entire ecosystem at $4 trillion valuations. The key is identifying big trends early and accepting that most individual bets will fail while the winner compensates massively.",
          timestamp: "08:23"
        }
      ]
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
      url: "https://app.podscribe.com/episode/148429306?transcriptVersionReqId=9aeea88b-c216-44be-b3eb-f2f64a4574f5",
      ideas: [
        {
          summary: "Meta's Internal Research Reveals Platform Harm",
          detail: "Whistleblower documents and Meta's own internal studies provide compelling evidence that social media platforms are causing measurable harm to users, particularly teens. This creates significant regulatory and legal risks for major tech companies as lawsuits mount and governments consider stricter oversight.",
          timestamp: "07:11"
        },
        {
          summary: "European Regulatory Action Accelerating Under Macron",
          detail: "French President Macron committed to pushing EU-wide social media regulations after reviewing evidence of platform harm, with France prepared to act unilaterally if needed. This signals a more aggressive regulatory environment that could impact tech company operations and valuations globally.",
          timestamp: "16:18"
        },
        {
          summary: "Grok Restricts AI Image Generation Features",
          detail: "X's Grok AI has rolled back image generation capabilities for free users, requiring paid subscriptions for access to these features. This reflects the broader trend of AI companies monetizing advanced capabilities while managing safety and liability concerns around AI-generated content.",
          timestamp: "02:58"
        },
        {
          summary: "Claude Code Experiments Show Advanced Capabilities",
          detail: "User experiments with Claude's coding abilities have produced impressive results that exceeded expectations, suggesting rapid advancement in AI programming assistance. This indicates growing enterprise adoption potential and competitive pressure on other AI coding tools like GitHub Copilot.",
          timestamp: "01:59"
        }
      ]
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
      episode: "Inferact: Building the Infrastructure That Runs Modern AI",
      episodeNum: 0,
      date: "January 22, 2026",
      url: "https://app.podscribe.com/episode/148429306?transcriptVersionReqId=9aeea88b-c216-44be-b3eb-f2f64a4574f5",
      ideas: [
        {
          summary: "Social Media as Harmful Consumer Product",
          detail: "Jonathan Haidt argues that social media should be regulated like other consumer products that cause harm, comparing it to unsafe toys or food ingredients. He claims 99.9% confidence that social media is harming millions of kids, even if causality for the 2012 mental health increase can't be definitively proven.",
          timestamp: "12:04"
        },
        {
          summary: "Global Policy Push for Phone-Free Schools",
          detail: "Haidt is dedicating his remaining productive years to advocating for phone-free schools and raising minimum age requirements globally. His direct meeting with President Macron resulted in France pushing EU-wide social media restrictions, demonstrating how tech policy is becoming a top-level government priority.",
          timestamp: "16:18"
        },
        {
          summary: "Legal Liability Model for Tech Companies",
          detail: "Plaintiff lawyers are increasingly targeting social media companies with liability lawsuits similar to other harmful consumer products. This represents a significant shift toward holding tech platforms legally accountable for user harm, potentially creating new investment risks for social media companies.",
          timestamp: "17:38"
        },
        {
          summary: "Consumer Demand for Digital Wellness Solutions",
          detail: "Users are actively seeking to change their relationship with phones and implementing various behavioral modification techniques. This indicates a growing market opportunity for products and services that help manage digital consumption and screen time.",
          timestamp: "N/A"
        }
      ]
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
      date: "January 22, 2026",
      url: "https://app.podscribe.com/episode/148429306?transcriptVersionReqId=9aeea88b-c216-44be-b3eb-f2f64a4574f5",
      ideas: [
        {
          summary: "Grok AI Restricts Free Tier Image Generation",
          detail: "Grok has rolled back its image generation feature for free users, now requiring paid subscriptions to access AI image creation capabilities. This represents a broader trend of AI companies monetizing premium features as they seek to recoup massive infrastructure investments and differentiate paid tiers.",
          timestamp: "02:58"
        },
        {
          summary: "Electric AI-Powered Transportation Device Launch",
          detail: "A new electric AI-powered 'Brain on Wheels' tricycle has been announced, representing the integration of AI capabilities into personal mobility devices. This suggests AI is expanding beyond software into physical products, potentially creating new investment opportunities in AI-hardware convergence.",
          timestamp: "00:51"
        },
        {
          summary: "Tech Workers Seeking Phone Relationship Changes",
          detail: "Even technology workers building smartphone applications are implementing sophisticated systems to limit their own phone usage, including leaving devices in other rooms before bed. This internal recognition of addictive design among creators suggests potential regulatory and investment risks for social media and mobile engagement companies.",
          timestamp: "Not specified"
        },
        {
          summary: "Australia's Bold Age Verification Technology Requirement",
          detail: "Australia is implementing requirements for companies to verify users are 16+ before allowing account creation and data collection. This regulatory approach puts compliance burden on tech companies and could drive investment in age verification technologies and identity management solutions.",
          timestamp: "Not specified"
        }
      ]
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
      episode: "Episode Date: December 30, 2025",
      episodeNum: 0,
      date: "December 30, 2025",
      url: "https://app.podscribe.com/episode/148622308?transcriptVersionReqId=695fabbe-136c-49b9-89ef-13472edef476",
      ideas: [
        {
          summary: "AI Implementation Gap in Enterprise",
          detail: "Despite AI models being \"insanely good,\" big companies struggle with real AI success stories due to implementation challenges. The core issue is legacy tech and manual workarounds creating a \"Ferrari engine in a shopping cart\" scenario, where powerful AI capabilities can't integrate effectively with existing systems.",
          timestamp: "03:10"
        },
        {
          summary: "Venture Capital Model Under Pressure",
          detail: "Public market multiples compression is questioning venture capital's ability to generate returns, with companies like Figma trading down to pre-IPO levels and DataDog down 20%. The model depends on being in \"hot stuff\" trends, as trailing sectors become unviable for venture-scale returns.",
          timestamp: "04:06"
        },
        {
          summary: "AI Integration Critical for Legacy Companies",
          detail: "Existing companies without AI integration face existential threats and must \"figure out AI tailwinds right now.\" Companies that successfully attach to AI trends can transform from decade-long 10-20% growth to potentially doubling revenue in a single year after adding AI capabilities.",
          timestamp: "12:51"
        },
        {
          summary: "AgTech Commerce with AI Agents",
          detail: "Checkout.com is pioneering AgTech Commerce where AI agents make purchases on behalf of customers in real-time, partnering with major players like Visa, MasterCard, Google, Microsoft, and OpenAI. This represents a significant shift toward autonomous AI-driven commerce infrastructure with $300 billion in e-commerce volume.",
          timestamp: "02:08"
        }
      ]
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
          <span className="text-gray-400 text-xs">Updated daily at 05:00 HKT • Last: Jan 23, 2026 13:21 JST</span>
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
