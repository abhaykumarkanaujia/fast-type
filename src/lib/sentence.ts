import { EASY_WORDS, HARD_WORDS, MEDIUM_WORDS } from "@/utils/constant";

enum DIFFICULTY_LEVEL {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

class Sentence {
  private wordCache: Map<DIFFICULTY_LEVEL, string[]>;
  private sentenceCache: Map<DIFFICULTY_LEVEL, string[]>;
  private maxCacheSize: number;
  private lastUsedWords: Set<string>;
  private maxUsedWords: number;

  constructor() {
    this.wordCache = new Map();
    this.sentenceCache = new Map();
    this.maxCacheSize = 50;
    this.lastUsedWords = new Set();
    this.maxUsedWords = 200;
  }

  getRandomWord(difficulty: DIFFICULTY_LEVEL = DIFFICULTY_LEVEL.MEDIUM) {
    const words = this.getWordList(difficulty);
    return words[Math.floor(Math.random() * words.length)];
  }

  getRandomWords(
    difficulty: DIFFICULTY_LEVEL = DIFFICULTY_LEVEL.MEDIUM,
    count: number = 10
  ) {
    const words = this.getWordList(difficulty);
    const result = [];

    for (let i = 0; i < count; i++) {
      let word;
      let attempts = 0;

      do {
        word = words[Math.floor(Math.random() * words.length)];
        attempts++;
      } while (this.lastUsedWords.has(word) && attempts < 10);

      result.push(word);
      this.lastUsedWords.add(word);
    }

    if (this.lastUsedWords.size > this.maxUsedWords) {
      const wordsArray = Array.from(this.lastUsedWords);
      this.lastUsedWords.clear();
      wordsArray
        .slice(-this.maxUsedWords / 2)
        .forEach((word) => this.lastUsedWords.add(word));
    }

    return result;
  }

  generateSentenceFromTemplate(
    template: string,
    difficulty: DIFFICULTY_LEVEL = DIFFICULTY_LEVEL.MEDIUM
  ) {
    return template.replace(/{word}/g, () => this.getRandomWord(difficulty));
  }

  getWordList(difficulty: DIFFICULTY_LEVEL): string[] {
    if (this.wordCache.has(difficulty)) {
      return this.wordCache.get(difficulty) ?? [];
    }

    const words = this.loadWordsForDifficulty(difficulty);
    this.wordCache.set(difficulty, words);

    if (this.wordCache.size > this.maxCacheSize) {
      const firstKey = this.wordCache.keys().next().value;
      if (firstKey) {
        this.wordCache.delete(firstKey);
      }
    }

    return words;
  }

  loadWordsForDifficulty(
    difficulty: DIFFICULTY_LEVEL = DIFFICULTY_LEVEL.MEDIUM
  ) {
    const wordDatabase = {
      easy: EASY_WORDS,
      medium: MEDIUM_WORDS,
      hard: HARD_WORDS,
    };
    return wordDatabase[difficulty] || wordDatabase.medium;
  }

  clearCache() {
    this.wordCache.clear();
    this.sentenceCache.clear();
    this.lastUsedWords.clear();
  }

  getCacheStats() {
    return {
      wordCacheSize: this.wordCache.size,
      sentenceCacheSize: this.sentenceCache.size,
      lastUsedWordsSize: this.lastUsedWords.size,
      maxCacheSize: this.maxCacheSize,
      maxUsedWords: this.maxUsedWords,
    };
  }
}

const sentence = new Sentence();
export default sentence;
