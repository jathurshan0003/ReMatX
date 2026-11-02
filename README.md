# ReMatX — Reusable Construction Materials Platform

> **Circular Construction Materials Marketplace, Verification Engine & Digital Material Passports**
> Built according to the comprehensive 14-page university software engineering guideline.

---

## 🌟 Executive Summary

**ReMatX** is a modular circular economy platform designed to enable the discovery, technical verification, trading, and long-term traceability of recovered building materials. The system distinguishes between **marketplace condition grading** (Grade A–D, R), **accredited laboratory / field testing records**, and **applicable building standards** (SLSI / ISO / BS EN).

Verified materials receive a recorded inspection result and marketplace grade. Existing **Digital Material Passports** can provide QR traceability and long-term custody records when available.

---

## 🏗️ Supported Roles & Access Control (RBAC)

The platform implements role-based access control supporting all 8 core roles:
1. **Contractor / Salvager**: List recovered materials from deconstruction sites, manage stockpile inventory, request SLSI testing, and review buyer offers.
2. **Commercial Buyer**: Search certified reclaimed lots by category, grade, and Sri Lankan district, submit offers, and buy materials with escrow protection.
3. **Inspector / Materials Auditor**: Conduct non-destructive tests (ultrasonic thickness, moisture, compressive cores), evaluate acceptance criteria against standards, and assign Grades (A–D, R) to material batches.
4. **Architect / Specifier**: Search materials with full geometric dimensions and test sheets to incorporate salvaged components into low-carbon building specifications.
5. **Structural Engineer**: Review audited NDT test values against national building codes to approve structural reuse in load-bearing scenarios.
6. **Platform Administrator**: Manage standards versioning, review company credentials, oversee escrow transactions, and track national circularity metrics.
7. **Logistics Provider**: Manage pickup, waybill tracking, and jobsite delivery with crane offloading.
8. **Individual Seller**: List architectural heritage fixtures, teak timber, and antique doors/windows.

---

## 🔬 Standards & Material Grading Framework

### Proposed Material Grading Framework (Guideline Section 5)
- **Grade A**: Suitable for direct structural or architectural reuse subject to applicable technical requirements.
- **Grade B**: Reusable with minor repair, cleaning, or surface preparation.
- **Grade C**: Potentially suitable for non-structural or lower-demand applications (e.g. landscape masonry, partitions).
- **Grade D**: Better suited for recycling, aggregate crushing, or material reprocessing rather than direct reuse.
- **Grade R**: Rejected for marketplace reuse based on platform safety inspection criteria.

### Example Category Inspection Criteria (Guideline Section 6)
- **Bricks & Masonry**: Dimensions, compressive strength core test ($\ge 15.0\text{ N/mm}^2$), water absorption ($\le 12\%$), visual chipping index.
- **Structural Steel**: Flange & web thickness loss ($\le 5\%$), yield strength ($\ge 275\text{ MPa}$), beam camber/sweep ($\le 2\text{ mm/m}$), ultrasonic weld & pitting integrity.
- **Timber & Hardwood**: Moisture content ($\le 18\%$), termite/borer damage ($0\%$), warp deflection ($\le 3\text{ mm/m}$), acoustic rot test.
- **Concrete Blocks**: Rebound hammer compressive strength, dry density, water absorption, crack network check.
- **Doors & Windows**: Frame squareness, glazing seals, hardware/lock functional condition.

---

## 📜 Digital Material Passport & QR Traceability

Every passport (e.g., `RM-2026-000145`) contains:
- **Passport ID & QR Code**: Live link to public digital record (`/passports/[passportNumber]`).
- **Circularity Indicators**: Landfill waste diverted (kg/tonnes), Embodied Carbon avoided ($kg\text{ }CO_2e$), and Equivalent Trees planted.
- **Deconstruction Provenance**: Origin site, source building age, previous load application, and recovery date.
- **Audited Inspection Record**: Lead inspector credentials, standard version used, test results table, and remarks.
- **Verifiable Chain of Custody**: Immutable timeline recording deconstruction, transport, audit, listing, and buyer custody.
- **Print / PDF Certificate View**: Formatted for physical printout on jobsites and regulatory inspection.

---

## ⚙️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend & UI** | Next.js 14 (App Router) + React + TypeScript + Tailwind CSS | Responsive, accessible interface with circular economy aesthetic |
| **Backend / API** | Next.js Modular Route Handlers | Modular service layer handling authentication, materials, audits, and orders |
| **Database & ORM** | Prisma ORM with SQLite (Default zero-config) & PostgreSQL (Docker-ready) | Relational integrity and transactions |
| **Security & Auth** | JWT + bcryptjs + RBAC | Secure session handling and role-based access |
| **Traceability** | `qrcode` library | Generation of high-res QR data URLs linking to passports |
| **Location Directory** | Sri Lanka district selection | Consistent district-based material locations |
| **Containerization** | Docker + `docker-compose.yml` | Optional production deployment with PostgreSQL 16 |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested with Node v22)
- npm v9+

### 1. Installation
```bash
# Clone or navigate to the directory
cd ReMatX

# Install dependencies
npm install
```

### 2. Database Setup & Seeding
```bash
# Generate Prisma client and sync schema to dev.db
npx prisma generate
npx prisma db push

# Seed database with authentic materials, standards, and passports
npm run prisma:seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demonstration & Evaluation Walkthrough

1. **Homepage**: Observe the live platform metrics (Landfill diverted and Embodied $CO_2e$ avoided) and the 6-step circular pipeline.
2. **Marketplace (`/marketplace`)**: Filter by category, Sri Lankan district, and Condition Grade (Grade A–D).
3. **Material Inspection (`/materials/[id]`)**: Examine high-res photos, dimensional drawings, and audited test reports. Click **"Buy Now"**, **"Make an Offer"**, or **"Request Quote"**.
4. **Digital Material Passport (`/passports/RM-2026-000145`)**: Inspect the official passport certificate with its scannable QR code, technical test table, and chain of custody. Test clicking **"Print Certificate"**.
5. **Inspector Hub (`/dashboard/inspector`)**: Select an unverified lot from the audit queue, fill in the category-specific test values, pick an official condition grade (A, B, C, D, or R), and click **"Verify Material Batch"**. The verified lot becomes available for procurement without automatically creating a passport.
6. **Standards Registry (`/standards`)**: Review versioned SLSI/ISO standards and threshold acceptance criteria.
---

## ⚖️ Statutory Notice (Guideline Section 22)
*The platform-level grading scheme (Grade A–D, R) provides marketplace condition assessment and visual sorting. Structural reuse decisions in load-bearing applications require qualified structural engineering review and compliance with applicable building regulations (UDA, ICTAD/CIDA, and SLSI).*
