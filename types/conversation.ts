export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  isSpeaking: boolean;
}

export interface SolarPanelContext {
  propertyType?: string;
  roofSize?: string;
  budget?: string;
  energyGoals?: string;
  location?: string;
  orientation?: string;
  shading?: string;
  currentUsage?: string;
}