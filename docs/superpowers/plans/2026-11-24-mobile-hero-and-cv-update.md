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

- [ ] **Step 1: Capture the failing mobile layout**

Start the static site from the repository root:

```powershell
python -m http.server 8765
```

In another PowerShell terminal, capture the current 375px layout with installed Chrome:

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=375,900 --screenshot="$env:TEMP\portfolio-before-375.png" http://127.0.0.1:8765/index.html
```

Inspect the screenshot and confirm the current hero text or CTA extends beyond the viewport / is not centered.

- [ ] **Step 2: Apply a mobile-only width and alignment correction**

Within the existing `@media (max-width: 768px)` rules in `style.css`:

1. Make `.hero-container` and `.hero-text` explicitly fit their grid container (`width: 100%` and `min-width: 0` as needed).
2. Remove the large horizontal padding from `.hero-photo-wrap` at mobile widths while retaining vertical spacing; keep the photo ring centered and sized to fit narrow screens.
3. Center `.hero-desc` text, keep its maximum width at 100%, and allow long role text to wrap.
4. Ensure the hero CTA row can wrap and each button can shrink or occupy a centered row without causing horizontal overflow; keep socials centered.

Do not add global overflow clipping to hide the symptom.

- [ ] **Step 3: Verify mobile and desktop screenshots**

Capture screenshots at 320px, 375px, and 596px viewport widths, then at 1280px:

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=320,900 --screenshot="$env:TEMP\portfolio-mobile-320.png" http://127.0.0.1:8765/index.html
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=375,900 --screenshot="$env:TEMP\portfolio-mobile-375.png" http://127.0.0.1:8765/index.html
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=596,900 --screenshot="$env:TEMP\portfolio-mobile-596.png" http://127.0.0.1:8765/index.html
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=1280,900 --screenshot="$env:TEMP\portfolio-desktop-1280.png" http://127.0.0.1:8765/index.html
```

Inspect the resulting screenshots. Pass criteria: all hero content is visible and centered at mobile widths, the photo fits, no horizontal content is cut off, and the desktop composition remains unchanged.

- [ ] **Step 4: Check the CSS diff**

Run:

```powershell
git diff --check
```

Expected: no whitespace errors; only the responsive hero rules changed.

### Task 2: Synchronize CV and portfolio information

**Files:**
- Modify: `assets/cv.html`
- Modify: `index.html`
- Replace: `assets/cv-rabbani-ridho-ihsani.pdf` with `C:\Users\RabbaniRidhoIhsani\Downloads\CV_Rabbani_Ridho_Ihsani.pdf`

**Interfaces:**
- Consumes: The supplied updated CV as the source of truth.
- Produces: An updated HTML CV, updated repeated portfolio copy, and a matching downloadable PDF at the existing asset path.

- [ ] **Step 1: Update the HTML CV to the supplied facts**

In `assets/cv.html`, retain the current page structure and responsive/print CSS, but update the CV content:

- Role: Java Backend Engineer.
- Summary: 4+ years at PT Tri Adi Bersama (Anteraja), with Java/Spring Boot, REST APIs, Redis cache/queue, Kafka, Odoo ERP integration, production support, and JUnit/Mockito.
- Technical skills: Java; Spring Boot, RESTful API, CRUD, scheduler-triggered processes; Redis Cache/Queue; Apache Kafka producer/consumer/topic configuration; JUnit, Mockito; Odoo JSON-RPC; Excel/PDF processing; Docker.
- Experience: June 2022–Present, Jakarta; use the responsibilities listed in the supplied CV.
- Project: Timesheet Automation Tool; use the supplied Odoo JSON-RPC and Excel/PDF processing details and retain its private/internal status.
- Education: Bachelor of Informatics Engineering (S.Kom), Universitas Indraprasta PGRI, Jakarta.
- Languages: Indonesian (Native), English (Intermediate).

Remove unsupported old skill groups, work-type/availability claims, project features, and coursework. Keep verified contact information already present.

- [ ] **Step 2: Synchronize repeated content in the portfolio**

In `index.html`, update the hero role/description and the existing About, Skills, Experience, Timesheet Automation Tool, and Education text to match the supplied CV. Remove obsolete skills and unsupported course/project claims; do not introduce details not stated by the CV. Keep the existing section structure and links to `assets/cv.html`.

- [ ] **Step 3: Replace the PDF asset**

From the repository root, copy the supplied file over the existing public CV PDF:

```powershell
Copy-Item 'C:\Users\RabbaniRidhoIhsani\Downloads\CV_Rabbani_Ridho_Ihsani.pdf' 'assets\cv-rabbani-ridho-ihsani.pdf' -Force
```

- [ ] **Step 4: Verify the PDF and content synchronization**

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

- [ ] **Step 5: Verify the CV page at mobile and print sizes**

Using the local server from Task 1, capture the refreshed CV at mobile width and render its print stylesheet:

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --window-size=375,900 --screenshot="$env:TEMP\portfolio-cv-mobile.png" http://127.0.0.1:8765/assets/cv.html
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --print-to-pdf="$env:TEMP\portfolio-cv-print.pdf" http://127.0.0.1:8765/assets/cv.html
```

Inspect the mobile screenshot and confirm the content remains readable without horizontal clipping. Confirm the print PDF was created and retains the CV content and layout.

- [ ] **Step 6: Run final repository checks**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and only `style.css`, `index.html`, `assets/cv.html`, and the replacement PDF changed, in addition to the already committed design and plan documents.
