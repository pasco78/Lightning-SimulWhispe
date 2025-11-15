'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import StatusBar from '@/components/StatusBar';
import TranslationDisplay from '@/components/TranslationDisplay';
import ControlPanel from '@/components/ControlPanel';
import TranslationHistory from '@/components/TranslationHistory';
import ErrorNotification from '@/components/ErrorNotification';
import FeedbackForm from '@/components/FeedbackForm';
import { getSpeechRecognitionService } from '@/services/speechRecognition';
import { getTextToSpeechService } from '@/services/textToSpeech';
import { TranslationHistoryManager } from '@/utils/translationHistory';
import { DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG } from '@/config/languages';
import type { AppStatus, TranslationHistoryItem, SpeechRecognitionResult } from '@/types';

export default function Home() {
  // State management
  const [sourceLang, setSourceLang] = useState(DEFAULT_SOURCE_LANG);
  const [targetLang, setTargetLang] = useState(DEFAULT_TARGET_LANG);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [status, setStatus] = useState<AppStatus>({
    isListening: false,
    isTranslating: false,
    isSpeaking: false,
    error: null,
    message: null,
  });
  const [isBidirectional, setIsBidirectional] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Services
  const speechRecognition = useRef(getSpeechRecognitionService());
  const tts = useRef(getTextToSpeechService());
  const translationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(TranslationHistoryManager.getHistory());

    // Check browser support
    if (!speechRecognition.current.isSupported()) {
      setStatus(prev => ({
        ...prev,
        error: 'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
      }));
    }

    if (!tts.current.isSupported()) {
      setTtsEnabled(false);
    }
  }, []);

  // Translation function
  const translateText = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setStatus(prev => ({ ...prev, isTranslating: true, error: null }));

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.trim(),
            sourceLang,
            targetLang,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Translation failed');
        }

        setTranslatedText(data.translatedText);

        // Add to history
        TranslationHistoryManager.addItem(
          text.trim(),
          data.translatedText,
          sourceLang,
          targetLang
        );
        setHistory(TranslationHistoryManager.getHistory());

        // Auto-speak if enabled
        if (ttsEnabled && data.translatedText) {
          speakText(data.translatedText, targetLang);
        }

        setStatus(prev => ({
          ...prev,
          isTranslating: false,
          message: `Translation completed (${data.latency}ms)`,
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus(prev => ({ ...prev, message: null }));
        }, 3000);
      } catch (error: any) {
        console.error('Translation error:', error);
        setStatus(prev => ({
          ...prev,
          isTranslating: false,
          error: error.message || 'Translation failed',
        }));
      }
    },
    [sourceLang, targetLang, ttsEnabled]
  );

  // Speech recognition handler
  const handleSpeechResult = useCallback(
    (result: SpeechRecognitionResult) => {
      if (result.isFinal) {
        setOriginalText(result.transcript);
        setInterimText('');

        // Debounce translation
        if (translationTimeout.current) {
          clearTimeout(translationTimeout.current);
        }

        translationTimeout.current = setTimeout(() => {
          translateText(result.transcript);
        }, 500);
      } else {
        setInterimText(result.transcript);
      }
    },
    [translateText]
  );

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (status.isListening) {
      // Stop listening
      speechRecognition.current.stop();
      setStatus(prev => ({ ...prev, isListening: false }));
      setInterimText('');
    } else {
      // Start listening
      setStatus(prev => ({ ...prev, error: null }));
      speechRecognition.current.setLanguage(sourceLang);

      speechRecognition.current.start(
        handleSpeechResult,
        (error) => {
          setStatus(prev => ({
            ...prev,
            isListening: false,
            error,
          }));
        },
        () => {
          setStatus(prev => ({ ...prev, isListening: false }));
        }
      );

      setStatus(prev => ({ ...prev, isListening: true }));
    }
  }, [status.isListening, sourceLang, handleSpeechResult]);

  // Text-to-speech
  const speakText = useCallback(
    async (text: string, lang: string) => {
      if (!ttsEnabled || !text) return;

      setStatus(prev => ({ ...prev, isSpeaking: true }));

      try {
        await tts.current.speak(
          text,
          lang,
          () => setStatus(prev => ({ ...prev, isSpeaking: true })),
          () => setStatus(prev => ({ ...prev, isSpeaking: false })),
          (error) => setStatus(prev => ({ ...prev, error, isSpeaking: false }))
        );
      } catch (error) {
        console.error('TTS error:', error);
      }
    },
    [ttsEnabled]
  );

  // Reset translation
  const handleReset = useCallback(() => {
    setOriginalText('');
    setTranslatedText('');
    setInterimText('');
    if (status.isListening) {
      speechRecognition.current.stop();
      setStatus(prev => ({ ...prev, isListening: false }));
    }
    if (status.isSpeaking) {
      tts.current.cancel();
      setStatus(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [status.isListening, status.isSpeaking]);

  // Export history
  const handleExportHistory = useCallback(() => {
    const json = TranslationHistoryManager.exportHistory();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus(prev => ({ ...prev, message: 'History exported successfully' }));
    setTimeout(() => setStatus(prev => ({ ...prev, message: null })), 3000);
  }, []);

  // Clear history
  const handleClearHistory = useCallback(() => {
    if (confirm('Are you sure you want to clear all translation history?')) {
      TranslationHistoryManager.clearHistory();
      setHistory([]);
      setStatus(prev => ({ ...prev, message: 'History cleared' }));
      setTimeout(() => setStatus(prev => ({ ...prev, message: null })), 3000);
    }
  }, []);

  // Remove history item
  const handleRemoveHistoryItem = useCallback((id: string) => {
    TranslationHistoryManager.removeItem(id);
    setHistory(TranslationHistoryManager.getHistory());
  }, []);

  // Toggle bi-directional mode
  const handleToggleBidirectional = useCallback(() => {
    if (isBidirectional) {
      setIsBidirectional(false);
    } else {
      // Swap languages
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      setIsBidirectional(true);
    }
  }, [isBidirectional, sourceLang, targetLang]);

  // Feedback submission
  const handleFeedbackSubmit = useCallback((feedback: { rating: number; comment: string }) => {
    console.log('Feedback submitted:', feedback);
    // In a real app, this would send to a backend
    setStatus(prev => ({ ...prev, message: 'Thank you for your feedback!' }));
    setTimeout(() => setStatus(prev => ({ ...prev, message: null })), 3000);
  }, []);

  const displayText = originalText + (interimText ? ` ${interimText}` : '');

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">⚡ Lightning SimulWhispe</h1>
        <p className="subtitle">Real-Time Speech Translation powered by Gemini AI</p>
      </header>

      <ErrorNotification
        error={status.error}
        onClose={() => setStatus(prev => ({ ...prev, error: null }))}
      />

      <div className="main-content">
        <div className="translation-section">
          <div className="language-controls">
            <LanguageSelector
              label="Speak in"
              value={sourceLang}
              onChange={setSourceLang}
              disabled={status.isListening}
            />
            <LanguageSelector
              label="Translate to"
              value={targetLang}
              onChange={setTargetLang}
              disabled={status.isListening}
            />
          </div>

          <StatusBar
            isListening={status.isListening}
            isTranslating={status.isTranslating}
            isSpeaking={status.isSpeaking}
            message={status.message}
          />

          <TranslationDisplay
            originalText={displayText}
            translatedText={translatedText}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSpeak={() => speakText(translatedText, targetLang)}
            isSpeaking={status.isSpeaking}
            ttsEnabled={ttsEnabled}
          />

          <ControlPanel
            isListening={status.isListening}
            onToggleListening={toggleListening}
            onReset={handleReset}
            onExportHistory={handleExportHistory}
            onClearHistory={handleClearHistory}
            onToggleBidirectional={handleToggleBidirectional}
            isBidirectional={isBidirectional}
            disabled={!speechRecognition.current.isSupported()}
          />

          <div className="additional-controls">
            <button
              onClick={() => setShowFeedback(true)}
              className="feedback-button"
              disabled={!translatedText}
            >
              <MessageSquarePlus size={16} />
              Rate Translation Quality
            </button>
          </div>
        </div>

        <div className="history-section">
          <TranslationHistory
            history={history}
            onRemove={handleRemoveHistoryItem}
            onSpeak={ttsEnabled ? speakText : undefined}
          />
        </div>
      </div>

      {showFeedback && (
        <FeedbackForm
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </main>
  );
}
