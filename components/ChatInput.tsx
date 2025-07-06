import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Send, Square, Mic, MicOff } from 'lucide-react-native';
import { VoiceInputButton } from './VoiceInputButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  conversationMode: 'manual' | 'continuous';
  onToggleConversationMode: () => void;
}

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  isSpeaking, 
  onStopSpeaking,
  conversationMode,
  onToggleConversationMode
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const {
    isRecording,
    isTranscribing,
    hasPermission,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermissions,
    clearError,
  } = useVoiceInput();

  // Auto-start listening in continuous mode
  useEffect(() => {
    const handleAutoStart = async () => {
      if (conversationMode === 'continuous' && !isRecording && !isTranscribing && !isSpeaking && !isLoading) {
        await handleVoiceInput();
      }
    };

    window.addEventListener('autoStartListening', handleAutoStart);
    return () => window.removeEventListener('autoStartListening', handleAutoStart);
  }, [conversationMode, isRecording, isTranscribing, isSpeaking, isLoading]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      const transcription = await stopRecording();
      if (transcription && transcription.trim()) {
        if (conversationMode === 'continuous') {
          // In continuous mode, automatically send the message
          onSendMessage(transcription.trim());
        } else {
          // In manual mode, populate the text input
          setMessage(transcription);
        }
      }
    } else {
      // Start recording
      if (hasPermission === null) {
        await requestPermissions();
      }
      await startRecording();
    }
  };

  const isVoiceDisabled = isLoading || isTranscribing;

  const getConversationModeText = () => {
    return conversationMode === 'continuous' 
      ? '🔄 Continuous Mode' 
      : '👆 Manual Mode';
  };

  const getConversationModeDescription = () => {
    return conversationMode === 'continuous'
      ? 'Speak naturally - I\'ll listen automatically after each response'
      : 'Tap microphone to start/stop recording, then send manually';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errorDismiss}>
            <Text style={styles.errorDismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conversation Mode Toggle */}
      <View style={styles.modeContainer}>
        <TouchableOpacity 
          style={[
            styles.modeToggle, 
            conversationMode === 'continuous' && styles.modeToggleActive
          ]}
          onPress={onToggleConversationMode}
          disabled={isRecording || isLoading || isSpeaking}
        >
          <Text style={[
            styles.modeText,
            conversationMode === 'continuous' && styles.modeTextActive
          ]}>
            {getConversationModeText()}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.modeDescription}>
        {getConversationModeDescription()}
      </Text>
      
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder={
              conversationMode === 'continuous'
                ? isRecording 
                  ? "🎤 Listening... speak naturally" 
                  : isTranscribing 
                  ? "⚡ Processing your voice..." 
                  : isSpeaking
                  ? "🔊 Speaking... I'll listen when done"
                  : "💬 Continuous conversation mode active"
                : isRecording 
                ? "Recording... Tap microphone to stop" 
                : isTranscribing 
                ? "Processing voice input..." 
                : "Ask about solar panels or speak..."
            }
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!isLoading && !isRecording && !isTranscribing && conversationMode === 'manual'}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          
          <View style={styles.buttonContainer}>
            {isSpeaking ? (
              <TouchableOpacity style={styles.stopButton} onPress={onStopSpeaking}>
                <Square size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <>
                <VoiceInputButton
                  isRecording={isRecording}
                  isTranscribing={isTranscribing}
                  onPress={handleVoiceInput}
                  disabled={isVoiceDisabled}
                  continuousMode={conversationMode === 'continuous'}
                />
                
                {conversationMode === 'manual' && (
                  <TouchableOpacity
                    style={[styles.sendButton, { opacity: message.trim() && !isLoading ? 1 : 0.4 }]}
                    onPress={handleSend}
                    disabled={!message.trim() || isLoading}
                  >
                    <Send size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
        
        {(isRecording || isTranscribing) && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isRecording && (conversationMode === 'continuous' 
                ? "🎤 Listening... speak naturally, I'll respond when you're done"
                : "🎤 Recording... Tap microphone to stop"
              )}
              {isTranscribing && "⚡ Processing your voice..."}
            </Text>
            {isRecording && conversationMode === 'manual' && (
              <TouchableOpacity onPress={cancelRecording} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {conversationMode === 'continuous' && !isRecording && !isTranscribing && !isSpeaking && !isLoading && (
          <View style={styles.continuousHint}>
            <Mic size={16} color="#059669" />
            <Text style={styles.continuousHintText}>
              Ready to listen - speak anytime for natural conversation
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
  },
  errorDismiss: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  errorDismissText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  modeContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  modeToggle: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modeToggleActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter-SemiBold',
  },
  modeTextActive: {
    color: '#2563EB',
  },
  modeDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
    maxHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter-SemiBold',
  },
  continuousHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  continuousHintText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
});