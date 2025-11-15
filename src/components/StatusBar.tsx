'use client';

import React from 'react';
import { Mic, Radio, Volume2, Loader2 } from 'lucide-react';

interface StatusBarProps {
  isListening: boolean;
  isTranslating: boolean;
  isSpeaking: boolean;
  message: string | null;
}

export default function StatusBar({
  isListening,
  isTranslating,
  isSpeaking,
  message,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-indicators">
        {isListening && (
          <div className="status-item active">
            <Radio className="icon animate-pulse" size={16} />
            <span>Listening...</span>
          </div>
        )}

        {isTranslating && (
          <div className="status-item active">
            <Loader2 className="icon animate-spin" size={16} />
            <span>Translating...</span>
          </div>
        )}

        {isSpeaking && (
          <div className="status-item active">
            <Volume2 className="icon animate-pulse" size={16} />
            <span>Speaking...</span>
          </div>
        )}

        {!isListening && !isTranslating && !isSpeaking && (
          <div className="status-item idle">
            <Mic className="icon" size={16} />
            <span>Ready</span>
          </div>
        )}
      </div>

      {message && <div className="status-message">{message}</div>}
    </div>
  );
}
