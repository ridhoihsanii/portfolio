# Mobile Hero Alignment and CV Update

## Goal

Correct the hero section's horizontal overflow and off-center appearance on mobile, and bring the published CV and related portfolio information in line with the supplied updated CV.

## Findings

The hero is placed in a single-column grid below 1024px, but its photo wrapper retains large horizontal padding. At mobile widths, the hero content and its CTA buttons can also exceed the available width. The hero clips overflow, making the content appear shifted or cut off. The existing HTML CV and portfolio descriptions still contain older or unsupported details.

## Design

- Make a mobile-only, targeted CSS correction to constrain the hero container and its children to the viewport, reduce the photo wrapper's horizontal footprint, and center the hero text, role, description, CTAs, and social links. Do not alter unrelated sections or desktop styling.
- Update `assets/cv.html` to reflect the supplied CV, retaining the existing CV page design and its responsive/print behavior.
- Replace `assets/cv-rabbani-ridho-ihsani.pdf` with the supplied PDF. Keep the site's existing CV links opening the refreshed HTML CV.
- Synchronize portfolio content that repeats CV details: professional summary, skills, experience, timesheet project, and education. Use only facts supported by the new CV; remove obsolete skills and unsupported project/education claims rather than inventing replacements.

The updated source identifies the role as Java Backend Engineer, 4+ years of experience at PT Tri Adi Bersama (Anteraja) since June 2022, Java/Spring Boot and REST API work, Redis cache/queue, Kafka, JUnit/Mockito, Odoo JSON-RPC and Excel/PDF processing, Docker, the Timesheet Automation Tool, a Bachelor of Informatics Engineering (S.Kom) from Universitas Indraprasta PGRI, and Indonesian/Intermediate English.

## Validation

- Check the hero at narrow and typical mobile widths for horizontal overflow and centered content, and confirm the desktop layout is unchanged.
- Check that the supplied PDF is the asset in the site and that CV links still resolve.
- Compare the HTML CV and repeated portfolio claims with the supplied CV, including removal of unsupported details.

## Out of Scope

No redesign of the desktop hero, unrelated sections, or CV visual style; no new personal or professional claims beyond the supplied source.
