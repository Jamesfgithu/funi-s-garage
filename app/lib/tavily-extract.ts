// Tavily Extract API integration for real webpage content analysis

export interface TavilyExtractResponse {
  url: string;
  content: string;
  title?: string;
  description?: string;
  author?: string;
  published_date?: string;
  images?: string[];
  links?: string[];
}

export interface AnalyzedWebContent {
  type: 'sales_page' | 'blog_post' | 'video_content' | 'general_content';
  title: string;
  headline: string;
  valueProposition: string;
  keyBenefits: string[];
  features: string[];
  offer?: string;
  pricing?: string;
  urgency?: string;
  targetAudience?: string;
  callToAction: string;
  testimonials?: string[];
  guarantees?: string[];
  mainPoints?: string[];
  keyTakeaways?: string[];
}

const TAVILY_API_KEY = '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';
const TAVILY_EXTRACT_URL = 'https://api.tavily.com/extract';

export async function extractWebpageContent(url: string): Promise<TavilyExtractResponse> {
  console.log('�� Extracting content from URL:', url);
  
  try {
    const response = await fetch(TAVILY_EXTRACT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        urls: [url]
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Content extracted successfully');
    
    // Tavily returns an array of results, we want the first one
    const result = data.results?.[0] || data;
    
    return {
      url: result.url || url,
      content: result.content || result.raw_content || '',
      title: result.title || '',
      description: result.description || '',
      author: result.author || '',
      published_date: result.published_date || '',
      images: result.images || [],
      links: result.links || []
    };
    
  } catch (error) {
    console.error('❌ Tavily extraction failed:', error);
    throw new Error(`Failed to extract content from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeWebContent(extractedContent: TavilyExtractResponse): Promise<AnalyzedWebContent> {
  console.log('🧠 Analyzing webpage content with AI...');
  
  try {
    // Enhanced content analysis with better text cleaning
    const analyzed = await intelligentContentAnalysis(extractedContent);
    
    console.log('✅ Content analysis completed');
    return analyzed;
    
  } catch (error) {
    console.error('❌ Content analysis failed:', error);
    throw new Error(`Failed to analyze webpage content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced intelligent content analysis with better text cleaning
async function intelligentContentAnalysis(content: TavilyExtractResponse): Promise<AnalyzedWebContent> {
  const text = content.content.toLowerCase();
  const title = content.title || '';
  const description = content.description || '';
  
  // Clean and normalize the content text
  const cleanContent = cleanExtractedText(content.content);
  
  // Determine content type based on actual content
  let type: AnalyzedWebContent['type'] = 'general_content';
  
  if (text.includes('buy now') || text.includes('order') || text.includes('price') || text.includes('$') || text.includes('discount')) {
    type = 'sales_page';
  } else if (text.includes('watch') || text.includes('video') || text.includes('youtube') || text.includes('training')) {
    type = 'video_content';
  } else if (text.includes('article') || text.includes('blog') || text.includes('read more') || text.includes('published')) {
    type = 'blog_post';
  }
  
  // Extract product name from title or content
  const productName = extractProductName(title, cleanContent);
  
  // Extract benefits and features with better parsing
  const benefits = extractBenefits(cleanContent);
  const features = extractFeatures(cleanContent);
  
  // Extract pricing information with better parsing
  const pricing = extractPricing(cleanContent);
  
  // Extract offers and urgency
  const offer = extractOffer(cleanContent, pricing);
  const urgency = extractUrgency(cleanContent);
  
  // Extract guarantees
  const guarantees = extractGuarantees(cleanContent);
  
  // Extract call-to-action with better parsing
  const callToAction = extractCallToAction(cleanContent);
  
  // Create value proposition
  const valueProposition = createValueProposition(productName, benefits, offer);
  
  return {
    type,
    title: productName,
    headline: title || productName,
    valueProposition,
    keyBenefits: benefits,
    features: features,
    offer,
    pricing,
    urgency,
    targetAudience: 'people looking to improve their results',
    callToAction,
    testimonials: [], // Could be enhanced to extract actual testimonials
    guarantees,
    mainPoints: type === 'blog_post' ? benefits.slice(0, 3) : undefined,
    keyTakeaways: type === 'blog_post' ? features.slice(0, 3) : undefined
  };
}

// Clean extracted text to remove broken sentences and formatting
function cleanExtractedText(rawText: string): string {
  return rawText
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Fix broken markdown
    .replace(/\*\*([^*]*)\*\*\*\*([^*]*)\*\*/g, '**$1 $2**')
    .replace(/\*\*\*\*([^*]*)\*\*/g, '**$1**')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove incomplete sentences (ending with commas or incomplete words)
    .replace(/[^.!?]*,\s*$/gm, '')
    // Clean up punctuation
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

// Extract product name from title and content
function extractProductName(title: string, content: string): string {
  // Try to extract from title first
  if (title) {
    // Remove common words and get the main product name
    const cleanTitle = title
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/gi, '')
      .replace(/\b(system|course|training|program|guide|method)\b/gi, '')
      .trim();
    
    if (cleanTitle.length > 3) {
      return cleanTitle;
    }
  }
  
  // Try to extract from content
  const productMatches = content.match(/(?:introducing|presenting|get|buy|order)\s+([A-Z][^.!?]*?)(?:\s+(?:system|course|training|program|guide|method))?/i);
  if (productMatches && productMatches[1]) {
    return productMatches[1].trim();
  }
  
  return 'This Valuable Resource';
}

// Extract benefits with better parsing
function extractBenefits(content: string): string[] {
  const benefits: string[] = [];
  
  // Look for benefit patterns with complete sentences
  const benefitPatterns = [
    /(?:you'll|you will|you can|you get)\s+([^.!?]{10,80})[.!?]/gi,
    /(?:get|achieve|increase|improve|boost|generate|discover|learn)\s+([^.!?]{10,80})[.!?]/gi,
    /(?:helps? you|allows you to|enables you to)\s+([^.!?]{10,80})[.!?]/gi
  ];
  
  benefitPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.slice(0, 3).forEach(match => {
        const benefit = match
          .replace(/^(?:you'll|you will|you can|you get|get|achieve|increase|improve|boost|generate|discover|learn|helps? you|allows you to|enables you to)\s+/i, '')
          .replace(/[.!?]$/, '')
          .trim();
        
        if (benefit.length > 10 && benefit.length < 80 && !benefits.includes(benefit)) {
          benefits.push(benefit);
        }
      });
    }
  });
  
  // Fallback benefits if none found
  if (benefits.length === 0) {
    benefits.push(
      'Get proven strategies that actually work',
      'Save time and avoid common mistakes',
      'Achieve better results faster than ever'
    );
  }
  
  return benefits.slice(0, 5);
}

// Extract features with better parsing
function extractFeatures(content: string): string[] {
  const features: string[] = [];
  
  // Look for feature patterns in lists and bullet points
  const featurePatterns = [
    /[•✓✅-]\s*([^•✓✅\n]{5,60})(?:\n|$)/g,
    /\d+\.\s+([^.\n]{5,60})(?:\.|$)/g,
    /(?:includes?|contains?|features?)\s*:?\s*([^.!?\n]{10,60})[.!?\n]/gi
  ];
  
  featurePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.slice(0, 5).forEach(match => {
        const feature = match
          .replace(/^[•✓✅-\d+\.\s]+/g, '')
          .replace(/^(?:includes?|contains?|features?)\s*:?\s*/i, '')
          .replace(/[.!?\n]$/, '')
          .trim();
        
        if (feature.length > 5 && feature.length < 60 && !features.includes(feature)) {
          features.push(feature);
        }
      });
    }
  });
  
  // Fallback features if none found
  if (features.length === 0) {
    features.push(
      'Step-by-step instructions',
      'Expert guidance and support',
      'Proven methods and techniques'
    );
  }
  
  return features.slice(0, 5);
}

// Extract pricing with better parsing
function extractPricing(content: string): string | undefined {
  const pricePatterns = [
    /(?:just|only|for)\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:only|today|now)/i,
    /price\s*:?\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = content.match(pattern);
    if (match) {
      return `$${match[1]}`;
    }
  }
  
  return undefined;
}

