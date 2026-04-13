/**
 * services/geminiService.ts
 * ⚠️  Gemini is DISABLED — quota exceeded and 1.5-flash returns 404.
 *
 * This file is a compatibility shim. All functions are powered by Groq.
 * Existing imports across the codebase (Cabinet, CRM, Finance, Goals,
 * Performance, Procurement, AIAdvisorModal, FormBuilder) continue to work
 * without modification.
 */

export {
  extractDocumentMetadata,
  scoreDeal,
  categorizeTransaction,
  suggestKeyResults,
  summarizePerformance,
  extractContractTerms,
  generateHRAssistantResponse,
  generateFormTemplate,
} from './groqService';

export type {
  DocumentMetadata,
  DealScore,
  TransactionCategory,
  SuggestedKeyResult,
  PerformanceSummary,
  ContractTerms,
  GeneratedFormTemplate,
} from './groqService';
