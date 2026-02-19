# Remediation Plan & Steps

This document outlines the steps taken to fix the identified security vulnerabilities.

## 1. Backend Hardening (Google Apps Script)

**File:** `GoogleAppsScript.js`

- **Issue:** Authentication failed open if the secret was missing. DoS via large payloads. Information leakage via stack traces.
- **Fix:**
    - Updated `isValidToken` to return `false` if `API_TOKEN` is missing.
    - Added `validateLength` function.
    - Added length checks for `studentName`, `schoolName`, `email`, `phone`, `grade`, and `section`.
    - Sanitized `doPost` to suppress detailed error messages (`error.toString()`) and return a generic "An internal error occurred." instead.

**Verification:**
1.  Open the Google Apps Script editor.
2.  Deploy the updated script.
3.  Set the Script Property `API_TOKEN`.
4.  Send a POST request WITHOUT the token -> Expect `401 Unauthorized`.
5.  Send a POST request WITH a 200-character name -> Expect `400 Payload too large`.

## 2. Infrastructure Security (Vercel)

**File:** `vercel.json`

- **Issue:** Missing security headers.
- **Fix:** Added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, and `Content-Security-Policy`.

**Verification:**
1.  Deploy to Vercel.
2.  Inspect response headers using `curl -I <deployment-url>`.
3.  Verify headers are present.

## 3. Frontend Hardening & Cleanup

**Files:** `services/db.ts`, `vite.config.ts`, `services/dataStore.ts`

- **Issue:** `VITE_API_TOKEN` implies secret, but client-side it is public. Unused code in `dataStore.ts`.
- **Fix:**
    - Renamed `VITE_API_TOKEN` to `VITE_PUBLIC_API_TOKEN`.
    - Removed unused `services/dataStore.ts`.
    - Cleaned up `vite.config.ts`.
    - Optimized bundle size with vendor chunk splitting in `vite.config.ts`.

## 4. Accessibility & Code Quality

**Files:** `Hero.tsx`, `UserForm.tsx`, `Header.tsx`, `Footer.tsx`

- **Issue:** Missing `alt` text for images. Buttons triggering accidental form submissions (`type` attribute missing).
- **Fix:**
    - Added descriptive `alt` text to images in `Hero.tsx` and `InitiativesSection.tsx`.
    - Added `type="button"` to all non-submit buttons (e.g., "Back", "Close", "Download", "Share").

**Verification:**
1.  Build the project locally (`npm run build`).
2.  Verify the application behaves correctly (e.g., clicking "Back" in `UserForm` navigates back instead of submitting the form).
