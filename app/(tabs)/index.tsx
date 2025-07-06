import { useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { SolarLayoutViewer } from '@/components/SolarLayoutViewer';
import { SatelliteImageViewer } from '@/components/SatelliteImageViewer';
import { useConversation } from '@/hooks/useConversation';
import { useLayoutGeneration } from '@/hooks/useLayoutGeneration';
import { Message } from '@/types/conversation';

SplashScreen.preventAutoHideAsync();

export default function ChatScreen() {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isTyping, 
    isSpeaking, 
    stopSpeaking,
    conversationMode,
    toggleConversationMode
  } = useConversation();
  
  const {
    layoutContext,
    showSatelliteView,
    showLayoutView,
    processMessage,
    handleRoofDetected,
  } = useLayoutGeneration();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Process messages for layout generation
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        processMessage(lastMessage.content);
      }
    }
  }, [messages, processMessage]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatMessage message={item} />
  );

  const renderTypingIndicator = () => (
    isTyping ? (
      <ChatMessage
        message={{
          id: 'typing',
          role: 'assistant',
          content: 'Thinking...',
          timestamp: new Date(),
        }}
        isTyping={true}
      />
    ) : null
  );

  const renderLayoutComponents = () => (
    <>
      <SatelliteImageViewer
        address={layoutContext.address}
        onRoofDetected={handleRoofDetected}
        visible={showSatelliteView}
      />
      
      <SolarLayoutViewer
        roofDimensions={layoutContext.roofDimensions}
        panelCount={layoutContext.panelCount}
        panelWatts={layoutContext.panelWatts || 400}
        orientation={layoutContext.orientation}
        visible={showLayoutView}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SolarBot</Text>
        <Text style={styles.headerSubtitle}>
          {conversationMode === 'continuous' 
            ? '🔄 Continuous Voice Mode - Natural Conversation' 
            : '💬 AI-Powered Solar Design Assistant'
          }
        </Text>
      </View>

      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <>
                {renderTypingIndicator()}
                {renderLayoutComponents()}
              </>
            )}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 100,
            }}
          />
        )}
      </View>

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        conversationMode={conversationMode}
        onToggleConversationMode={toggleConversationMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});