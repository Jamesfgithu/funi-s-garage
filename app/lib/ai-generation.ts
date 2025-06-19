export interface EmailGenerationInput {
  topic?: string;
  url?: string;
  content?: string;
}

export async function generateEmail(
  input: EmailGenerationInput
): Promise<string> {
  console.log('🚀 Generating new email with input:', input);

  return `<p>Fellow entrepreneur,</p>
  
  <p>Your current approach isn't working, is it?</p>
  
  <p>Here's why: <strong>You're doing what everyone else is doing.</strong></p>
  
  <p>While you're following the same tired strategies, smart entrepreneurs are using <em>proven systems</em> that actually deliver results.</p>
  
  <p><strong>This breakthrough approach shows you exactly how to:</strong></p>
  
  <ul>
    <li><strong>Break through the noise</strong> and get noticed</li>
    <li><strong>Create compelling offers</strong> people actually want</li>
    <li><strong>Build systems that scale</strong> without burning out</li>
    <li><strong>Generate consistent income</strong> from home</li>
  </ul>
  
  <p>Stop blending in with the crowd.</p>
  
  <p><strong><a href="#" style="color: #40E0D0; text-decoration: none;">Stand out and get results</a></strong></p>
  
  <p>To your success,<br>
  [Your Name]</p>
  
  <p style="margin-top: 30px; font-style: italic; border-top: 1px solid #eee; padding-top: 15px;">
  P.S. This proven system has helped thousands achieve breakthrough results. Don't wait - take action now.
  </p>`;
}

export async function improveEmail(
  input: EmailGenerationInput
): Promise<string> {
  console.log('🚀 Improving existing email with input:', input);
  return `Improved version of: ${input.content || ''}`;
}

export async function generateFromUrl(
  input: EmailGenerationInput
): Promise<string> {
  console.log('🌐 Generating email from URL:', input.url);
  return `Generated email from URL: ${input.url}`;
}

// Professional AI generation function that your API route needs
export async function generateEmailWithKnowledgeBase(inputs: {
  product?: string;
  audience?: string;
  url?: string;
  description?: string;
}) {
  console.log('🚀 Professional AI generation with inputs:', inputs);

  // If URL provided, try to scrape content
  if (inputs.url) {
    try {
      // For now, create a simple scraped content object
      // TODO: Replace with actual Tavily API integration
      const scrapedContent = {
        title: inputs.product || 'Amazing Opportunity',
        description: `Perfect solution for ${inputs.audience || 'entrepreneurs'}`,
        valueProposition: inputs.description || 'Get breakthrough results fast',
        keyBenefits: [
          'Get real results fast',
          'Save time and money',
          'Proven system that works',
        ],
      };

      return {
        subject: `🎯 ${scrapedContent.title} - This Changes Everything!`,
        previewText: `${scrapedContent.description}...`,
        body: `<p>Fellow entrepreneur,</p>
                 <p>I just discovered <strong>${scrapedContent.title}</strong> and had to share this with you immediately.</p>
                 <p><strong>Here's what caught my attention:</strong> ${scrapedContent.valueProposition}</p>
                 <p><strong>This breakthrough approach shows you exactly how to:</strong></p>
                 <ul>
                   ${scrapedContent.keyBenefits.map((benefit: string) => `<li><strong>${benefit}</strong></li>`).join('')}
                 </ul>
                 <p><strong><a href="${inputs.url}" style="color: #40E0D0; text-decoration: none;">Check it out here</a></strong></p>
                 <p>To your success,<br>[Your Name]</p>`,
        ps: `P.S. This could be the breakthrough you've been waiting for. Don't wait - take action now.`,
      };
    } catch (error) {
      console.error('Content generation error:', error);
    }
  }

  // Fallback to knowledge base generation
  return {
    subject: `🚀 ${inputs.product || 'This Opportunity'} - Get Results Fast!`,
    previewText: `Perfect for ${inputs.audience || 'entrepreneurs'} who want quick wins...`,
    body: `<p><strong>Before:</strong> Struggling with ${inputs.description || 'getting results'}?</p>
             <p><strong>After:</strong> Imagine having ${inputs.product || 'this solution'} working for you...</p>
             <p><strong>Bridge:</strong> This ${inputs.product || 'breakthrough system'} is exactly what ${inputs.audience || 'you'} need.</p>
             <p><strong>Click here to get started now!</strong></p>`,
    ps: `P.S. Don't let another day pass without taking action!`,
  };
}
