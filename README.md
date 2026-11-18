# Nookly: A Smarter Way to Organize and Share Learning Resources

> Hackathon Project by **Team KatanyaForFun** for Universitas Negeri Surabaya (**UNESA**) students.
> Tailored for FMIPA S1 Sains Data (Data Science) Semester 1.

---

## 🌟 The Core Problem & Value Proposition
* **The Problem:** Students constantly lose lecture slides, handwritten formula sheets, and past exam reviews in chaotic WhatsApp/LINE class group chats. Files get buried, download links expire, and duplicate unvetted notes cause confusion.
* **Student Validation:** Backed by **81.8% student demand** from our initial survey across UNESA cohorts.
* **The Solution:** A mobile-first, editorial-academic web platform structured by **Course & Chapter**, vetted by **Admins / Cohort TAs**, and tracked for **Curriculum Learning Gaps**.

---

## 🚀 Key Features

### 1. Instant Role Switcher (Pitch-Ready Demo)
Persistent floating pill allowing judges and evaluators to test all three personas seamlessly:
* 🎓 **Student:** Browse courses, search chapters, preview excerpts, and download verified notes.
* ✍️ **Contributor:** Upload study notes with drag-and-drop, suggest chapters, and track moderation status.
* 🛡️ **Admin / Lecturer:** Approve or reject submissions with mandatory feedback, inspect access-frequency trends, and detect learning gaps.

### 2. Hierarchical Course & Chapter Drilldown
* Pre-seeded with UNESA S1 Sains Data semester 1 courses:
  * **SD101 - Kalkulus I** (Dr. Dwi Lestari, M.Si.)
  * **SD102 - Algoritma & Pemrograman** (I Kadek Dwi Nuryana, S.T., M.Kom.)
  * **SD103 - Pengantar Sains Data** (Prof. Dr. Agus Triyono, M.Cs.)
  * **SD104 - Statistika Dasar** (Endah Rahmawati, S.Si., M.Stat.)
* Chapter-by-chapter accordion with vetted materials count badges.
* **Engaging Empty States:** If a chapter has 0 materials, displays an encouraging illustration and one-click CTA to contribute.

### 3. Interactive Reader Sheet & Real-Time Access Logger
* Click any document to open a slide-up reader sheet with metadata (contributor, size, format, views, downloads) and sample preview excerpt.
* Clicking **"Download Resource"** immediately logs an event into the analytics store, increments live views/downloads, and triggers non-blocking toast feedback.

### 4. Admin Review Queue & Structured Rejection Feedback
* Dedicated moderation view with badge count.
* One-click **Approve & Publish** (immediately makes notes live in public library).
* Structured **Reject** workflow with quick presets (e.g. blurry scan, truncated pages, out of syllabus) and custom notes. Feedback is directly displayed in the contributor's *"My Submissions"* drawer.

### 5. Access Gaps Detector (Curriculum Need Analyzer)
* Identifies chapters with **high student search volume** but **zero or low vetted resources**.
* Alerts lecturers and cohort leads to recruit TA note-takers or request slide uploads before exam weeks.

---

## 🛠️ Architecture & Tech Stack
* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
* **Design Aesthetic:** Editorial Academic (Notion/Linear/Apple Books inspired) with `#FAFAFA` background, `#0F172A` obsidian typography, `#2563EB` Academic Cobalt Blue, and subtle borders (`border-slate-200/80`).
* **Database & Storage (Supabase-Ready):** See `supabase/schema.sql` for:
  * Tables: `profiles`, `courses`, `chapters`, `materials`, `access_logs`, `learning_gap_signals`.
  * Triggers for automatic access logging (`views_count`, `downloads_count`).
  * Row Level Security (RLS) policies for Student, Contributor, and Admin roles.
  * Storage bucket configuration for PDF, PPTX, and DOCX files.

---

## 🏃 Getting Started

```bash
# 1. Install dependencies
pnpm install # or npm install

# 2. Run local development server
pnpm dev

# 3. Open in browser
http://localhost:3000
```

---
*Created with craft by Team KatanyaForFun for UNESA Hackathon.*
