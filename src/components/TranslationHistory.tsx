'use client';

import React from 'react';
import { TranslationHistoryItem } from '@/types';
import { Clock, X, Volume2 } from 'lucide-react';

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  onRemove: (id: string) => void;
  onSpeak?: (text: string, lang: string) => void;
  maxItems?: number;
}

export default function TranslationHistory({
  history,
  onRemove,
  onSpeak,
  maxItems = 10,
}: TranslationHistoryProps) {
  const displayHistory = history.slice(0, maxItems);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (displayHistory.length === 0) {
    return (
      <div className="translation-history empty">
        <p className="empty-message">No translation history yet.</p>
      </div>
    );
  }

  return (
    <div className="translation-history">
      <div className="history-header">
        <h3>Recent Translations</h3>
        <span className="history-count">{history.length} total</span>
      </div>

      <div className="history-list">
        {displayHistory.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-header">
              <div className="language-badge">
                {item.sourceLang} → {item.targetLang}
              </div>
              <div className="history-item-actions">
                <span className="timestamp">
                  <Clock size={12} />
                  {formatTimestamp(item.timestamp)}
                </span>
                {onSpeak && (
                  <button
                    onClick={() => onSpeak(item.translatedText, item.targetLang)}
                    className="action-button"
                    title="Speak translation"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
                <button
                  onClick={() => onRemove(item.id)}
                  className="action-button danger"
                  title="Remove from history"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="history-item-content">
              <div className="history-text original">
                <span className="text-label">Original:</span>
                <p>{item.originalText}</p>
              </div>
              <div className="history-text translated">
                <span className="text-label">Translation:</span>
                <p>{item.translatedText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > maxItems && (
        <div className="history-footer">
          <p className="muted">Showing {maxItems} of {history.length} translations</p>
        </div>
      )}
    </div>
  );
}
