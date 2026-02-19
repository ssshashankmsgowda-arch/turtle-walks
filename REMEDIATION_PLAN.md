# Remediation Plan & Steps

This document outlines the steps taken to fix the identified security vulnerabilities.

## 1. Backend Hardening (Google Apps Script)

**File:** `GoogleAppsScript.js`

- **Issue:** Authentication failed open if the secret was missing. DoS via large payloads.
- **Fix:**
    - Updated `isValidToken` to return `false` if `API_TOKEN` is missing.
    - Added `validateLength` function.
    - Added length checks for `studentName`, `schoolName`, `email`, `phone`, `grade`, and `section`.

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

**Verification:**
1.  Build the project locally (`npm run build`).
2.  Search the output JS bundle for `VITE_PUBLIC_API_TOKEN` (it should be replaced by the value during build).
3.  Verify the application still submits data successfully (assuming correct environment setup).
