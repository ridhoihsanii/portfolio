const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cv = fs.readFileSync(path.join(root, 'assets', 'cv.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const projects = index.match(
  /<section class="section section-alt" id="projects">([\s\S]*?)<\/section>/
)?.[1];

test('CV distinguishes internal work from the personal Rack n Roll project', () => {
  assert.match(cv, /Personal &amp; Professional Projects/);
  assert.match(cv, /Timesheet Automation Tool/);
  assert.match(cv, /Professional Project\s*[·|—]\s*Internal Tool/);
  assert.match(cv, /Rack n Roll/);
  assert.match(cv, /Personal Project\s*[·|—]\s*Billiards Tournament Organizer/);
  assert.match(cv, /participant.{0,30}payment|payment.{0,30}participant/i);
  assert.match(cv, /tournament brackets/i);
});

test('portfolio includes a linked Rack n Roll card with verified features', () => {
  assert.ok(projects, 'the portfolio Projects section should exist');
  assert.match(projects, /Rack n Roll/);
  assert.match(projects, /href="https:\/\/ridhoihsanii\.github\.io\/racknroll\/"/);
  assert.match(projects, /target="_blank"\s+rel="noopener"/);
  assert.match(projects, /tournament setup/i);
  assert.match(projects, /participant.{0,30}payment|payment.{0,30}participant/i);
  assert.match(projects, /tournament brackets/i);
});

test('CV header offers the only navigation action as a PDF download', () => {
  const body = cv.match(/<body>([\s\S]*?)<\/body>/)?.[1];
  const header = body?.match(/<header class="cv-header">([\s\S]*?)<\/header>/)?.[1];
  assert.ok(header, 'the CV header should exist');
  const links = [...body.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
  assert.equal(links.length, 1, 'only the download link should be present');
  assert.ok(header.includes(links[0][0]), 'the download link should be inside the header');
  assert.match(links[0][0], /href="cv-rabbani-ridho-ihsani\.pdf\?v=\d+"/);
  assert.match(links[0][0], /download="Rabbani-Ridho-Ihsani-CV\.pdf"/);
  assert.match(links[0][0], />Download PDF</);
  assert.doesNotMatch(body, /cv-toolbar|Open Rack n Roll/);
});

test('CV print layout uses A4 and hides the download control', () => {
  assert.match(cv, /@page\s*\{\s*size:\s*A4;\s*margin:\s*0;\s*\}/);
  assert.match(cv, /@media print\s*\{[\s\S]*?\.download-button\s*\{\s*display:\s*none;/);
});

test('portfolio and CV show the approved performance achievements', () => {
  for (const document of [index, cv]) {
    assert.match(document, /800\s*ms[\s\S]*?250\s*ms/i);
    assert.match(document, /Redis locks?[\s\S]*?duplicate processing/i);
    assert.match(document, /5[–-]10 minutes[\s\S]*?1[–-]2 minutes/i);
    assert.match(document, /Redis Queue/i);
    assert.match(document, /Kafka[\s\S]*?topics/i);
  }
});

test('mobile menu communicates its state and game iframe has a title', () => {
  assert.match(index, /id="hamburger"[^>]*aria-controls="navLinks"[^>]*aria-expanded="false"/);
  assert.match(index, /<iframe[^>]+title="Dino Game"/);
  assert.match(script, /setAttribute\('aria-expanded'/);
});

test('portfolio initializes even if the animation library is unavailable', () => {
  assert.match(script, /typeof AOS\s*!==?\s*['"]undefined['"]/);
});

test('hero role cycler starts with something that can be built', () => {
  assert.doesNotMatch(index, /<span class="role-cycler"[^>]*>Java Backend Engineer<\/span>/);
});
