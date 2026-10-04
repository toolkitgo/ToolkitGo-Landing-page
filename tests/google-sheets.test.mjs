import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requireModule = createRequire(import.meta.url);
const webhook = "https://script.google.com/macros/s/test-deployment/exec";
const payload = {
  timestamp: "2026-10-04T00:00:00.000Z", registrationId: "TKGO-HYD-123456",
  fullName: "Integration Test", phoneNumber: "+91 9876543210", hyderabadArea: "Kukatpally",
  serviceCategory: "AC Technician", yearsOfExperience: "1-3 years",
  source: "test", status: "Pending Verification",
};

/** Run actual service/route source with isolated dependencies; never call the live webhook. */
function loadTs(file, globals = {}, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: (name) => dependencies[name] ?? requireModule(name),
    process: { env: { GOOGLE_SHEETS_WEBHOOK_URL: webhook } },
    URL, AbortController, setTimeout, clearTimeout, console: { error() {}, warn() {} },
    ...globals,
  }, { filename: file });
  return exports;
}

test("missing or invalid configuration never saves or logs applicant data", async () => {
  for (const url of [undefined, "", "not-a-url", "https://script.google.com/macros/s/test/dev", "https://example.com/exec"]) {
    const service = loadTs("src/lib/services/googleSheets.ts", {
      process: { env: { GOOGLE_SHEETS_WEBHOOK_URL: url } },
      fetch: () => assert.fail("A misconfigured webhook must not be contacted"),
    });
    const result = await service.submitToGoogleSheet(payload);
    assert.equal(result.success, false);
    assert.equal(result.code, "configuration");
  }
});

test("HTTP 200 errors, permission HTML and ambiguous responses never count as saved", async () => {
  for (const body of [JSON.stringify({ result: "error", error: "Cannot read properties of null (reading getActiveSheet)" }), JSON.stringify({ success: false }), "<html>Sign in to Google</html>", "{}", "null", "[]", "OK"]) {
    const service = loadTs("src/lib/services/googleSheets.ts", { fetch: async () => new Response(body) });
    assert.equal((await service.submitToGoogleSheet(payload)).success, false, body);
  }
});

test("explicit acknowledgements succeed and redirects preserve the actual payload", async () => {
  for (const body of [JSON.stringify({ result: "success", row: 2 }), JSON.stringify({ success: true }), "Success"]) {
    const service = loadTs("src/lib/services/googleSheets.ts", { fetch: async (url, options) => {
      assert.equal(url, webhook);
      assert.equal(options.redirect, "follow");
      assert.deepEqual(JSON.parse(options.body), payload);
      return new Response(body);
    } });
    assert.equal((await service.submitToGoogleSheet(payload)).success, true);
  }
});

test("HTTP and network failures are surfaced", async () => {
  const http = loadTs("src/lib/services/googleSheets.ts", { fetch: async () => new Response("Forbidden", { status: 403 }) });
  assert.equal((await http.submitToGoogleSheet(payload)).code, "http");
  const network = loadTs("src/lib/services/googleSheets.ts", { fetch: async () => { throw new Error("Connection failed"); } });
  assert.equal((await network.submitToGoogleSheet(payload)).code, "network");
});

test("timeout stays active while reading Google's response body", async () => {
  const service = loadTs("src/lib/services/googleSheets.ts", {
    setTimeout: (callback, delay) => { assert.equal(delay, 25000); return setTimeout(callback, 0); },
    fetch: async (_url, options) => ({ ok: true, text: () => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(new Error("Aborted")), { once: true });
    }) }),
  });
  const result = await service.submitToGoogleSheet(payload);
  assert.equal(result.success, false);
  assert.equal(result.code, "timeout");
});

