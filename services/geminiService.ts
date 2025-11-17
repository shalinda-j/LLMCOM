
import type { Domain, LlmcomGenerationResult } from "../types";
import { LLMCOM_ENCODE } from "./encoder";

export const generateLlmcomPrompt = async (prompt: string, domain: Domain, compressionLevel: number = 2): Promise<LlmcomGenerationResult> => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
        throw new Error("Prompt cannot be empty.");
    }

    try {
        // Use the comprehensive LLMCOM algorithm
        const result = await LLMCOM_ENCODE(trimmedPrompt, domain, compressionLevel);
        
        return {
            llmcom: result.llmcomFormat,
            originalTokens: result.originalTokens,
            compressedTokens: result.compressedTokens,
            compressionRatio: result.compressionRatio,
            semanticEquivalence: result.semanticEquivalence,
            costSavings: result.costSavings,
            validation: result.validation,
            domain: result.domain,
            processingTimeMs: result.processingTimeMs
        };
    } catch (error) {
        console.error('LLMCOM encoding failed:', error);
        throw new Error('Failed to generate LLMCOM format. Please try again.');
    }
};
