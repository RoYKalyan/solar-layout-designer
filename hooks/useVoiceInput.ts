import { useState, useCallback } from 'react';
import { voiceService, VoiceRecordingResult } from '@/services/voice';
import { Platform } from 'react-native';

export interface VoiceInputState {
  isRecording: boolean;
  isTranscribing: boolean;
  hasPermission: boolean | null;
  error: string | null;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isRecording: false,
    isTranscribing: false,
    hasPermission: null,
    error: null,
  });

  const requestPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const granted = await voiceService.requestPermissions();
      setState(prev => ({ ...prev, hasPermission: granted }));
      
      if (!granted) {
        setState(prev => ({ 
          ...prev, 
          error: 'Microphone permission is required for voice input' 
        }));
      }
      
      return granted;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasPermission: false,
        error: 'Failed to request microphone permissions' 
      }));
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Request permissions if not already granted
      if (state.hasPermission !== true) {
        const granted = await requestPermissions();
        if (!granted) return false;
      }

      const started = await voiceService.startRecording();
      setState(prev => ({ ...prev, isRecording: started }));
      return started;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        error: 'Failed to start recording' 
      }));
      return false;
    }
  }, [state.hasPermission, requestPermissions]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      setState(prev => ({ ...prev, isRecording: false, isTranscribing: true, error: null }));
      
      const result = await voiceService.stopRecording();
      if (!result) {
        setState(prev => ({ ...prev, isTranscribing: false }));
        return null;
      }

      // Transcribe the audio
      const transcription = await voiceService.transcribeAudio(result.uri);
      setState(prev => ({ ...prev, isTranscribing: false }));
      
      return transcription;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isTranscribing: false,
        error: error instanceof Error ? error.message : 'Failed to process voice input' 
      }));
      return null;
    }
  }, []);

  const cancelRecording = useCallback(async () => {
    try {
      await voiceService.cancelRecording();
      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isTranscribing: false,
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isTranscribing: false,
        error: 'Failed to cancel recording' 
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermissions,
    clearError,
  };
}