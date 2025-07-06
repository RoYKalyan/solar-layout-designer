import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ConversationState } from '@/types/conversation';
import { conversationService } from '@/services/openai';
import { speechService } from '@/services/speech';

export function useConversation() {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    isTyping: false,
    isSpeaking: false,
  });

  const [conversationMode, setConversationMode] = useState<'manual' | 'continuous'>('manual');
  const isMountedRef = useRef(true);
  const speechEndTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (speechEndTimeoutRef.current) {
        clearTimeout(speechEndTimeoutRef.current);
      }
    };
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    if (isMountedRef.current) {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    }

    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string, autoMode = false) => {
    if (state.isLoading) return;

    // Add user message
    addMessage({ role: 'user', content });

    // Set loading state
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true, isTyping: true }));
    }

    try {
      // Generate AI response
      const response = await conversationService.generateResponse([
        ...state.messages,
        { id: 'temp', role: 'user', content, timestamp: new Date() }
      ]);

      // Add assistant message
      const assistantMessage = addMessage({ role: 'assistant', content: response });

      // Speak the response
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isSpeaking: true }));
      }
      
      await speechService.speak(response);
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isSpeaking: false }));
      }

      // In continuous mode, automatically start listening again after speech ends
      if (autoMode && conversationMode === 'continuous') {
        if (speechEndTimeoutRef.current) {
          clearTimeout(speechEndTimeoutRef.current);
        }
        
        speechEndTimeoutRef.current = setTimeout(() => {
          // Trigger auto-listening through a custom event
          window.dispatchEvent(new CustomEvent('autoStartListening'));
        }, 1000); // Wait 1 second after speech ends
      }

    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({ 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      });
    } finally {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false, isTyping: false }));
      }
    }
  }, [state.messages, state.isLoading, addMessage, conversationMode]);

  const clearConversation = useCallback(() => {
    if (isMountedRef.current) {
      setState({
        messages: [],
        isLoading: false,
        isTyping: false,
        isSpeaking: false,
      });
    }
    speechService.stopSpeaking();
    setConversationMode('manual');
  }, []);

  const stopSpeaking = useCallback(async () => {
    await speechService.stopSpeaking();
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
    
    // Clear any pending auto-listening timeout
    if (speechEndTimeoutRef.current) {
      clearTimeout(speechEndTimeoutRef.current);
    }
  }, []);

  const toggleConversationMode = useCallback(() => {
    setConversationMode(prev => prev === 'manual' ? 'continuous' : 'manual');
  }, []);

  const sendMessageInMode = useCallback((content: string) => {
    return sendMessage(content, conversationMode === 'continuous');
  }, [sendMessage, conversationMode]);

  return {
    ...state,
    conversationMode,
    sendMessage: sendMessageInMode,
    clearConversation,
    stopSpeaking,
    toggleConversationMode,
  };
}