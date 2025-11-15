'use client';

import React from 'react';
import { Mic, MicOff, RotateCcw, Download, Trash2, MessageSquare } from 'lucide-react';

interface ControlPanelProps {
  isListening: boolean;
  onToggleListening: () => void;
  onReset: () => void;
  onExportHistory: () => void;
  onClearHistory: () => void;
  onToggleBidirectional?: () => void;
  isBidirectional?: boolean;
  disabled?: boolean;
}

export default function ControlPanel({
  isListening,
  onToggleListening,
  onReset,
  onExportHistory,
  onClearHistory,
  onToggleBidirectional,
  isBidirectional = false,
  disabled = false,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="primary-controls">
        <button
          onClick={onToggleListening}
          disabled={disabled}
          className={`control-button primary ${isListening ? 'active' : ''}`}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <>
              <MicOff size={24} />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic size={24} />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          disabled={disabled}
          className="control-button secondary"
          title="Reset translation"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>

        {onToggleBidirectional && (
          <button
            onClick={onToggleBidirectional}
            disabled={disabled}
            className={`control-button secondary ${isBidirectional ? 'active' : ''}`}
            title="Toggle bi-directional mode"
          >
            <MessageSquare size={20} />
            <span>Bi-directional</span>
          </button>
        )}
      </div>

      <div className="secondary-controls">
        <button
          onClick={onExportHistory}
          className="control-button small"
          title="Export translation history"
        >
          <Download size={18} />
          <span>Export</span>
        </button>

        <button
          onClick={onClearHistory}
          className="control-button small danger"
          title="Clear translation history"
        >
          <Trash2 size={18} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
