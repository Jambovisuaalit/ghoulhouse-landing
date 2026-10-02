import test from 'node:test';
import assert from 'node:assert/strict';
import { LeadStorageError, storeLead } from '../src/lib/lead-storage.ts';

const lead = {
  intent: 'photos',
  service: 'social',
  company: 'QA Oy',
  name: 'QA',
  email: 'qa@example.com',
  profile: 'Ei vielä verkkosivua tai Instagramia',
  noProfile: true,
  phone: '',
  website: '',
  instagram: '',
  message: 'timeout-test',
};

test('lead storage converts an upstream timeout into a typed failure', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const error = new Error('timed out');
    error.name = 'TimeoutError';
    throw error;
  };

  try {
    await assert.rejects(
      () => storeLead(lead),
      (error) => error instanceof LeadStorageError && error.code === 'storage_timeout'
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
