# Mobile Hero Alignment and CV Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the portfolio hero centered and within the viewport on mobile, and update the public CV and related portfolio facts from the supplied PDF.

**Architecture:** Keep the static HTML/CSS/JavaScript site and existing HTML CV. Make a mobile-only hero CSS adjustment, update repeated profile facts in the main page and CV HTML, and replace the old PDF asset with the supplied PDF. Do not add a build system or test dependencies.

**Tech Stack:** HTML, CSS, vanilla JavaScript; Python's built-in HTTP server and installed headless Chrome for visual verification.

## Global Constraints

- The mobile hero fix must not alter unrelated sections or desktop styling.
- Use only facts supported by `CV_Rabbani_Ridho_Ihsani.pdf`; do not add claims.
- Keep existing site CV links opening the refreshed `assets/cv.html`.
- Preserve the CV page's existing responsive and print behavior.

---

### Task 1: Correct mobile hero alignment

**Files:**
- Modify: `style.css` (hero styles and the existing mobile media queries)

**Interfaces:**
- Consumes: Existing `.hero-container`, `.hero-text`, `.hero-photo-wrap`, `.hero-roles`, `.hero-desc`, `.hero-cta`, and `.hero-socials` elements.
- Produces: A centered, viewport-bounded hero at mobile widths; no changes to desktop layout.

- [x] **Step 1: Capture the failing mobile layout**

Serve the repository and inspect the hero at an explicit 375px iframe viewport with a temporary browser harness. The check fails before the CSS change, showing `.hero-container` extending to 465px and the description left-aligned.

```powershell
python -m http.server 8765
```

- [x] **Step 2: Apply a mobile-only width and alignment correction**

Within the existing `@media (max-width: 768px)` rules in `style.css`:

1. Make `.hero-container` and `.hero-text` explicitly fit their grid container (`width: 100%` and `min-width: 0` as needed).
2. Remove the large horizontal padding from `.hero-photo-wrap` at mobile widths while retaining vertical spacing; keep the photo ring centered and sized to fit narrow screens.
3. Center `.hero-desc` text, keep its maximum width at 100%, and allow long role text to wrap.
4. Ensure the hero CTA row can wrap and each button can shrink or occupy a centered row without causing horizontal overflow; keep socials centered.

Do not add global overflow clipping to hide the symptom.

- [x] **Step 3: Verify mobile and desktop layout**

Run a browser layout check at 320px, 375px, 596px, and 768px; each reports `PASS: hero fits and is centered`. Check the 1280px desktop layout for its original two-column grid and description alignment. Capture and inspect rendered screenshots at 375px, 596px, and 1280px with a temporary Chrome DevTools Protocol harness; remove the harness and screenshot artifacts after verification.

Pass criteria: all hero content is visible and centered at mobile widths, the photo fits, no horizontal content is cut off, and the desktop composition remains unchanged.

- [x] **Step 4: Check the CSS diff**

Run:

```powershell
git diff --check
```

Expected: no whitespace errors; only the responsive hero rules changed.

### Task 2: Synchronize CV and portfolio information

**Files:**
- Modify: `assets/cv.html`
- Modify: `index.html`
- Modify: `script.js`
- Replace: `assets/cv-rabbani-ridho-ihsani.pdf` with `C:\Users\RabbaniRidhoIhsani\Downloads\CV_Rabbani_Ridho_Ihsani.pdf`

**Interfaces:**
- Consumes: The supplied updated CV as the source of truth.
- Produces: An updated HTML CV, updated repeated portfolio copy, and a matching downloadable PDF at the existing asset path.

- [x] **Step 1: Update the HTML CV to the supplied facts**

In `assets/cv.html`, retain the current page structure and responsive/print CSS, but update the CV content:

- Role: Java Backend Engineer.
- Summary: 4+ years at PT Tri Adi Bersama (Anteraja), with Java/Spring Boot, REST APIs, Redis cache/queue, Kafka, Odoo ERP integration, production support, and JUnit/Mockito.
- Technical skills: Java; Spring Boot, RESTful API, CRUD, scheduler-triggered processes; Redis Cache/Queue; Apache Kafka producer/consumer/topic configuration; JUnit, Mockito; Odoo JSON-RPC; Excel/PDF processing; Docker.
- Experience: June 2022–Present, Jakarta; use the responsibilities listed in the supplied CV.
- Project: Timesheet Automation Tool; use the supplied Odoo JSON-RPC and Excel/PDF processing details and retain its private/internal status.
- Education: Bachelor of Informatics Engineering (S.Kom), Universitas Indraprasta PGRI, Jakarta.
- Languages: Indonesian (Native), English (Intermediate).

Remove unsupported old skill groups, work-type/availability claims, project features, and coursework. Keep verified contact information already present.

- [x] **Step 2: Synchronize repeated content in the portfolio**

In `index.html`, update the hero role/description and the existing About, Skills, Experience, Timesheet Automation Tool, and Education text to match the supplied CV. Replace unsupported skill percentage bars with technology tags grouped by the CV's skill categories, remove obsolete skills and unsupported course/project claims, and update the portfolio description if it refers to the removed skill bars. In `script.js`, restrict the rotating hero roles to facts supported by the supplied CV and remove the now-unused skill-bar observer. Do not introduce details not stated by the CV. Keep the existing section structure and links to `assets/cv.html`.

- [x] **Step 3: Replace the PDF asset**

From the repository root, copy the supplied file over the existing public CV PDF:

```powershell
Copy-Item 'C:\Users\RabbaniRidhoIhsani\Downloads\CV_Rabbani_Ridho_Ihsani.pdf' 'assets\cv-rabbani-ridho-ihsani.pdf' -Force
```

- [x] **Step 4: Verify the PDF and content synchronization**

Extract the replacement PDF text:

```powershell
& 'C:\Program Files\Git\ucrt64\bin\pdftotext.exe' -layout 'assets\cv-rabbani-ridho-ihsani.pdf' -
```

Confirm the output contains the supplied role, 4+ years, Redis, Kafka, JUnit/Mockito, Timesheet Automation Tool, degree, and languages. Search the HTML files for obsolete claims and confirm the repeated CV links still point to `assets/cv.html`:

```powershell
rg -n 'over 3 years|Selenium|WebDriverManager|national holiday|Computer Science / Information Technology|assets/cv.html' index.html assets/cv.html
```

Expected: stale details are absent; existing HTML CV links remain. Confirm both referenced assets exist:

```powershell
Test-Path 'assets\cv.html'
Test-Path 'assets\cv-rabbani-ridho-ihsani.pdf'
```

- [x] **Step 5: Verify the CV page at mobile and print sizes**

Using the local server from Task 1, capture the refreshed CV at mobile width and render its print stylesheet:

The CV layout check at 375px reports `PASS: CV fits 375px`. Chrome DevTools `Page.printToPDF` produced a PDF; `pdftotext -layout` confirmed the updated role, summary, skills, project, degree, and languages.

Inspect the mobile screenshot and confirm the content remains readable without horizontal clipping. Confirm the print PDF was created and retains the CV content and layout.

- [x] **Step 6: Run final repository checks**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and only `style.css`, `index.html`, `assets/cv.html`, and the replacement PDF changed, in addition to the already committed design and plan documents.
