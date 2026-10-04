# Google Sheets registration setup

The API returns success only after Apps Script acknowledges a saved row. Missing configuration, Google error JSON, permission pages and timeouts return errors; the form keeps the applicant's entries for another attempt. There is no fallback queue or local registration storage.

## Repair the deployed Apps Script

1. Open the target spreadsheet and select the tab where registrations should appear. Open **Extensions → Apps Script**.
2. Replace the existing script with the complete contents of `scripts/google-sheets-apps-script.js` and save.
3. Select **configureSpreadsheet** in the function dropdown and click **Run**. Authorize access if asked. This saves the spreadsheet ID and selected tab name in Script properties; it does not submit a registration. For a standalone script, set `SPREADSHEET_ID` and `SHEET_NAME` manually under **Project Settings → Script properties**.
4. Open **Deploy → Manage deployments → Edit**. Select **New version** and deploy with **Execute as: Me** and **Who has access: Anyone**. Editing and saving code alone does not update an existing deployment.
5. Open the deployed `/exec` URL in an incognito window. Expect `{"status":"active","ready":true,"version":2}`. This checks spreadsheet access without adding a row. A `ready:false` response explains the configuration error.
6. Keep the existing `GOOGLE_SHEETS_WEBHOOK_URL` when updating the same deployment. If you create a new deployment, update the variable in `.env.local` and your live hosting environment, then restart/redeploy the website. Keep it server-side; do not prefix it with `NEXT_PUBLIC_`.
7. Submit one application through the form and verify the registration ID in the selected tab. If the form reports an unconfirmed save, check **Apps Script → Executions** and the spreadsheet before retrying; a timeout can occur after a write.

The server's deadline is 25 seconds, including reading the acknowledgement. Apps Script waits up to 5 seconds for its write lock. Neither side automatically retries a write.

## Diagnose without submitting

Run `node scripts/check-google-sheets.mjs` from the project root. It loads the local environment and performs a GET health check. It does not print the webhook URL or send registration data. `Script function not found: doGet` means the deployed version lacks the health check; deploy the full script above.

Run `node --test tests/google-sheets.test.mjs` for isolated regression checks of acknowledgements, error responses, API failures and Apps Script writes. These tests use mocked Google services and never contact the live sheet.

## Why the previous integration failed

The old webhook relied on `getActiveSpreadsheet().getActiveSheet()` during a web request. Google documents that active-document methods are unavailable when bound scripts run as web apps. The replacement captures the target once in the editor and uses `openById()` with `getSheetByName()` for every request. The old relay also accepted HTTP 200 error responses, and the API reported success even after relay failure.

References: [Google bound-script limitations](https://developers.google.com/apps-script/guides/bound#special_methods), [web app deployments and permissions](https://developers.google.com/apps-script/guides/web), [Content Service redirects](https://developers.google.com/apps-script/guides/content).