test("API returns success only after the sheet confirms a write", async () => {
  const schema = loadTs("src/lib/validation/registrationSchema.ts");
  const form = { fullName: payload.fullName, phoneNumber: "9876543210", city: "Kukatpally", serviceCategory: "ac_technician", yearsOfExperience: "1_3" };
  for (const [sheetResult, status] of [
    [{ success: false, code: "rejected", error: "Sheet unavailable" }, 502],
    [{ success: false, code: "configuration", error: "Missing URL" }, 503],
    [{ success: false, code: "timeout", error: "Deadline" }, 504],
    [{ success: true, message: "Saved" }, 201],
  ]) {
    const route = loadTs("src/app/api/register/route.ts", {}, {
      "next/server": { NextResponse: { json: (data, init) => Response.json(data, init) } },
      "@/lib/validation/registrationSchema": schema,
      "@/lib/services/googleSheets": { submitToGoogleSheet: async () => sheetResult },
    });
    const response = await route.POST(new Request("http://localhost/api/register", { method: "POST", body: JSON.stringify(form) }));
    assert.equal(response.status, status);
    const body = await response.json();
    assert.equal(body.success, status === 201);
    if (status !== 201) assert.equal(body.registrationId, undefined);
  }
});

/** Model Apps Script services without contacting Google or writing real registrations. */
function scriptContext({ configured = true, lockAvailable = true, missingTab = false } = {}) {
  const rows = [];
  let releases = 0;
  const properties = configured ? { SPREADSHEET_ID: "test-sheet", SHEET_NAME: "Registrations" } : {};
  const range = new Proxy({}, { get: () => () => range });
  const sheet = {
    getName: () => "Registrations", getLastRow: () => rows.length,
    appendRow: (row) => rows.push(row), getRange: () => range,
    setRowHeight() {}, setFrozenRows() {}, setColumnWidth() {},
  };
  const context = {
    rows,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => null,
      openById: (id) => {
        assert.equal(id, "test-sheet");
        return { getSheetByName: (name) => { assert.equal(name, "Registrations"); return missingTab ? null : sheet; } };
      },
      flush() {},
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (name) => properties[name], setProperties: (values) => Object.assign(properties, values) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => lockAvailable, releaseLock: () => releases++ }) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }) },
    Utilities: { formatDate: () => "2026-10-04 05:30:00" }, Logger: { log() {} },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "scripts/google-sheets-apps-script.js"), "utf8"), context);
  return { context, rows, releases: () => releases, properties, sheet };
}

test("web app writes to the configured tab even with no active spreadsheet", () => {
  const { context, rows, releases } = scriptContext();
  assert.equal(context.doGet().ready, true);
  assert.equal(rows.length, 0, "GET health check must be read-only");
  const response = context.doPost({ postData: { contents: JSON.stringify(payload) } });
  assert.equal(response.result, "success");
  assert.equal(response.row, 2);
  assert.equal(rows[1][1], payload.registrationId);
  assert.equal(rows[1][3], "'" + payload.phoneNumber);
  assert.equal(releases(), 1);
});

test("configuration, invalid payloads and unavailable locks never append an application", () => {
  for (const settings of [{ configured: false }, { missingTab: true }, { lockAvailable: false }]) {
    const { context, rows } = scriptContext(settings);
    assert.equal(context.doPost({ postData: { contents: JSON.stringify(payload) } }).result, "error");
    assert.equal(rows.length, 0);
  }
  const { context, rows, releases } = scriptContext();
  for (const body of ["not-json", "{}", "null", JSON.stringify({ ...payload, phoneNumber: "+91 123" })]) {
    assert.equal(context.doPost({ postData: { contents: body } }).result, "error");
  }
  assert.equal(rows.length, 0);
  assert.equal(releases(), 0, "Never release a lock that wasn't acquired");
});

test("editor configuration captures the chosen spreadsheet and tab without appending", () => {
  const { context, properties, rows, sheet } = scriptContext({ configured: false });
  context.SpreadsheetApp.getActiveSpreadsheet = () => ({ getId: () => "chosen-id", getActiveSheet: () => sheet });
  context.configureSpreadsheet();
  assert.equal(properties.SPREADSHEET_ID, "chosen-id");
  assert.equal(properties.SHEET_NAME, "Registrations");
  assert.equal(rows.length, 0);
});
