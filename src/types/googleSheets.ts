/** Server-side payload expected by the Google Apps Script deployment. */
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

export type GoogleSheetsFailureCode = "configuration" | "http" | "response" | "rejected" | "timeout" | "network";

/** A registration succeeds only when the webhook explicitly confirms the write. */
export type GoogleSheetSubmissionResult =
  | { success: true; message: string }
  | { success: false; code: GoogleSheetsFailureCode; error: string };
