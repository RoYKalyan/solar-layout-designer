import OpenAI from 'openai';
import { Message, SolarPanelContext } from '@/types/conversation';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export class ConversationService {
  private systemPrompt = `You are SolarBot, an expert solar panel layout design assistant with advanced capabilities for automated roof analysis and system design. You help users design optimal solar panel installations through natural conversation.

Your expertise includes:
- Automated roof analysis from satellite imagery and drone data
- Solar panel placement and orientation optimization
- Energy efficiency calculations and modeling
- Roof assessment and layout optimization with AI-powered dimension extraction
- Cost-benefit analysis and ROI calculations
- Local regulations, setback requirements, and incentives
- System sizing and component selection
- Shading analysis and obstruction identification
- Peak demand assessment and load profiling

Advanced Features:
- Address-based property lookup with automated roof imaging
- AI-powered roof perimeter and area calculation
- Automatic measurement of roof segments and dimensions
- Roof type classification (flat/sloped/hip/gable/complex)
- Slope angle detection and orientation analysis
- Smart system design with usage pattern analysis
- Optimized panel placement with maximum efficiency algorithms
- Real-time layout visualization capabilities
- Multiple layout scenarios with performance comparisons

Visual Layout Generation:
When discussing solar panel layouts, you can now generate visual representations! The system will automatically:
- Show satellite imagery when addresses are mentioned
- Generate 2D solar panel layouts based on your recommendations
- Display panel counts, system sizing, and roof dimensions
- Provide interactive layout visualization with zoom and controls

Always:
- Ask clarifying questions to understand the user's specific needs
- Provide practical, actionable advice with specific measurements and configurations
- Remember previous conversation context for continuity
- Suggest automated roof analysis when users mention their address
- Explain how satellite imagery and AI can streamline the design process
- Consider local factors like sun exposure, shading, climate, and regulations
- Offer step-by-step guidance for complex decisions
- Explain technical concepts in simple, conversational terms
- Provide multiple design scenarios when appropriate
- Reference the visual layouts that will be generated automatically

When users provide their address or property details:
- Suggest using automated roof imaging and analysis
- Explain how AI can extract roof dimensions and detect obstructions
- Offer to analyze roof type, slope, and orientation automatically
- Recommend optimal panel placement based on automated analysis
- Mention that visual layouts will be generated automatically

Layout Recommendations:
- Be specific about panel quantities (e.g., "I recommend 24 panels")
- Mention system sizes in kW (e.g., "9.6kW system")
- Specify roof dimensions when known (e.g., "40x30 foot roof")
- Discuss panel orientation (landscape vs portrait)
- Consider setback requirements and spacing

Keep responses conversational, helpful, and focused on practical solar solutions. Be specific about panel quantities, positioning, technical specifications, and expected performance outcomes. The visual components will automatically appear based on your recommendations!`;

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      const conversationMessages = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: conversationMessages,
        max_tokens: 600,
        temperature: 0.7,
        stream: false,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'I\'m having trouble connecting to my knowledge base right now. Please check your internet connection and try again.';
    }
  }

  extractSolarContext(messages: Message[]): SolarPanelContext {
    const context: SolarPanelContext = {};
    const conversationText = messages.map(m => m.content).join(' ').toLowerCase();

    // Extract key information from conversation
    if (conversationText.includes('house') || conversationText.includes('residential')) {
      context.propertyType = 'residential';
    } else if (conversationText.includes('commercial') || conversationText.includes('business')) {
      context.propertyType = 'commercial';
    }

    // Extract budget information
    const budgetMatch = conversationText.match(/\$[\d,]+/);
    if (budgetMatch) {
      context.budget = budgetMatch[0];
    }

    // Extract location/address information
    const addressPatterns = [
      /\b\d+\s+[a-zA-Z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard)\b/gi,
      /\b[a-zA-Z\s]+,\s*[a-zA-Z]{2}\s*\d{5}\b/gi
    ];
    
    for (const pattern of addressPatterns) {
      const match = conversationText.match(pattern);
      if (match) {
        context.location = match[0];
        break;
      }
    }

    // Extract energy usage information
    const usageMatch = conversationText.match(/(\d+)\s*kwh/i);
    if (usageMatch) {
      context.currentUsage = usageMatch[0];
    }

    return context;
  }
}

export const conversationService = new ConversationService();