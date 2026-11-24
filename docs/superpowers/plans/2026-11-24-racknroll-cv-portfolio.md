# Rack n Roll CV and Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Distinguish the existing internal tool from personal projects, add Rack n Roll to the CV and portfolio, and let visitors download the updated CV as a PDF.

**Architecture:** Keep the existing static HTML/CSS structure. Add a Rack n Roll project card to the current portfolio Projects section, update the CV projects section with explicit ownership labels, and add an on-screen PDF download toolbar before the CV page. Use Node's built-in test runner to check links, copy, and print-only behavior without introducing dependencies.

**Tech Stack:** Static HTML, inline CSS in `assets/cv.html`, Node.js built-in `node:test`.

## Global Constraints

- Keep the portfolio's existing Projects section and existing cards.
- Keep Timesheet Automation Tool labeled as an internal professional project.
- Label Rack n Roll as a personal project for a billiards tournament organizer.
- Describe only verified features: tournament setup, participant and payment tracking, and brackets.
- Do not list technologies until they are verified.
- Link Rack n Roll to `https://ridhoihsanii.github.io/racknroll/`.
- Regenerate the CV PDF from the updated HTML so the downloadable file includes Rack n Roll.
- The CV's `Download PDF` control must save the regenerated PDF and stay hidden when printing.
- Preserve the mobile layout and CV's A4 print behavior.
- Add cache-version query parameters to stylesheet, CV HTML, and PDF links to avoid stale assets.

---

### Task 1: Add regression tests for Rack n Roll and CV download

**Files:**
- Create: `tests/portfolio-content.test.js`
- Test: `tests/portfolio-content.test.js`

**Interfaces:**
- Consumes: `index.html`, `assets/cv.html`, and the existing PDF asset.
- Produces: Regression tests runnable with `node --test tests/portfolio-content.test.js`.

- [ ] **Step 1: Write tests for the approved visible content and links**

Create `tests/portfolio-content.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests and confirm they fail for missing requested content**

Run: `node --test tests/portfolio-content.test.js`

Expected: The tests fail because the CV still says `Key Projects`, Rack n Roll is absent from both pages, and the CV has no PDF toolbar.

### Task 2: Update CV and portfolio content

**Files:**
- Modify: `assets/cv.html`
- Modify: `index.html`
- Test: `tests/portfolio-content.test.js`

**Interfaces:**
- Consumes: The project facts and labels listed in the global constraints.
- Produces: CV and portfolio links to Rack n Roll, plus a downloadable PDF that includes the new project.

- [ ] **Step 1: Update the CV project section**

In `assets/cv.html`, rename its heading to `Personal &amp; Professional Projects`; label Timesheet Automation Tool `Professional Project · Internal Tool`; then add a Rack n Roll `.project-item` with the title `Rack n Roll`, label `Personal Project · Billiards Tournament Organizer`, the verified project description, and an external link to `https://ridhoihsanii.github.io/racknroll/`.

- [ ] **Step 2: Add the CV download toolbar**

Place this before the `.page` element in `assets/cv.html`:

```html
<div class="cv-toolbar">
  <a
    class="download-button"
    href="cv-rabbani-ridho-ihsani.pdf?v=20261124"
    download="Rabbani-Ridho-Ihsani-CV.pdf"
  >Download PDF</a>
</div>
```

Add a visible, keyboard-focusable style for `.download-button`; keep the toolbar outside the A4 `.page`; add `@page { size: A4; margin: 0; }` and `.cv-toolbar { display: none; }` to the print rules.

- [ ] **Step 3: Regenerate and verify the updated CV PDF**

Run from the worktree root in PowerShell:

```powershell
$cvUrl = ([System.Uri](Resolve-Path assets\cv.html).Path).AbsoluteUri
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=assets\cv-rabbani-ridho-ihsani.pdf $cvUrl
if ($LASTEXITCODE -ne 0) { throw 'Chrome failed to render the updated CV PDF.' }
$pdfText = (& pdftotext assets\cv-rabbani-ridho-ihsani.pdf -) -join "`n"
if ($pdfText -notmatch 'Rack n Roll') { throw 'The generated PDF is missing Rack n Roll.' }
if ($pdfText -match 'Download PDF') { throw 'The screen-only download button leaked into print output.' }
```

Expected: Chrome exits successfully; extracted PDF text includes Rack n Roll and excludes the screen-only button.

- [ ] **Step 4: Add the Rack n Roll portfolio card**

In the existing `#projects` section in `index.html`, add a card using the established `.project-card` structure. Identify it as a personal project, link its title/demo action to `https://ridhoihsanii.github.io/racknroll/` with `target="_blank"` and `rel="noopener"`, and describe only setup, participant/payment tracking, and bracket features. Do not add a technology stack.

- [ ] **Step 5: Run the focused regression tests**

Run: `node --test tests/portfolio-content.test.js`

Expected: All three tests pass.

### Task 3: Verify static assets and responsive/print constraints

**Files:**
- Verify: `index.html`
- Verify: `style.css`
- Verify: `assets/cv.html`
- Verify: `assets/cv-rabbani-ridho-ihsani.pdf`

**Interfaces:**
- Consumes: The completed static pages and tests.
- Produces: A verified change set with no stale asset references or whitespace errors.

- [ ] **Step 1: Run all repository regression tests and syntax checks**

Run:

```powershell
node --test
node --check script.js
git diff --check
```

Expected: All tests pass; JavaScript syntax and whitespace checks report no errors.

- [ ] **Step 2: Verify the PDF link points to the existing asset**

Run:

```powershell
Test-Path assets\cv-rabbani-ridho-ihsani.pdf
```

Expected: `True`. The preceding PDF text-extraction check also confirms the new project's title is included.

- [ ] **Step 3: Commit the implementation**

```powershell
git add index.html assets\cv.html tests\mobile-cache-bust.test.js tests\portfolio-content.test.js
git commit -m "feat: add Rack n Roll to CV and portfolio" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
