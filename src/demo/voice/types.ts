// ============================================
// FILE: src/demo/voice/types.ts
// PURPOSE: Shared types for the entire voice system
// Kokoro removed — ElevenLabs and Groq only.
// ============================================

export type NarratorProvider = 'elevenlabs' | 'groq';

export type NarratorStatus =
  | 'idle'
  | 'loading'
  | 'speaking'
  | 'paused'
  | 'error'
  | 'unavailable';

export type SilenceFillType = 'thinking' | 'processing' | 'loading' | 'ambient';
export type SilenceAnimation = 'pulse' | 'wave' | 'dots' | 'typing';

export interface NarratorConfig {
  provider: NarratorProvider;
  // ElevenLabs
  elevenLabsApiKey:  string;
  elevenLabsVoiceId: string;
  elevenLabsModel:   string;
  // Groq TTS
  groqApiKey: string;
  groqVoice:  string;
  // Shared
  volume:           number;
  muted:            boolean;
  subtitlesEnabled: boolean;
  subtitleFontSize: 'sm' | 'md' | 'lg';
  // Ambience
  ambienceEnabled:  boolean;
  ambienceVolume:   number;
  ambienceUrl:      string;
}

export interface SubtitleWord {
  text:    string;
  startMs: number;
  endMs:   number;
}

export interface SubtitleLine {
  id:           string;
  text:         string;
  words:        SubtitleWord[];
  durationMs:   number;
  startDelayMs: number;
}

export interface SilenceFill {
  type:       SilenceFillType;
  durationMs: number;
  animation:  SilenceAnimation;
}

export interface SpeakOptions {
  provider?: NarratorProvider;
  onWord?:   (word: string, index: number) => void;
  onDone?:   () => void;
  onError?:  (err: Error) => void;
}

export interface NarratorTestResult {
  provider:  NarratorProvider;
  success:   boolean;
  latencyMs: number;
  error?:    string;
}

// Persisted to localStorage
export const DEFAULT_NARRATOR_CONFIG: NarratorConfig = {
  provider:          'elevenlabs',
  elevenLabsApiKey:  '',
  elevenLabsVoiceId: '',
  elevenLabsModel:   'eleven_turbo_v2_5',
  groqApiKey:        '',
  groqVoice:         'autumn',
  volume:            0.9,
  muted:             false,
  subtitlesEnabled:  true,
  subtitleFontSize:  'md',
  ambienceEnabled:   false,
  ambienceVolume:    0.15,
  ambienceUrl:       '/audio/ambience/oosongoo-background-music-224633.mp3',
};

export const GROQ_TTS_VOICES = [
  { id: 'autumn', label: 'Autumn (Female, Warm)'      },
  { id: 'diana',  label: 'Diana (Female, Clear)'      },
  { id: 'hannah', label: 'Hannah (Female, Soft)'      },
  { id: 'austin', label: 'Austin (Male, Confident)'   },
  { id: 'daniel', label: 'Daniel (Male, Deep)'        },
  { id: 'troy',   label: 'Troy (Male, Authoritative)' },
] as const;
