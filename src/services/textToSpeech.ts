// Text-to-Speech Service using Web Speech Synthesis API

export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synthesis = window.speechSynthesis;
      this.isInitialized = true;
    }
  }

  isSupported(): boolean {
    return this.isInitialized && this.synthesis !== null;
  }

  async speak(
    text: string,
    languageCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.synthesis) {
      onError?.('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language
      utterance.lang = this.mapLanguageCode(languageCode);

      // Try to find a voice for the target language
      const voices = this.synthesis!.getVoices();
      const targetVoice = voices.find(voice =>
        voice.lang.startsWith(utterance.lang.split('-')[0])
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      // Configure speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const errorMessage = `Speech synthesis error: ${event.error}`;
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      this.synthesis!.speak(utterance);
    });
  }

  cancel() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  pause() {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) {
      return [];
    }
    return this.synthesis.getVoices();
  }

  private mapLanguageCode(code: string): string {
    // Map common language codes to BCP 47 format for TTS
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

    return langMap[code] || code;
  }
}

// Singleton instance
let textToSpeechInstance: TextToSpeechService | null = null;

export function getTextToSpeechService(): TextToSpeechService {
  if (!textToSpeechInstance) {
    textToSpeechInstance = new TextToSpeechService();
  }
  return textToSpeechInstance;
}
