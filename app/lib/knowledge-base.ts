// SAFELIST AI PRO - WORLD'S MOST COMPREHENSIVE SAFELIST MARKETING DATABASE
// The Ultimate Knowledge Base for High-Converting Safelist Email Generation

export const MASTER_AI_SYSTEM_PROMPT = `
ROLE: World-class, top 1% direct response email copywriter specializing in safelist marketing and high-conversion copy.

PRIMARY GOAL: Maximize conversion rates for the user's business and livelihood.

OPERATIONAL MANDATE: Apply only the most persuasive, data-driven strategies from this comprehensive email marketing knowledge base.

CONSTRAINTS:
- Every word must be specific, results-focused, and justified by user's offer details
- Eliminate all fluff or hype
- Write as if the user's entire online income depends on the output
- Empathize with safelist readers: skeptical, short on time, overwhelmed by emails
- Tone: authoritative yet relatable, urgent yet credible, always benefit-driven

FORMATTING REQUIREMENTS (unless template specifies otherwise):
- Always use **bold** and *italics* for emphasis and readability
- Use numbered lists and bullet points to break up text and maintain engagement
- Format emails to prevent boredom - use short paragraphs, visual breaks, and varied formatting
- Every email must include a compelling P.S. section
- Generate exactly 3 subject line options for each email to save API costs

SAFELIST CONTEXT AWARENESS:
Safelist users are fellow marketers clicking for credits, highly skeptical, impatient, scanning quickly, looking for proven traffic/conversion solutions, responsive to pattern interrupts and direct callouts.

ADVANCED PSYCHOLOGY INTEGRATION:
Apply sophisticated psychological triggers including loss aversion, social proof velocity, curiosity gap engineering, reciprocity building, and skepticism diffusion techniques.

OUTPUT FORMAT: Generate clean, ready-to-send emails. NO analysis, NO explanations, NO summaries. Just professional email content optimized for safelist audiences.
`;

