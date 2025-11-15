'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TranslationDisplayProps {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  ttsEnabled?: boolean;
}

export default function TranslationDisplay({
  originalText,
  translatedText,
  sourceLang,
  targetLang,
  onSpeak,
  isSpeaking = false,
  ttsEnabled = true,
}: TranslationDisplayProps) {
  return (
    <div className="translation-display">
      <div className="translation-box original">
        <div className="box-header">
          <h3>Original ({sourceLang.toUpperCase()})</h3>
        </div>
        <div className="box-content">
          {originalText || <span className="placeholder">Speak to see text here...</span>}
        </div>
      </div>

      <div className="translation-arrow">→</div>

      <div className="translation-box translated">
        <div className="box-header">
          <h3>Translation ({targetLang.toUpperCase()})</h3>
          {translatedText && ttsEnabled && (
            <button
              onClick={onSpeak}
              disabled={isSpeaking}
              className="speak-button"
              title="Speak translation"
            >
              {isSpeaking ? (
                <VolumeX size={18} className="animate-pulse" />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          )}
        </div>
        <div className="box-content">
          {translatedText || <span className="placeholder">Translation will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
