/**
 * ToolkitGO Enterprise Google Sheets Submission Service
 * 
 * Secure server-side relay that pushes pre-registration applications
 * directly to Google Sheets via Google Apps Script Webhook.
 */

export interface GoogleSheetSubmissionPayload {
  timestamp: string;
  registrationId: string;
  fullName: string;
  phoneNumber: string;
  hyderabadArea: string;
  serviceCategory: string;
  yearsOfExperience: string;
  source: string;
  status: string;
}

export interface GoogleSheetSubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submits technician pre-registration data to Google Sheets webhook.
 * Incorporates timeout safeguards, redirect handling, and graceful fallback for local development.
 *
 * @param payload - Structured technician registration details
 * @returns Result object indicating success or error status
 */
export async function submitToGoogleSheet(
  payload: GoogleSheetSubmissionPayload
): Promise<GoogleSheetSubmissionResult> {
  const rawUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  // Sanitize webhook URL: strip BOM (\uFEFF), zero-width characters (\u200B-\u200D), quotes and whitespace
  const webhookUrl = rawUrl
    ?.replace(/^[\uFEFF\u200B\u200C\u200D\s"']+|[\s"']+$/g, "")
    .trim();

  // Graceful fallback for local development and initial deployments
  if (!webhookUrl || webhookUrl === "") {
    console.warn(
      "[GoogleSheets Service] GOOGLE_SHEETS_WEBHOOK_URL is not set. Registration payload logged to console:",
      JSON.stringify(payload, null, 2)
    );
    return {
      success: true,
      message: "Development mode: Logged payload locally (no webhook configured).",
    };
  }

  // 8-second timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      // Google Apps Script redirects (302) to an execution page; 'follow' is mandatory
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `[GoogleSheets Service] Webhook HTTP error: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        error: `Google Sheets webhook returned status ${response.status}`,
      };
    }

    const responseText = await response.text();
    let responseData: Record<string, unknown> = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // Some Apps Script web apps return text "Success" rather than JSON
      responseData = { result: responseText };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[GoogleSheets Service] Sync response:", responseData);
    }

    return {
      success: true,
      message: "Successfully synchronized with Google Sheets.",
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      console.error("[GoogleSheets Service] Request timed out after 8000ms.");
      return {
        success: false,
        error: "Google Sheets connection timed out. Submission will be queued.",
      };
    }

    console.error("[GoogleSheets Service] Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Google Sheets connection error.",
    };
  }
}
