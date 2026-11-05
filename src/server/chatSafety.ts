export type CapturedLead = {
  name?: string;
  phone?: string;
  serviceRequired?: string;
  location?: string;
  budget?: string;
};

export function extractLeadFromReply(rawText: string): {
  reply: string;
  extractedLead: CapturedLead | null;
} {
  const markerPattern = /<<<LEAD_CAPTURED:([\s\S]*?)>>>/;
  const match = rawText.match(markerPattern);
  if (!match) return { reply: rawText, extractedLead: null };

  const reply = rawText.replace(markerPattern, '').trim();
  const fieldLimits: Record<keyof CapturedLead, number> = {
    name: 100,
    phone: 32,
    serviceRequired: 160,
    location: 160,
    budget: 80,
  };

  let extractedLead: CapturedLead | null = null;
  try {
    const parsed: unknown = JSON.parse(match[1]);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const candidate = parsed as Record<string, unknown>;
      const safeLead: CapturedLead = {};

      for (const [field, maxLength] of Object.entries(fieldLimits) as Array<
        [keyof CapturedLead, number]
      >) {
        const value = candidate[field];
        if (typeof value === 'string' && value.trim()) {
          safeLead[field] = value.trim().slice(0, maxLength);
        }
      }

      if (Object.keys(safeLead).length > 0) extractedLead = safeLead;
    }
  } catch {
    // Ignore malformed model-generated lead data.
  }

  return { reply, extractedLead };
}


/**
 * Public chatbot replies must never expose bank-transfer credentials.
 * If a response resembles an account/IFSC/UPI instruction, replace the
 * complete reply rather than attempting partial redaction.
 */
export function sanitizePublicChatReply(reply: string): string {
  const bankDetailPatterns = [
    /\bIFSC\b\s*(?:code)?\s*[:#-]?\s*[A-Z]{4}0[A-Z0-9]{6}\b/i,
    /\b(?:bank\s*)?(?:account|a\/c)\s*(?:number|no\.?|#)?\s*[:#-]?\s*[0-9][0-9\s-]{7,20}\b/i,
    /\b(?:NEFT|RTGS|IMPS)\b.{0,80}\b(?:account|a\/c|IFSC|beneficiary)\b/i,
    /\b(?:NEFT|RTGS|IMPS)\b.{0,80}\b\d[\d\s-]{7,20}\b/i,
    /\b(?:UPI|VPA)\s*(?:ID|address)?\s*[:#-]?\s*[A-Z0-9._-]{2,}@[A-Z0-9.-]{2,}\b/i,
    /\b[\w.-]{2,}@(okaxis|okhdfcbank|oksbi|okicici|ybl|ibl|paytm|upi|apl|axl|hdfcbank|sbi|icici|axisbank|kotak|okbizaxis|okbizicici|fbl|yesbank|barodampay|freecharge|airtel|jio|slice)\b/i,
    /\b(?:beneficiary|bank transfer details|payment credentials)\b.{0,100}\b(?:\d{8,}|IFSC|UPI)\b/i,
  ];

  if (bankDetailPatterns.some((pattern) => pattern.test(reply))) {
    return 'For your security, I cannot provide bank-transfer details in this chat. Please request verified payment instructions through the official KlickKar helpline or an official itemized invoice.';
  }

  return reply;
}
