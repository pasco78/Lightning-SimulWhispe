// Speech Recognition Service using Web Speech API

import { SpeechRecognitionResult } from '@/types';

export class SpeechRecognitionService {
  private recognition: any = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeRecognition();
    }
  }

  private initializeRecognition() {
    // Check for Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Web Speech API is not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.isInitialized = true;
  }

  isSupported(): boolean {
    return this.isInitialized && this.recognition !== null;
  }

  setLanguage(languageCode: string) {
    if (this.recognition) {
      // Map common language codes to BCP 47 format
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-BR',
        'ru': 'ru-RU',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'zh-TW': 'zh-TW',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'nl': 'nl-NL',
        'pl': 'pl-PL',
        'tr': 'tr-TR',
        'vi': 'vi-VN',
        'th': 'th-TH',
        'sv': 'sv-SE',
        'da': 'da-DK',
        'no': 'no-NO',
        'fi': 'fi-FI',
        'cs': 'cs-CZ',
        'el': 'el-GR',
        'he': 'he-IL',
        'id': 'id-ID',
        'ms': 'ms-MY',
        'ro': 'ro-RO',
        'uk': 'uk-UA',
      };

      this.recognition.lang = langMap[languageCode] || languageCode;
    }
  }

  start(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not initialized');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResultIndex = results.length - 1;
      const lastResult = results[lastResultIndex];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;
      const isFinal = lastResult.isFinal;

      onResult({
        transcript,
        isFinal,
        confidence,
      });
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone detected. Please check your audio settings.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      onError(errorMessage);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (error: any) {
      if (error.message && error.message.includes('already started')) {
        // Recognition is already running, stop and restart
        this.stop();
        setTimeout(() => this.recognition.start(), 100);
      } else {
        onError(`Failed to start speech recognition: ${error.message}`);
      }
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (error) {
        console.error('Error aborting recognition:', error);
      }
    }
  }
}

// Singleton instance
let speechRecognitionInstance: SpeechRecognitionService | null = null;

export function getSpeechRecognitionService(): SpeechRecognitionService {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService();
  }
  return speechRecognitionInstance;
}
