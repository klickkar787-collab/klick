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
