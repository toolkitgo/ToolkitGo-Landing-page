/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ToolkitGO registration webhook.
 *
 * 1. Open the target spreadsheet, select the registrations tab, then Extensions > Apps Script.
 * 2. Replace the existing code with this complete file and save.
 * 3. Run configureSpreadsheet once from the editor and grant spreadsheet permissions.
 *    It stores the spreadsheet ID and tab name without writing an application.
 *    Standalone scripts: set SPREADSHEET_ID and SHEET_NAME in Project Settings > Script properties.
 * 4. Deploy > Manage deployments > Edit > New version > Deploy.
 *    Execute as Me; allow access to Anyone. Keep the existing /exec URL.
 * 5. Open the /exec URL. It must return JSON with ready: true.
 */

/** Editor-only setup: record the bound spreadsheet and the selected tab. */
function configureSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Open Apps Script from the target spreadsheet, or set SPREADSHEET_ID and SHEET_NAME in Script properties.");
  }
  var sheet = spreadsheet.getActiveSheet();
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: spreadsheet.getId(),
    SHEET_NAME: sheet.getName()
  });
  Logger.log("Configured ToolkitGO registration spreadsheet and tab successfully.");
}

/** Web requests have no active document; always resolve the configured target explicitly. */
function getRegistrationSheet() {
  var properties = PropertiesService.getScriptProperties();
  var spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  var sheetName = properties.getProperty("SHEET_NAME");
  if (!spreadsheetId || !sheetName) {
    throw new Error("Spreadsheet target is not configured. Run configureSpreadsheet in the editor before deploying.");
  }
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error("Configured registration tab was not found. Check SHEET_NAME in Script properties.");
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Read-only health check: confirms access to the actual registration tab. */
function doGet() {
  try {
    getRegistrationSheet().getLastRow();
    return jsonResponse({ status: "active", ready: true, version: 2 });
  } catch (error) {
    return jsonResponse({ status: "error", ready: false, error: error.toString() });
  }
}

/** Validate before acquiring a lock or changing a sheet. */
function validatePayload(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("A registration JSON object is required.");
  }
  var required = ["registrationId", "fullName", "phoneNumber", "hyderabadArea", "serviceCategory", "yearsOfExperience"];
  required.forEach(function (field) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error("Missing registration field: " + field);
    }
  });
  if (data.fullName.trim().length < 2 || data.fullName.trim().length > 70) {
    throw new Error("Full name must be between 2 and 70 characters.");
  }
  if (!/^\+91 [6-9]\d{9}$/.test(data.phoneNumber)) {
    throw new Error("A valid Indian mobile number is required.");
  }
}

/** Preserve user-supplied values as text, including phone numbers and formula-like input. */
function sheetText(value) {
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var acquired = false;
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("Registration request body is missing.");
    var requestData = JSON.parse(e.postData.contents);
    validatePayload(requestData);
    acquired = lock.tryLock(5000);
    if (!acquired) throw new Error("Registrations are busy. Please try again shortly.");

    var sheet = getRegistrationSheet();
    setupHeadersIfEmpty(sheet);
    var row = [
      Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      sheetText(requestData.registrationId),
      sheetText(requestData.fullName.trim()),
      sheetText(requestData.phoneNumber),
      sheetText(requestData.hyderabadArea.trim()),
      sheetText(requestData.serviceCategory),
      sheetText(requestData.yearsOfExperience),
      sheetText(requestData.status || "Pending Verification"),
      sheetText(requestData.source || "toolkitgo_web_landing")
    ];
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return jsonResponse({ result: "success", registrationId: requestData.registrationId, row: sheet.getLastRow() });
  } catch (error) {
    return jsonResponse({ result: "error", error: error.toString() });
  } finally {
    if (acquired) lock.releaseLock();
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
