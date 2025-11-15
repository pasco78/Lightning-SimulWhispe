// Translation history management using localStorage

import { TranslationHistoryItem } from '@/types';

const STORAGE_KEY = 'translation_history';
const MAX_HISTORY_ITEMS = 100;

export class TranslationHistoryManager {
  static getHistory(): TranslationHistoryItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const history: TranslationHistoryItem[] = JSON.parse(stored);
      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error reading translation history:', error);
      return [];
    }
  }

  static addItem(
    originalText: string,
    translatedText: string,
    sourceLang: string,
    targetLang: string
  ): TranslationHistoryItem {
    const item: TranslationHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalText,
      translatedText,
      sourceLang,
      targetLang,
      timestamp: Date.now(),
    };

    try {
      const history = this.getHistory();
      history.unshift(item);

      // Keep only the most recent items
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
      return item;
    } catch (error) {
      console.error('Error saving translation history:', error);
      return item;
    }
  }

  static removeItem(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing translation history item:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing translation history:', error);
    }
  }

  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  static importHistory(jsonString: string): boolean {
    try {
      const imported: TranslationHistoryItem[] = JSON.parse(jsonString);

      // Validate the imported data
      if (!Array.isArray(imported)) {
        throw new Error('Invalid history format');
      }

      for (const item of imported) {
        if (
          !item.id ||
          !item.originalText ||
          !item.translatedText ||
          !item.sourceLang ||
          !item.targetLang ||
          !item.timestamp
        ) {
          throw new Error('Invalid history item format');
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      return true;
    } catch (error) {
      console.error('Error importing translation history:', error);
      return false;
    }
  }
}
