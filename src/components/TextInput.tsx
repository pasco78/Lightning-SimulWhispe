'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';

interface TextInputProps {
  onTranslate: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isTranslating?: boolean;
}

export default function TextInput({
  onTranslate,
  disabled = false,
  placeholder = '번역할 텍스트를 입력하세요...',
  isTranslating = false,
}: TextInputProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputText.trim() && !disabled && !isTranslating) {
      onTranslate(inputText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    setInputText('');
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="text-input-form">
      <div className="text-input-container">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="text-input-field"
          rows={3}
          maxLength={5000}
        />

        <div className="text-input-footer">
          <div className="text-input-info">
            <span className="char-counter">
              {inputText.length} / 5000
            </span>
            <span className="hint">
              Ctrl + Enter로 번역
            </span>
          </div>

          <div className="text-input-actions">
            {inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="text-input-button secondary"
                disabled={disabled}
                title="초기화"
              >
                <RotateCcw size={16} />
              </button>
            )}

            <button
              type="submit"
              disabled={disabled || !inputText.trim() || isTranslating}
              className="text-input-button primary"
              title="번역하기"
            >
              <Send size={16} />
              <span>{isTranslating ? '번역 중...' : '번역하기'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
