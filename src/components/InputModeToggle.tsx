'use client';

import React from 'react';
import { Mic, Keyboard, ListChecks } from 'lucide-react';

export type InputMode = 'voice' | 'text' | 'both';

interface InputModeToggleProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
  disabled?: boolean;
}

export default function InputModeToggle({
  mode,
  onChange,
  disabled = false,
}: InputModeToggleProps) {
  return (
    <div className="input-mode-toggle">
      <label className="mode-label">입력 방식</label>

      <div className="mode-buttons">
        <button
          type="button"
          onClick={() => onChange('voice')}
          disabled={disabled}
          className={`mode-button ${mode === 'voice' ? 'active' : ''}`}
          title="음성 입력만"
        >
          <Mic size={18} />
          <span>음성</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('text')}
          disabled={disabled}
          className={`mode-button ${mode === 'text' ? 'active' : ''}`}
          title="텍스트 입력만"
        >
          <Keyboard size={18} />
          <span>텍스트</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('both')}
          disabled={disabled}
          className={`mode-button ${mode === 'both' ? 'active' : ''}`}
          title="음성 + 텍스트"
        >
          <ListChecks size={18} />
          <span>모두</span>
        </button>
      </div>
    </div>
  );
}
