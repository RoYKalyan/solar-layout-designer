import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface VoiceRecordingResult {
  uri: string;
  duration: number;
}

export class VoiceService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web permissions are handled by the browser
        return await this.requestWebMicrophonePermission();
      } else {
        // Native permissions
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
      }
    } catch (error) {
      console.error('Error requesting microphone permissions:', error);
      return false;
    }
  }

  private async requestWebMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Web microphone permission denied:', error);
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        return false;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<VoiceRecordingResult | null> {
    try {
      if (!this.recording || !this.isRecording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();
      
      this.isRecording = false;
      this.recording = null;

      if (!uri) {
        throw new Error('Recording URI is null');
      }

      return {
        uri,
        duration: status.isLoaded ? status.durationMillis || 0 : 0,
      };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.isRecording = false;
      this.recording = null;
      return null;
    }
  }

  async transcribeAudio(audioUri: string): Promise<string> {
    try {
      // Create FormData for the audio file
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        // Web implementation
        const response = await fetch(audioUri);
        const blob = await response.blob();
        formData.append('file', blob, 'audio.wav');
      } else {
        // Native implementation - Expo records in m4a format
        formData.append('file', {
          uri: audioUri,
          type: 'audio/m4a',
          name: 'audio.m4a',
        } as any);
      }

      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  async cancelRecording(): Promise<void> {
    try {
      if (this.recording && this.isRecording) {
        await this.recording.stopAndUnloadAsync();
      }
    } catch (error) {
      console.error('Error canceling recording:', error);
    } finally {
      this.isRecording = false;
      this.recording = null;
    }
  }
}

export const voiceService = new VoiceService();