import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bot, Sun, LayoutGrid as Layout, Calculator, Mic, MessageCircle } from 'lucide-react-native';

interface WelcomeMessageProps {
  onStartConversation?: () => void;
}

export function WelcomeMessage({ onStartConversation }: WelcomeMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Bot size={32} color="#059669" />
      </View>
      
      <Text style={styles.title}>Hi! I'm SolarBot</Text>
      <Text style={styles.subtitle}>Your AI-powered solar panel design assistant</Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <MessageCircle size={20} color="#2563EB" />
          <Text style={styles.featureText}>Seamless voice conversations</Text>
        </View>
        <View style={styles.feature}>
          <Sun size={20} color="#D97706" />
          <Text style={styles.featureText}>Automated roof analysis</Text>
        </View>
        <View style={styles.feature}>
          <Layout size={20} color="#059669" />
          <Text style={styles.featureText}>AI-optimized layouts</Text>
        </View>
        <View style={styles.feature}>
          <Calculator size={20} color="#7C3AED" />
          <Text style={styles.featureText}>Smart energy calculations</Text>
        </View>
      </View>
      
      <Text style={styles.prompt}>
        Tell me about your property and energy goals, or simply speak to me! I'll help you design the perfect solar panel layout with automated roof analysis and AI-powered optimization.
      </Text>
      
      <View style={styles.conversationModes}>
        <View style={styles.modeCard}>
          <View style={styles.modeHeader}>
            <Mic size={20} color="#059669" />
            <Text style={styles.modeTitle}>🔄 Continuous Mode</Text>
          </View>
          <Text style={styles.modeDescription}>
            Natural conversation flow - I'll listen automatically after each response. Perfect for hands-free interaction!
          </Text>
        </View>
        
        <View style={styles.modeCard}>
          <View style={styles.modeHeader}>
            <MessageCircle size={20} color="#2563EB" />
            <Text style={styles.modeTitle}>👆 Manual Mode</Text>
          </View>
          <Text style={styles.modeDescription}>
            Traditional chat with manual voice recording. Tap to record, tap to send.
          </Text>
        </View>
      </View>
      
      <View style={styles.voicePrompt}>
        <Mic size={16} color="#2563EB" />
        <Text style={styles.voicePromptText}>
          Try saying: "I want to install solar panels on my house at [your address]"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 64,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  prompt: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  conversationModes: {
    width: '100%',
    marginBottom: 24,
  },
  modeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  modeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  voicePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  voicePromptText: {
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 8,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    flex: 1,
  },
});