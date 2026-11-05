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
