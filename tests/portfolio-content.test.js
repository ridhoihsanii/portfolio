const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

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

test('Firebase likes increment and decrement without going below zero, even on delayed retries', () => {
  const callbacks = [];
  const listeners = {};
  const classes = { toggle() {}, add() {}, remove() {} };
  const button = {
    classList: classes,
    addEventListener(type, handler) { listeners[type] = handler; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; }
  };
  const count = { classList: classes, textContent: '' };
  const values = new Map();
  const context = {
    document: {
      addEventListener() {},
      getElementById(id) { return id === 'likeBtn' ? button : count; },
      createElement() { return { style: {}, addEventListener() {} }; },
      body: { appendChild() {} }
    },
    localStorage: {
      getItem(key) { return values.get(key) || null; },
      setItem(key, value) { values.set(key, value); }
    },
    window: { _firebaseDB: { ref() { return {
      on(type, handler) { handler({ val: () => 0 }); },
      transaction(handler) { callbacks.push(handler); }
    }; } } }
  };
  vm.createContext(context);
  vm.runInContext(script, context);
  context.initLikeButton();
  listeners.click();
  listeners.click();
  assert.equal(callbacks[0](0), 1, 'a retried like must retain its increment');
  assert.equal(callbacks[1](1), 0, 'unliking must decrement the global counter');
  assert.equal(callbacks[1](0), 0, 'the counter must not become negative');
});

test('case studies and Rack n Roll describe verified work and technologies', () => {
  assert.match(index, /Backend Case Studies/);
  assert.match(index, /Problem:[\s\S]*?Solution:[\s\S]*?Result:/);
  assert.match(projects, /Rack n Roll[\s\S]*?React[\s\S]*?Firebase/);
  assert.doesNotMatch(projects, /Source code\s+and live demonstrations are not public/i);
});

test('CV and portfolio identify the Rack n Roll organizer and describe its technology', () => {
  for (const document of [cv, projects]) {
    assert.match(document, /organizer[^<]*@rnr\.intan/i);
    assert.match(document, /Rack n Roll[\s\S]*?React[\s\S]*?Firebase/i);
    assert.match(document, /Rack n Roll[\s\S]*?(?:Excel\/PDF|Excel and PDF)/i);
  }
});

test('CV print body and skill tags use readable text sizes', () => {
  assert.match(cv, /@media print\s*\{[\s\S]*?\.summary-text,\s*\.exp-bullets li,\s*\.project-desc,[\s\S]*?\{\s*font-size:\s*11pt;/);
  assert.match(cv, /\.skill-tag\s*\{\s*font-size:\s*9pt;\s*\}/);
});

test('CV mobile body text remains readable', () => {
  const mobileRules = cv.slice(cv.indexOf('@media screen and (max-width: 700px)'));
  assert.match(mobileRules, /\.exp-bullets li,\s*\.project-desc,\s*\.summary-text,\s*\.edu-note\s*\{\s*font-size:\s*1rem;/);
});

test('portfolio does not mislabel the Timesheet Automation repository as private', () => {
  assert.doesNotMatch(projects, /title="Private repository"/);
});

test('language selector offers English and Indonesian beside the theme control', () => {
  const nav = index.match(/<div class="nav-actions">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(nav);
  assert.match(nav, /id="themeToggle"[\s\S]*?id="languageSelector"/);
  assert.match(nav, /<option value="en">English<\/option>/);
  assert.match(nav, /<option value="id">Indonesia<\/option>/);
});

test('translations support portfolio, CV and interactive content', () => {
  const file = path.join(root, 'i18n.js');
  assert.ok(fs.existsSync(file), 'translation module should exist');
  const { translate, pdfForLanguage, resolveLanguage } = require(file);
  assert.equal(translate('About Me', 'id'), 'Tentang Saya');
  assert.equal(translate('Download PDF', 'id'), 'Unduh PDF');
  assert.equal(translate('Shared!', 'id'), 'Dibagikan!');
  assert.equal(translate('About Me', 'en'), 'About Me');
  assert.equal(translate('Spring Boot', 'id'), 'Spring Boot');
  assert.equal(resolveLanguage('id'), 'id');
  assert.equal(resolveLanguage('unexpected'), 'en');
  assert.match(pdfForLanguage('id'), /-id\.pdf/);
  assert.match(pdfForLanguage('en'), /ihsani\.pdf/);
});
