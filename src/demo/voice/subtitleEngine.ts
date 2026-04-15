// ============================================
// FILE: src/demo/voice/subtitleEngine.ts
// PURPOSE: Word-by-word cinematic subtitle timing engine
// No external deps — pure timing math
// ============================================

import type { SubtitleWord, SubtitleLine, SilenceFill, SilenceFillType, SilenceAnimation } from './types';

type WordCallback   = (word: string, index: number) => void;
type LineCallback   = (line: SubtitleLine) => void;
type SilenceStartCb = (fill: SilenceFill) => void;
type SilenceEndCb   = () => void;

// Average speaking rate: ~150 wpm = 2.5 words/sec = 400ms/word
const BASE_MS_PER_CHAR = 55; // ms per character (accounts for word length variance)
const PAUSE_AFTER_SENTENCE_MS = 220;
const PAUSE_AFTER_COMMA_MS    = 120;

class SubtitleEngine {
  private rafId: number | null = null;
  private onWordCb:   WordCallback   | null = null;
  private onLineCb:   LineCallback   | null = null;
  private onSilStart: SilenceStartCb | null = null;
  private onSilEnd:   SilenceEndCb   | null = null;
  private currentWordIdx = -1;

  // ── Timing generation ──────────────────────────────────────────────────────

  generateWordTimings(text: string, totalDurationMs: number): SubtitleWord[] {
    const words = text.trim().split(/\s+/);
    if (words.length === 0) return [];

    // Weight each word by character count for natural pacing
    const weights = words.map(w => Math.max(w.replace(/[^a-zA-Z0-9]/g, '').length, 1));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let cursor = 0;
    return words.map((word, i) => {
      const duration = (weights[i] / totalWeight) * totalDurationMs;
      const entry: SubtitleWord = { text: word, startMs: cursor, endMs: cursor + duration };
      cursor += duration;
      return entry;
    });
  }

  parseToLines(text: string, speedMultiplier = 1.0): SubtitleLine[] {
    // Split on sentence boundaries, keeping the delimiter
    const sentences = text
      .trim()
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0);

    const lines: SubtitleLine[] = [];
    let globalDelay = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const charCount = sentence.length;

      // Duration based on character count + speed
      const durationMs = (charCount * BASE_MS_PER_CHAR) / speedMultiplier;
      const words = this.generateWordTimings(sentence, durationMs);

      lines.push({
        id:           `line-${i}`,
        text:         sentence,
        words,
        durationMs,
        startDelayMs: globalDelay,
      });

      // Pause between sentences
      const endsWithComma = sentence.trimEnd().endsWith(',');
      globalDelay += durationMs + (endsWithComma ? PAUSE_AFTER_COMMA_MS : PAUSE_AFTER_SENTENCE_MS);
    }

    return lines;
  }

  // ── Playback ───────────────────────────────────────────────────────────────

  playLines(lines: SubtitleLine[], onProgress?: (pct: number) => void): void {
    this.stop();
    this.currentWordIdx = -1;

    const totalDuration = lines.reduce(
      (sum, l) => Math.max(sum, l.startDelayMs + l.durationMs),
      0,
    );

    let lineIdx = 0;
    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;

      // Advance to the correct line
      while (lineIdx < lines.length - 1 && elapsed >= lines[lineIdx + 1].startDelayMs) {
        lineIdx++;
        this.currentWordIdx = -1;
        this.onLineCb?.(lines[lineIdx]);
      }

      const line = lines[lineIdx];
      if (!line) { this.stop(); return; }

      // Emit line on first tick for it
      if (lineIdx === 0 && elapsed < 50 && this.currentWordIdx === -1) {
        this.onLineCb?.(line);
      }

      const lineElapsed = elapsed - line.startDelayMs;

      // Find current word
      const wordIdx = line.words.findIndex(
        w => lineElapsed >= w.startMs && lineElapsed < w.endMs,
      );

      if (wordIdx !== -1 && wordIdx !== this.currentWordIdx) {
        this.currentWordIdx = wordIdx;
        this.onWordCb?.(line.words[wordIdx].text, wordIdx);
      }

      onProgress?.(Math.min(elapsed / totalDuration, 1));

      if (elapsed < totalDuration) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.stop();
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  handleSilence(durationMs: number, type: SilenceFillType = 'ambient'): void {
    const fill: SilenceFill = {
      type,
      durationMs,
      animation: this.animationFor(type),
    };
    this.onSilStart?.(fill);
    setTimeout(() => this.onSilEnd?.(), durationMs);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.currentWordIdx = -1;
  }

  // ── Event subscriptions ────────────────────────────────────────────────────

  onWord(cb: WordCallback):   void { this.onWordCb   = cb; }
  onLine(cb: LineCallback):   void { this.onLineCb   = cb; }
  onSilenceStart(cb: SilenceStartCb): void { this.onSilStart = cb; }
  onSilenceEnd(cb: SilenceEndCb):     void { this.onSilEnd   = cb; }

  private animationFor(type: SilenceFillType): SilenceAnimation {
    const map: Record<SilenceFillType, SilenceAnimation> = {
      thinking:   'pulse',
      processing: 'dots',
      loading:    'wave',
      ambient:    'typing',
    };
    return map[type];
  }
}

// Singleton
export const subtitleEngine = new SubtitleEngine();