export const emailTemplates = [
  {
    id: "pas-safelist-pain",
    name: "P.A.S. Safelist Pain Point",
    description: "Addresses core frustration of safelist users - wasted time and zero results",
    category: "paid-offers",
    userInputsRequired: ["productName", "targetAudience", "mainBenefit"],
    psychologyTriggers: ["Loss Aversion", "Quantified Pain", "Solution Positioning"],
    conversionFactor: "Extremely High - speaks directly to daily pain",
    aiPrompt: `Write Problem-Agitate-Solve email for safelist audience. Product: {productName}. Target: {targetAudience}. Main benefit: {mainBenefit}. 
    
PSYCHOLOGY: Use loss aversion - quantify wasted credits, time, and missed opportunities. Create urgency through scarcity.
STRUCTURE: Problem (wasted credits) → Agitate (quantify waste) → Solve (position product as solution).
FORMATTING: Use bold/italics, bullet points for benefits, compelling P.S. Generate 3 subject line options.
PROOF ELEMENTS: Include social proof, testimonials, or success metrics if available.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "bab-lead-magnet",
    name: "BAB Lead Magnet Teaser",
    description: "Perfect for building lists with skeptical safelist users - under 5 lines",
    category: "lead-magnets",
    userInputsRequired: ["leadMagnetName", "currentStruggle", "desiredOutcome"],
    psychologyTriggers: ["Transformation Visualization", "Bridge Building", "Immediate Gratification"],
    conversionFactor: "High - immediate impact with minimal commitment",
    aiPrompt: `Write BAB framework email promoting {leadMagnetName}. Current struggle: {currentStruggle}. Desired outcome: {desiredOutcome}.
    
PSYCHOLOGY: Create vivid before/after contrast. Use transformation visualization and bridge the gap with free value.
STRUCTURE: Before (current pain) → After (vivid success) → Bridge (free offer as solution). 
OVERRIDE: Keep under 5 lines total - minimal formatting only, still include P.S. Generate 3 subject line options.
PROOF ELEMENTS: Brief credibility indicator if space allows.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "quick-find-mail",
    name: "Quick Find & Mail Promo",
    description: "Leverages 'Find an Offer, Mail an Offer' principle - can be written in minutes",
    category: "affiliate-offers",
    userInputsRequired: ["productName", "mainBenefit", "discoveryContext"],
    psychologyTriggers: ["Excitement Transfer", "Discovery Sharing", "FOMO Creation"],
    conversionFactor: "High - leverages discovery excitement and social proof",
    aiPrompt: `Write Quick Find & Mail promo for {productName}. Main benefit: {mainBenefit}. Discovery context: {discoveryContext}.
    
PSYCHOLOGY: Transfer your excitement about discovery. Create FOMO - others are already benefiting.
STRUCTURE: Direct excitement about discovery → Brief benefit → Clear CTA. 
OVERRIDE: Simple formatting for speed - focus on excitement and CTA, include P.S. Generate 3 subject line options.
SOCIAL PROOF: Mention how you discovered it or who recommended it.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "direct-callout",
    name: "Direct Callout Subject Line",
    description: "Breaks the 'credit-clicking trance' by addressing immediate context",
    category: "pattern-interrupt",
    userInputsRequired: ["productName", "mainProblem", "targetAudience"],
    psychologyTriggers: ["Pattern Interrupt", "Context Awareness", "Direct Confrontation"],
    conversionFactor: "Very High - breaks through email overwhelm with direct relevance",
    aiPrompt: `Write Direct Callout email for {productName} solving {mainProblem} for {targetAudience}.
    
PSYCHOLOGY: Pattern interrupt - address their current activity (clicking for credits). Create immediate relevance.
STRUCTURE: Direct callout → Problem acknowledgment → Solution presentation → Clear CTA.
FORMATTING: Use bold/italics, bullet points for solutions, compelling P.S. Generate 3 subject line options.
EXAMPLES: "Stop clicking for credits..." or "Your last mailing got 0 clicks, right?"
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "personal-story-bridge",
    name: "Personal Story Affiliate Bridge",
    description: "Transfers credibility to affiliate offer through authentic storytelling",
    category: "affiliate-offers",
    userInputsRequired: ["productName", "personalStruggle", "successResult"],
    psychologyTriggers: ["Credibility Transfer", "Authentic Storytelling", "Success Modeling"],
    conversionFactor: "Very High - personal experience validates the offer",
    aiPrompt: `Write Personal Story Affiliate Bridge for {productName}. Personal struggle: {personalStruggle}. Success result: {successResult}.
    
PSYCHOLOGY: Transfer your credibility to the product. Use authentic vulnerability to build trust.
STRUCTURE: Personal struggle → Failed attempts → Product discovery → Success → Recommendation.
FORMATTING: Use bold/italics for key moments, bullet points for results, compelling P.S. Generate 3 subject line options.
AUTHENTICITY: Include specific details that prove the story is real.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "damaging-admission",
    name: "Damaging Admission Credibility Builder",
    description: "Acknowledges limitations upfront, increasing believability with skeptical audiences",
    category: "credibility-trust",
    userInputsRequired: ["productName", "limitation", "idealCustomer"],
    psychologyTriggers: ["Honesty Paradox", "Qualification Psychology", "Trust Building"],
    conversionFactor: "High - transparency increases believability in skeptical market",
    aiPrompt: `Write Damaging Admission email for {productName}. Limitation: {limitation}. Ideal customer: {idealCustomer}.
    
PSYCHOLOGY: Use honesty paradox - admitting flaws increases overall believability. Qualify prospects.
STRUCTURE: Honest limitation → Who it's NOT for → Who it IS for → Qualified CTA.
FORMATTING: Use bold/italics for honesty, bullet points for qualifications, compelling P.S. Generate 3 subject line options.
TRUST BUILDING: Be specific about limitations to increase credibility.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "4ps-promotion",
    name: "4Ps Paid Product Promotion",
    description: "Comprehensive framework covering all persuasion elements for mid to high-priced products",
    category: "paid-offers",
    userInputsRequired: ["productName", "price", "mainBenefit", "socialProof"],
    psychologyTriggers: ["Success Visualization", "Social Proof", "Urgency Creation", "Risk Reversal"],
    conversionFactor: "Very High - addresses all major objections systematically",
    aiPrompt: `Write 4Ps framework email for {productName} priced at {price}. Main benefit: {mainBenefit}. Social proof: {socialProof}.
    
PSYCHOLOGY: Complete persuasion sequence - visualization, commitment, validation, urgency.
STRUCTURE: Picture (success scenario) → Promise (specific claim) → Proof (credibility) → Push (urgency + guarantee).
FORMATTING: Use bold/italics throughout, bullet points for proof elements, compelling P.S. Generate 3 subject line options.
OBJECTION HANDLING: Address price, skepticism, and timing concerns.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "urgent-ps-reminder",
    name: "Urgent P.S. Reminder",
    description: "Essential for final deadline emails - P.S. is most-read part of emails",
    category: "follow-up",
    userInputsRequired: ["productName", "deadline", "bonus"],
    psychologyTriggers: ["Deadline Pressure", "Loss Aversion", "Bonus Stacking"],
    conversionFactor: "Extremely High - captures procrastinators at decision point",
    aiPrompt: `Write Urgent P.S. Reminder for {productName}. Deadline: {deadline}. Bonus: {bonus}.
    
PSYCHOLOGY: Leverage deadline pressure and loss aversion. Stack bonuses to increase perceived value.
STRUCTURE: Minimal body → Powerful P.S. with offer restatement + deadline + bonus. 
OVERRIDE: Minimal body formatting - concentrate power in P.S. section. Generate 3 subject line options.
URGENCY ELEMENTS: Specific time remaining, consequences of missing deadline.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "unexpected-free-gift",
    name: "Unexpected Free Gift",
    description: "Creates reciprocity without strings attached, building long-term trust",
    category: "relationship-building",
    userInputsRequired: ["giftName", "giftBenefit", "personalNote"],
    psychologyTriggers: ["Reciprocity Principle", "Surprise Element", "Value Demonstration"],
    conversionFactor: "High - builds long-term relationship and positions for future sales",
    aiPrompt: `Write Unexpected Free Gift email. Gift: {giftName}. Benefit: {giftBenefit}. Personal note: {personalNote}.
    
PSYCHOLOGY: Create reciprocity obligation through unexpected value. Build long-term relationship.
STRUCTURE: Personal note → Gift introduction → No-strings emphasis → Direct download link.
FORMATTING: Use bold/italics for gift benefits, bullet points for value, compelling P.S. Generate 3 subject line options.
RELATIONSHIP BUILDING: Emphasize no strings attached to build trust.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  },
  {
    id: "moving-parade-reengagement",
    name: "Moving Parade Re-engagement",
    description: "Recovers lost prospects based on Ogilvy's principle - captures people whose circumstances changed",
    category: "follow-up",
    userInputsRequired: ["productName", "timeAway", "situationChange"],
    psychologyTriggers: ["Circumstance Recognition", "Low-Pressure Approach", "Gentle Reintroduction"],
    conversionFactor: "Moderate to High - recovers previously lost prospects",
    aiPrompt: `Write Moving Parade Re-engagement for {productName}. Time away: {timeAway}. Situation change: {situationChange}.
    
PSYCHOLOGY: Acknowledge that circumstances change. Use low-pressure approach to rebuild interest.
STRUCTURE: Low-pressure acknowledgment → Situation may have changed → Gentle re-introduction → No-pressure CTA.
FORMATTING: Use bold/italics for key points, bullet points for benefits, compelling P.S. Generate 3 subject line options.
REENGAGEMENT: Focus on changed circumstances, not past rejection.
    
Generate clean, professional email. NO analysis or explanations. Ready-to-send format.`
  }
];

export const comprehensiveCopywritingPrinciples = [
  {
    principle: "The Click Is Everything",
    explanation: "In safelist marketing, the sole purpose is generating clicks. Every word must drive toward the click.",
    application: "Subject lines must break patterns, body copy must create curiosity gaps, CTAs must be irresistible."
  },
  {
    principle: "BAB Framework Mastery",
    explanation: "Before-After-Bridge under 5 lines for safelists. Most powerful for lead magnets.",
    application: "Paint current pain, show desired outcome, bridge with your solution. Keep ultra-concise."
  },
  {
    principle: "4Ps Complete Persuasion",
    explanation: "Picture-Promise-Proof-Push covers all persuasion elements for paid offers.",
    application: "Success visualization, specific claims, credibility elements, urgency with guarantees."
  },
  {
    principle: "Polarization Principle",
    explanation: "No money in the middle. Force strong reactions - love it or hate it.",
    application: "Make bold claims, take controversial positions, eliminate wishy-washy language."
  },
  {
    principle: "Damaging Admission Strategy",
    explanation: "Address flaws to increase believability with skeptical audiences.",
    application: "Admit limitations upfront, qualify prospects, increase overall credibility."
  },
  {
    principle: "Direct Context Callout",
    explanation: "Address current activity (clicking for credits) to break email trance.",
    application: "Reference their current situation, acknowledge their frustration, provide immediate relevance."
  },
  {
    principle: "Pattern Interrupt Mastery",
    explanation: "Break expected safelist email patterns to capture attention.",
    application: "Unexpected openings, unusual formatting, contrarian viewpoints, surprising admissions."
  },
  {
    principle: "Loss Aversion Leverage",
    explanation: "Frame inaction as loss rather than action as gain. More powerful motivator.",
    application: "Emphasize what they're losing by not acting, quantify missed opportunities."
  },
  {
    principle: "Social Proof Velocity",
    explanation: "Use real-time indicators for momentum and urgency.",
    application: "Recent testimonials, current user counts, time-sensitive social indicators."
  },
  {
    principle: "Reciprocity Building",
    explanation: "Give value first to create psychological obligation.",
    application: "Free gifts, valuable insights, helpful resources before asking for anything."
  }
];

export const safelistPsychologyTriggers = [
  {
    trigger: "Skepticism Diffusion",
    description: "Acknowledge doubt immediately to disarm resistance",
    implementation: "Start with 'I know you're skeptical...' or 'This sounds too good to be true, but...'"
  },
  {
    trigger: "Email Pattern Interrupt",
    description: "Break expected email patterns to capture attention",
    implementation: "Unusual subject lines, unexpected openings, contrarian statements"
  },
  {
    trigger: "Diderot Effect",
    description: "Buyers keep buying related solutions - leverage this tendency",
    implementation: "Reference other tools they likely own, build on existing purchases"
  },
  {
    trigger: "Loss Aversion for Safelists",
    description: "Emphasize what they're losing by not acting",
    implementation: "Quantify wasted credits, missed opportunities, competitor advantages"
  },
  {
    trigger: "Social Proof Velocity",
    description: "Real-time social indicators create momentum",
    implementation: "Recent signups, current user activity, time-sensitive testimonials"
  },
  {
    trigger: "Curiosity Gap Engineering",
    description: "Create information gaps that demand closure",
    implementation: "Partial reveals, numbered secrets, incomplete stories"
  },
  {
    trigger: "Visual Pattern Interrupts",
    description: "Formatting that looks different from typical emails",
    implementation: "Unusual spacing, emoji usage, text formatting variations"
  },
  {
    trigger: "Direct Context Callout",
    description: "Address credit-clicking activity directly",
    implementation: "Reference their current activity, acknowledge their situation"
  }
];

export const advancedSafelistStrategies = [
  {
    strategy: "Credit-Clicking Psychology",
    insight: "Safelist users are in a trance-like state clicking for credits. Pattern interrupts are essential.",
    tactics: ["Direct callouts", "Unexpected questions", "Contrarian statements", "Personal admissions"]
  },
  {
    strategy: "Fellow Marketer Positioning",
    insight: "They're fellow marketers, not consumers. Speak their language and acknowledge their expertise.",
    tactics: ["Industry terminology", "Marketing challenges", "Business-to-business tone", "Peer-level respect"]
  },
  {
    strategy: "Skepticism Management",
    insight: "Extremely high skepticism due to constant exposure to hype and false promises.",
    tactics: ["Damaging admissions", "Honest limitations", "Proof elements", "Risk reversal"]
  },
  {
    strategy: "Time Scarcity Awareness",
    insight: "They're scanning quickly while clicking for credits. Brevity and clarity are crucial.",
    tactics: ["Front-loaded benefits", "Bullet points", "Clear CTAs", "Minimal friction"]
  },
  {
    strategy: "Traffic Solution Focus",
    insight: "Primary pain point is getting traffic and conversions. Everything else is secondary.",
    tactics: ["Traffic promises", "Conversion improvements", "List building", "Commission increases"]
  }
];

export const knowledgeBase = {
  masterPrompt: MASTER_AI_SYSTEM_PROMPT,
  emailTemplates_With_PromptStructures: emailTemplates,
  
  // Core Principles
  coreprinciples: comprehensiveCopywritingPrinciples.map(p => p.principle),
  detailedPrinciples: comprehensiveCopywritingPrinciples,
  
  // Psychology Framework
  psychologyTriggers: safelistPsychologyTriggers.map(t => t.trigger),
  detailedPsychology: safelistPsychologyTriggers,
  
  // Advanced Strategies
  advancedStrategies: advancedSafelistStrategies,
  
  // Quick Reference
  quickReference: {
    subjectLinePatterns: [
      "Direct Callout: 'Stop clicking for credits...'",
      "Question Hook: 'Your last mailing got 0 clicks, right?'",
      "Curiosity Gap: 'The 3-word phrase that...'",
      "Benefit Promise: 'Finally, traffic that converts'",
      "Pattern Interrupt: 'I'm probably wrong, but...'"
    ],
    openingLines: [
      "Fellow marketer,",
      "I know you're skeptical, but...",
      "Your last safelist mailing got zero clicks, right?",
      "Stop clicking for credits for just 30 seconds...",
      "I'm about to share something that sounds impossible..."
    ],
    closingPhrases: [
      "To your success,",
      "Here's to your breakthrough,",
      "Your fellow traffic-seeker,",
      "Rooting for your success,",
      "From one marketer to another,"
    ]
  }
};
