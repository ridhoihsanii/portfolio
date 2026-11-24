const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cv = fs.readFileSync(path.join(root, 'assets', 'cv.html'), 'utf8');
const projects = index.match(
  /<section class="section section-alt" id="projects">([\s\S]*?)<\/section>/
)?.[1];

test('CV distinguishes internal work from the personal Rack n Roll project', () => {
  assert.match(cv, /Personal &amp; Professional Projects/);
  assert.match(cv, /Timesheet Automation Tool/);
  assert.match(cv, /Professional Project\s*[·|—]\s*Internal Tool/);
  assert.match(cv, /Rack n Roll/);
  assert.match(cv, /Personal Project\s*[·|—]\s*Billiards Tournament Organizer/);
  assert.match(cv, /href="https:\/\/ridhoihsanii\.github\.io\/racknroll\/"/);
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

test('CV offers an on-screen download of the updated PDF but hides the control in print', () => {
  const toolbar = cv.match(/<div class="cv-toolbar">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(toolbar, 'the CV toolbar should exist');
  assert.match(toolbar, /href="cv-rabbani-ridho-ihsani\.pdf\?v=\d{8}"/);
  assert.match(toolbar, /download="Rabbani-Ridho-Ihsani-CV\.pdf"/);
  assert.match(toolbar, />Download PDF</);
  assert.match(cv, /@page\s*\{\s*size:\s*A4;\s*margin:\s*0;\s*\}/);
  assert.match(cv, /@media print\s*\{[\s\S]*?\.cv-toolbar\s*\{\s*display:\s*none;/);
});