// Extract offers with better parsing
function extractOffer(content: string, pricing?: string): string | undefined {
  const offerPatterns = [
    /(?:limited time|special)\s+offer[^.!?]*[.!?]/i,
    /(?:save|discount)\s+(?:\$\d+|\d+%)[^.!?]*[.!?]/i,
    /(?:free|bonus)[^.!?]*(?:when you|if you)[^.!?]*[.!?]/i
  ];
  
  for (const pattern of offerPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0].replace(/[.!?]$/, '').trim();
    }
  }
  
  if (pricing) {
    return `Special price: ${pricing}`;
  }
  
  return undefined;
}

// Extract urgency with better parsing
function extractUrgency(content: string): string | undefined {
  const urgencyPatterns = [
    /(?:limited time|act now|hurry|don't wait)[^.!?]*[.!?]/i,
    /(?:only|just)\s+\d+\s+(?:left|remaining|available)[^.!?]*[.!?]/i,
    /(?:expires?|ends?)\s+(?:in\s+)?\d+\s+(?:days?|hours?)[^.!?]*[.!?]/i
  ];
  
  for (const pattern of urgencyPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0].replace(/[.!?]$/, '').trim();
    }
  }
  
  return undefined;
}

// Extract guarantees
function extractGuarantees(content: string): string[] {
  const guarantees: string[] = [];
  const guaranteePatterns = [
    /(?:guarantee|guaranteed)[^.!?]*[.!?]/gi,
    /(?:money back|refund)[^.!?]*[.!?]/gi,
    /(?:\d+\s*day|lifetime)\s+guarantee[^.!?]*[.!?]/gi
  ];
  
  guaranteePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.slice(0, 2).forEach(match => {
        const guarantee = match.replace(/[.!?]$/, '').trim();
        if (guarantee.length > 10 && guarantee.length < 100 && !guarantees.includes(guarantee)) {
          guarantees.push(guarantee);
        }
      });
    }
  });
  
  return guarantees;
}

// Extract call-to-action with better parsing
function extractCallToAction(content: string): string {
  const ctaPatterns = [
    /(?:click|tap|get|buy|order|start|join|sign up|download|access)\s+[^.!?]*(?:now|today|here)[^.!?]*[.!?]/gi,
    /(?:get started|try (?:it )?(?:now|today|free))[^.!?]*[.!?]/gi,
    /order\s+(?:now|today)[^.!?]*[.!?]/gi
  ];
  
  for (const pattern of ctaPatterns) {
    const match = content.match(pattern);
    if (match && match[0].length < 60) {
      return match[0].replace(/[.!?]$/, '').trim();
    }
  }
  
  return 'Get access now';
}

// Create value proposition from extracted data
function createValueProposition(productName: string, benefits: string[], offer?: string): string {
  if (benefits.length > 0) {
    const mainBenefit = benefits[0];
    if (offer) {
      return `${productName} helps you ${mainBenefit} - ${offer}`;
    }
    return `${productName} helps you ${mainBenefit}`;
  }
  
  return `${productName} - Transform your results with proven strategies`;
}
