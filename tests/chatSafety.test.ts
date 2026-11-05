import assert from 'node:assert/strict';
import test from 'node:test';
import { extractLeadFromReply } from '../src/server/chatSafety.ts';

test('extracts only allowed string lead fields and trims values', () => {
  const result = extractLeadFromReply(
    'Thanks!\n<<<LEAD_CAPTURED:{"name":"  Asha  ","phone":" 9876543210 ","extra":"ignore"}>>>'
  );

  assert.equal(result.reply, 'Thanks!');
  assert.deepEqual(result.extractedLead, { name: 'Asha', phone: '9876543210' });
});

test('limits model-generated lead field lengths', () => {
  const longName = 'N'.repeat(140);
  const result = extractLeadFromReply(
    `<<<LEAD_CAPTURED:${JSON.stringify({ name: longName })}>>>`
  );

  assert.equal(result.reply, '');
  assert.equal(result.extractedLead?.name?.length, 100);
});

test('ignores non-object and malformed lead payloads but strips internal markup', () => {
  const arrayResult = extractLeadFromReply('Reply <<<LEAD_CAPTURED:["not","an","object"]>>>');
  const malformedResult = extractLeadFromReply('Reply <<<LEAD_CAPTURED:{bad json}>>>');

  assert.equal(arrayResult.reply, 'Reply');
  assert.equal(arrayResult.extractedLead, null);
  assert.equal(malformedResult.reply, 'Reply');
  assert.equal(malformedResult.extractedLead, null);
});

test('preserves ordinary replies without a lead marker', () => {
  const result = extractLeadFromReply('Namaste! How can we help?');

  assert.equal(result.reply, 'Namaste! How can we help?');
  assert.equal(result.extractedLead, null);
});


test('replaces replies containing IFSC codes with safe payment guidance', async () => {
  const { sanitizePublicChatReply } = await import('../src/server/chatSafety.ts');
  const result = sanitizePublicChatReply('Transfer to IFSC: ABCD0123456 for payment.');
  assert.match(result, /cannot provide bank-transfer details/i);
  assert.doesNotMatch(result, /ABCD0123456/);
});

test('replaces replies containing bank account or UPI details', async () => {
  const { sanitizePublicChatReply } = await import('../src/server/chatSafety.ts');
  const accountResult = sanitizePublicChatReply('Bank account number: 123456789012');
  const upiResult = sanitizePublicChatReply('Pay using klickkar@okaxis');
  assert.match(accountResult, /cannot provide bank-transfer details/i);
  assert.match(upiResult, /cannot provide bank-transfer details/i);
});

test('preserves ordinary phone and service replies', async () => {
  const { sanitizePublicChatReply } = await import('../src/server/chatSafety.ts');
  const reply = 'Call our helpline at +91 96546 10640 for a site inspection.';
  assert.equal(sanitizePublicChatReply(reply), reply);
});


test('also blocks bank details hidden inside the model lead-capture payload', async () => {
  const { sanitizePublicChatReply } = await import('../src/server/chatSafety.ts');
  const rawOutput = 'Thanks! <<<LEAD_CAPTURED:{"name":"Customer","location":"IFSC ABCD0123456"}>>>';
  const safeOutput = sanitizePublicChatReply(rawOutput);
  const parsed = extractLeadFromReply(safeOutput);
  assert.match(parsed.reply, /cannot provide bank-transfer details/i);
  assert.equal(parsed.extractedLead, null);
});
