/**
 * src/lib/ai.ts
 * Central AI client initializer for HR360.
 *
 * Active services:
 *   • Groq       — primary LLM (llama-3.3-70b-versatile, fast inference)
 *   • ElevenLabs — neural voice synthesis
 *
 * Gemini is disabled (quota exceeded). Clients are null-safe:
 * every service falls back to mock data when no key is present.
 */

import Groq from 'groq-sdk';

// ─── Config ───────────────────────────────────────────────────────────────────

const GROQ_KEY        = import.meta.env.VITE_GROQ_API_KEY        as string | undefined;
export const ELEVENLABS_KEY      = import.meta.env.VITE_ELEVENLABS_API_KEY  as string | undefined;
export const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined;

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

function isValidKey(key: string | undefined): boolean {
  return !!key && !key.startsWith('your_') && key.length > 10;
}

// ─── Groq client (singleton) ──────────────────────────────────────────────────

let _groqClient: Groq | null = null;

export function getGroqClient(): Groq | null {
  if (!isValidKey(GROQ_KEY)) return null;
  if (!_groqClient) {
    _groqClient = new Groq({ apiKey: GROQ_KEY!, dangerouslyAllowBrowser: true });
  }
  return _groqClient;
}

// ─── Shared chat helper ───────────────────────────────────────────────────────

/**
 * Single-turn Groq chat completion.
 * Returns '' (empty string) if no API key is configured — callers use their own fallback.
 */
export async function groqChat(
  systemPrompt: string,
  userMessage:  string,
  maxTokens = 512,
): Promise<string> {
  const client = getGroqClient();
  if (!client) return '';

  const res = await client.chat.completions.create({
    model:       GROQ_MODEL,
    temperature: 0.4,
    max_tokens:  maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  },
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Multi-turn Groq chat completion (for the AI Advisor chat).
 */
export async function groqChatMultiTurn(
  systemPrompt: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  maxTokens = 700,
): Promise<string> {
  const client = getGroqClient();
  if (!client) return '';

  const res = await client.chat.completions.create({
    model:       GROQ_MODEL,
    temperature: 0.5,
    max_tokens:  maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? '';
}

/** Safely parse the first JSON object or array found in an LLM response. */
export function safeParse<T>(text: string, fallback: T): T {
  try {
    const objMatch = text.match(/\{[\s\S]*\}/);
    const arrMatch = text.match(/\[[\s\S]*\]/);
    const raw      = objMatch?.[0] ?? arrMatch?.[0];
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
