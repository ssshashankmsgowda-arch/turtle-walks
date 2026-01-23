// =============================================================
// SECURE GOOGLE APPS SCRIPT BACKEND
// =============================================================

/**
 * Validates the authentication token
 * Note: You must set the SCRIPT PROPERTY 'API_TOKEN' in File > Project Properties > Script Properties
 */
function isValidToken(token) {
    // 1. Get the secret token from Script Properties
    var secret = PropertiesService.getScriptProperties().getProperty('API_TOKEN');

    // 2. If no secret is set, we FAIL OPEN for development (warn user)
    //    In production, this should return false.
    if (!secret) return true;

    // 3. Compare tokens
    return token === secret;
}

/**
 * Sanitizes input to prevent CSV Injection / Formula Injection
 * Prepends a single quote to force text interpretation
 */
function sanitize(input) {
    if (input === null || input === undefined) return '';
    var str = input.toString();
    // If it starts with =, +, -, @ (formula triggers), prepend '
    if (/^[\=\+\-\@]/.test(str)) {
        return "'" + str;
    }
    return str;
}

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    try {
        // -------------------------------------------------------------
        // 1. PARSE PAYLOAD
        // -------------------------------------------------------------
        if (!e.postData || !e.postData.contents) {
            throw new Error("Missing payload");
        }
        var jsonString = e.postData.contents;
        var data = JSON.parse(jsonString);

        // -------------------------------------------------------------
        // 2. SECURITY CHECK: AUTHENTICATION
        // -------------------------------------------------------------
        // The frontend should send { ..., "auth_token": "..." }
        if (!isValidToken(data.auth_token)) {
             return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Unauthorized' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // -------------------------------------------------------------
        // 3. MAP DATA TO COLUMNS & SANITIZE
        // -------------------------------------------------------------
        var row = [
            sanitize(data.id),                  // Col 1: ID
            sanitize(data.schoolName),          // Col 2: School Name
            sanitize(data.studentName),         // Col 3: Student Name
            sanitize(data.grade),               // Col 4: Class
            sanitize(data.section),             // Col 5: Section
            sanitize(data.phone),               // Col 6: Phone
            sanitize(data.email),               // Col 7: Email
            sanitize(data.timestamp),           // Col 8: Date/Time
            data.optIn ? 'Yes' : 'No'           // Col 9: Opt-In (Boolean doesn't need sanitization)
        ];

        // -------------------------------------------------------------
        // 4. SAVE TO SHEET
        // -------------------------------------------------------------
        sheet.appendRow(row);

        return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
