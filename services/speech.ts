import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export class SpeechService {
  private isSpeaking = false;
  private speechQueue: string[] = [];

  async speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        // Web speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        utterance.onend = () => resolve();
        speechSynthesis.speak(utterance);
      } else {
        // Native speech synthesis
        Speech.speak(text, {
          rate: 0.9,
          pitch: 1.0,
          volume: 0.8,
          onDone: () => resolve(),
          onError: () => resolve(),
        });
      }
    });
  }

  async stopSpeaking(): Promise<void> {
    if (Platform.OS === 'web') {
      speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
    this.isSpeaking = false;
    this.speechQueue = [];
  }

  async queueSpeech(text: string): Promise<void> {
    this.speechQueue.push(text);
    if (!this.isSpeaking) {
      await this.processSpeechQueue();
    }
  }

  private async processSpeechQueue(): Promise<void> {
    if (this.speechQueue.length === 0) {
      this.isSpeaking = false;
      return;
    }

    this.isSpeaking = true;
    const text = this.speechQueue.shift();
    if (text) {
      await this.speak(text);
    }
    await this.processSpeechQueue();
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();