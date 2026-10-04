import type { GoogleSheetSubmissionPayload, GoogleSheetSubmissionResult } from "@/types/googleSheets";

/** Relay server-side and require a write acknowledgement, including on HTTP 200 responses. */
export async function submitToGoogleSheet(payload: GoogleSheetSubmissionPayload): Promise<GoogleSheetSubmissionResult> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    ?.replace(/^[\uFEFF\u200B\u200C\u200D\s"']+|[\s"']+$/g, "")
    .trim();

  if (!webhookUrl) {
    return { success: false, code: "configuration", error: "GOOGLE_SHEETS_WEBHOOK_URL is missing. No registration was saved." };
  }
  try {
    const url = new URL(webhookUrl);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname) || url.pathname.includes("EXAMPLE")) {
      return { success: false, code: "configuration", error: "Configure the deployed Google Apps Script web app URL ending in /exec." };
    }
  } catch {
    return { success: false, code: "configuration", error: "GOOGLE_SHEETS_WEBHOOK_URL is not a valid URL." };
  }

  // Keep the deadline active through response parsing; Apps Script can take time to start.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    });
    if (!response.ok) {
      return { success: false, code: "http", error: `Google Sheets webhook returned HTTP ${response.status}. Check deployment access and authorization.` };
    }

    const responseText = (await response.text()).trim();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Support an explicit legacy acknowledgement, never arbitrary HTML or text.
      if (responseText.toLowerCase() === "success") {
        return { success: true, message: "Saved to Google Sheets." };
      }
      return { success: false, code: "response", error: "Google returned an unexpected response. Check the deployed doPost function and public web app access." };
    }

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return { success: false, code: "response", error: "Google did not confirm that the registration was saved." };
    }
    const result = "result" in data ? data.result : undefined;
    const success = "success" in data ? data.success : undefined;
    const status = "status" in data ? data.status : undefined;
    const error = "error" in data ? data.error : undefined;
    if (result === "error" || status === "error" || success === false || (typeof error === "string" && error.trim())) {
      const detail = typeof error === "string" ? error.replace(/https?:\/\/\S+/g, "[redacted URL]").slice(0, 500) : "The deployed script rejected the registration.";
      return { success: false, code: "rejected", error: `Google Apps Script: ${detail}` };
    }
    if (result === "success" || status === "success" || success === true) {
      return { success: true, message: "Saved to Google Sheets." };
    }
    return { success: false, code: "response", error: "Google did not confirm that the registration was saved." };
  } catch {
    if (controller.signal.aborted) {
      return { success: false, code: "timeout", error: "Google Sheets did not confirm the save within 25 seconds. Check Apps Script Executions before retrying." };
    }
    return { success: false, code: "network", error: "Unable to reach the Google Sheets webhook. Check server connectivity." };
  } finally {
    clearTimeout(timeoutId);
  }
}
