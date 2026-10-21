import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchesProjectCategory,
  filterProjectsByCategory,
  validateContactForm,
  formatContactSummary,
  buildMailtoHref,
  getProjectPreviewData,
  calculateScrollProgress,
} from './script.js';

test('matchesProjectCategory matches "all" and specific categories', () => {
  assert.equal(matchesProjectCategory(['html-css', 'responsive'], 'all'), true);
  assert.equal(matchesProjectCategory(['html-css', 'responsive'], 'html-css'), true);
  assert.equal(matchesProjectCategory(['html-css', 'responsive'], 'javascript'), false);
});

test('filterProjectsByCategory returns matching project subset', () => {
  const sampleProjects = [
    { id: 'p1', categories: ['html-css', 'responsive'] },
    { id: 'p2', categories: ['javascript', 'responsive'] },
    { id: 'p3', categories: ['html-css', 'javascript', 'responsive'] },
  ];

  assert.equal(filterProjectsByCategory(sampleProjects, 'all').length, 3);
  assert.equal(filterProjectsByCategory(sampleProjects, 'html-css').length, 2);
  assert.equal(filterProjectsByCategory(sampleProjects, 'javascript').length, 2);
  assert.equal(filterProjectsByCategory(sampleProjects, 'responsive').length, 3);
});

test('validateContactForm rejects empty or invalid inputs and accepts valid data', () => {
  const emptyCheck = validateContactForm({ name: '', email: '', message: '' });
  assert.equal(emptyCheck.valid, false);
  assert.ok(emptyCheck.errors.name);
  assert.ok(emptyCheck.errors.email);
  assert.ok(emptyCheck.errors.message);

  const badEmailCheck = validateContactForm({
    name: 'Alex',
    email: 'invalid-email',
    message: 'Hello, I would like to connect about a frontend role.',
  });
  assert.equal(badEmailCheck.valid, false);
  assert.ok(badEmailCheck.errors.email);

  const validCheck = validateContactForm({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    message: 'Hello, I reviewed your portfolio and would love to talk.',
  });
  assert.equal(validCheck.valid, true);
  assert.equal(Object.keys(validCheck.errors).length, 0);
});

test('formatContactSummary and buildMailtoHref produce structured output', () => {
  const payload = {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    subject: 'Frontend Role',
    message: 'Looking forward to speaking with you.',
  };

  const summary = formatContactSummary(payload);
  assert.match(summary, /From: Alex Rivera <alex@example\.com>/);
  assert.match(summary, /Subject: Frontend Role/);
  assert.match(summary, /Looking forward to speaking with you\./);

  const mailto = buildMailtoHref('dev@example.com', payload);
  assert.ok(mailto.startsWith('mailto:dev@example.com?subject=Frontend%20Role&body='));
});

test('getProjectPreviewData returns matching project or default fallback', () => {
  const p2 = getProjectPreviewData('project-2');
  assert.equal(p2.id, 'project-2');
  assert.equal(p2.demoType, 'stem-mixer');

  const fallback = getProjectPreviewData('unknown-id');
  assert.equal(fallback.id, 'project-1');
});

test('calculateScrollProgress computes clamped ratio and percentage accurately', () => {
  assert.deepEqual(calculateScrollProgress(0, 2900, 900), { ratio: 0, percent: 0 });
  assert.deepEqual(calculateScrollProgress(1000, 2900, 900), { ratio: 0.5, percent: 50 });
  assert.deepEqual(calculateScrollProgress(2000, 2900, 900), { ratio: 1, percent: 100 });
  // Edge cases: overscroll, negative scroll, and non-scrollable page
  assert.deepEqual(calculateScrollProgress(2500, 2900, 900), { ratio: 1, percent: 100 });
  assert.deepEqual(calculateScrollProgress(-50, 2900, 900), { ratio: 0, percent: 0 });
  assert.deepEqual(calculateScrollProgress(0, 900, 900), { ratio: 0, percent: 0 });
});

