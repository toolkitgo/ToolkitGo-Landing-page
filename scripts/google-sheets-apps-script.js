/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * =========================================================================
 * ToolkitGO Enterprise - Google Sheets Webhook Script (Google Apps Script)
 * =========================================================================
 * 
 * Instructions to set up:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 * 2. Name your spreadsheet: "ToolkitGO Technician Registrations (Hyderabad)".
 * 3. In the top menu, click: Extensions -> Apps Script.
 * 4. Erase any code in the editor and replace with this entire script.
 * 5. Click "Save" (disk icon).
 * 6. Click "Deploy" (blue button at top right) -> "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set the following deployment configuration:
 *    - Description: "ToolkitGO Webhook v1"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone" (IMPORTANT: Do NOT select "Only myself", or Next.js cannot post to it)
 * 9. Click "Deploy". Grant permissions if prompted (Advanced -> Go to Untitled project (unsafe) -> Allow).
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 11. Paste that URL into your `.env.local` file as:
 *     GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 * =========================================================================
 */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "ToolkitGO Webhook is online and ready." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent writes
  lock.tryLock(30000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-setup headers if the sheet is brand new
    setupHeadersIfEmpty(sheet);

    // Parse the incoming JSON body
    var requestData = JSON.parse(e.postData.contents);

    // Format IST Timestamp
    var istDate = Utilities.formatDate(
      new Date(),
      "Asia/Kolkata",
      "yyyy-MM-dd HH:mm:ss"
    );

    var row = [
      istDate,
      requestData.registrationId || "N/A",
      requestData.fullName || "N/A",
      "'" + (requestData.phoneNumber || "N/A"), // Leading single quote prevents Excel/Sheets phone number scientific notation
      requestData.hyderabadArea || "N/A",
      requestData.serviceCategory || "N/A",
      requestData.yearsOfExperience || "N/A",
      requestData.status || "Pending Verification",
      requestData.source || "toolkitgo_web_landing"
    ];

    sheet.appendRow(row);

    // Format newly appended row: Center-align registration ID, phone number, and status
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 2).setHorizontalAlignment("center").setFontWeight("bold");
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center");

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates professional branded headers and freezes the header row if the sheet is empty.
 */
function setupHeadersIfEmpty(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp (IST)",
      "Registration ID",
      "Full Name",
      "Mobile Number",
      "Hyderabad Area / Locality",
      "Service Category",
      "Experience",
      "Application Status",
      "Source"
    ];

    sheet.appendRow(headers);

    // Style Header Row (ToolkitGO Navy #0F1940 with White Text)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F1940");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 40);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Set default column widths for optimal readability
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 180); // Reg ID
    sheet.setColumnWidth(3, 200); // Name
    sheet.setColumnWidth(4, 150); // Mobile
    sheet.setColumnWidth(5, 220); // Hyderabad Area
    sheet.setColumnWidth(6, 260); // Service Category
    sheet.setColumnWidth(7, 180); // Experience
    sheet.setColumnWidth(8, 160); // Status
    sheet.setColumnWidth(9, 160); // Source
  }
}
