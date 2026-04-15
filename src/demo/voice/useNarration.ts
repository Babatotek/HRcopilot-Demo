// ============================================
// FILE: src/demo/voice/useNarration.ts
// PURPOSE: React hook — speak, stop, status
// ============================================

import { useCallback } from 'react';
import { speak, stop, isSpeaking } from './narrationEngine';
import { useNarratorStore } from './narratorStore';
import type { SpeakOptions, NarratorProvider } from './types';

export function useNarration() {
  const store = useNarratorStore();

  const narrate = useCallback(
    (text: string, opts?: SpeakOptions) => speak(text, opts),
    [],
  );

  const stopNarration = useCallback(() => stop(), []);

  const setProvider = useCallback(
    (p: NarratorProvider) => store.setProvider(p),
    [store],
  );

  const toggleMute = useCallback(
    () => store.updateConfig({ muted: !store.muted }),
    [store],
  );

  const openAdminPanel  = useCallback(() => store.openAdminPanel(),  [store]);
  const closeAdminPanel = useCallback(() => store.closeAdminPanel(), [store]);

  return {
    narrate,
    stop:           stopNarration,
    status:         store.status,
    isSpeaking:     isSpeaking(),
    currentWord:    store.currentWord,
    currentText:    store.currentText,
    provider:       store.provider,
    muted:          store.muted,
    volume:         store.volume,
    setProvider,
    toggleMute,
    openAdminPanel,
    closeAdminPanel,
    adminPanelOpen: store.adminPanelOpen,
  };
}
