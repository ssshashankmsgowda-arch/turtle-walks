function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    try {
        // -------------------------------------------------------------
        // CRITICAL: Parse the text/plain payload manually
        // -------------------------------------------------------------
        var jsonString = e.postData.contents;
        var data = JSON.parse(jsonString);

        // -------------------------------------------------------------
        // MAP DATA TO COLUMNS
        // -------------------------------------------------------------
        var row = [
            data.id,                  // Col 1: ID
            data.schoolName,          // Col 2: School Name
            data.studentName,         // Col 3: Student Name
            data.grade,               // Col 4: Class
            data.section,             // Col 5: Section
            data.phone,               // Col 6: Phone
            data.email,               // Col 7: Email
            data.timestamp,           // Col 8: Date/Time
            data.optIn ? 'Yes' : 'No' // Col 9: Opt-In (Handling boolean)
        ];

        // -------------------------------------------------------------
        // SAVE TO SHEET
        // -------------------------------------------------------------
        sheet.appendRow(row);

        return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
