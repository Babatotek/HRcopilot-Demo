// ============================================
// FILE: src/demo/walkthroughs/useModuleWalkthrough.ts
// PURPOSE: Hook that wires Joyride to the demo orchestrator.
//   - Returns steps + run state for the current module
//   - Speaks narration on each step via Quen
//   - Advances the orchestrator when the walkthrough completes
// ============================================

import { useState, useCallback, useEffect } from 'react';
import type { CallBackProps, Status } from 'react-joyride';
import { EVENTS, STATUS } from 'react-joyride';
import { MODULE_WALKTHROUGHS } from './index';
import { useDemoOrchestrator } from '../orchestrator/demoOrchestrator';
import { useOnboardingStore } from '../onboarding/onboardingStore';
import { resolveNarration } from '../orchestrator/guidedFlow';
import { GUIDED_FLOW } from '../orchestrator/guidedFlow';
import { speak } from '../voice/narrationEngine';
import { primeAudioContext } from '../voice/narrationEngine';

export function useModuleWalkthrough(moduleKey: string) {
  const { mode, status, stepIndex, nextStep, completeStep } = useDemoOrchestrator();
  const { role } = useOnboardingStore();

  const steps    = MODULE_WALKTHROUGHS[moduleKey] ?? [];
  const [run, setRun]           = useState(false);
  const [joyrideIndex, setJoyrideIndex] = useState(0);

  // Auto-start walkthrough when guided demo reaches this module
  // Only in sandbox mode — guided mode uses GuidedFlowRunner instead
  useEffect(() => {
    if (mode !== 'sandbox' || status !== 'running') return;
    const currentFlowStep = GUIDED_FLOW[stepIndex];
    if (currentFlowStep?.module === moduleKey && steps.length > 0) {
      setJoyrideIndex(0);
      setRun(true);
    }
  }, [mode, status, stepIndex, moduleKey, steps.length]);

  // Joyride callback
  const handleCallback = useCallback((data: CallBackProps) => {
    const { type, index, status: joyrideStatus } = data;

    // Speak narration when a step becomes active (STEP_BEFORE = step is shown)
    if (type === EVENTS.STEP_BEFORE) {
      const step = steps[index];
      if (step?.narrationKey) {
        const flowStep = GUIDED_FLOW.find((s) => s.narrationKey === step.narrationKey);
        if (flowStep) {
          const text = resolveNarration(flowStep, role);
          if (text) {
            primeAudioContext();
            speak(text, { scriptId: step.narrationKey }).catch(() => {});
          }
        }
      }
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setJoyrideIndex(index + 1);
    }

    // Walkthrough finished or skipped
    if (
      (joyrideStatus as Status) === STATUS.FINISHED ||
      (joyrideStatus as Status) === STATUS.SKIPPED
    ) {
      setRun(false);
      const flowStep = GUIDED_FLOW[stepIndex];
      if (flowStep) completeStep(flowStep.id);
      nextStep();
    }
  }, [steps, role, stepIndex, completeStep, nextStep]);

  // Manual trigger (sandbox mode — user clicks "Show walkthrough")
  const startWalkthrough = useCallback(() => {
    setJoyrideIndex(0);
    setRun(true);
  }, []);

  const stopWalkthrough = useCallback(() => {
    setRun(false);
  }, []);

  return {
    steps,
    run,
    stepIndex:          joyrideIndex,
    handleCallback,
    startWalkthrough,
    stopWalkthrough,
    hasWalkthrough:     steps.length > 0,
  };
}
