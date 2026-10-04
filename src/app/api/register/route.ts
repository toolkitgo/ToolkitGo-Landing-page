import { NextResponse } from "next/server";
import {
  validateRegistrationForm,
  SERVICE_CATEGORIES,
  EXPERIENCE_RANGES,
  normalizeIndianMobileNumber,
} from "@/lib/validation/registrationSchema";
import { RegistrationFormData } from "@/types/registration";
import { submitToGoogleSheet } from "@/lib/services/googleSheets";

export async function POST(request: Request) {
  try {
    const body: RegistrationFormData = await request.json();

    // 1. Dual-Tier Server-Side Validation
    const validation = validateRegistrationForm(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          fields: validation.errors,
        },
        { status: 400 }
      );
    }

    // 2. Generate Unique Hyderabad Registration ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const registrationId = `TKGO-HYD-${randomNum}`;

    // Resolve human-readable labels for categories and experience
    const serviceCategoryLabel =
      SERVICE_CATEGORIES.find((c) => c.value === body.serviceCategory)?.label ||
      body.serviceCategory;
    const experienceLabel =
      EXPERIENCE_RANGES.find((e) => e.value === body.yearsOfExperience)?.label ||
      body.yearsOfExperience;

    const rawPhone = typeof body.phoneNumber === "string" ? body.phoneNumber : "";
    const cleanedDigits = normalizeIndianMobileNumber(rawPhone);
    const formattedPhoneNumber = `+91 ${cleanedDigits}`;

    // 3. Relay to Google Sheets Webhook
    const sheetsResult = await submitToGoogleSheet({
      timestamp: new Date().toISOString(),
      registrationId,
      fullName: body.fullName.trim(),
      phoneNumber: formattedPhoneNumber,
      hyderabadArea: body.city.trim(),
      serviceCategory: serviceCategoryLabel,
      yearsOfExperience: experienceLabel,
      source: "toolkitgo_web_landing",
      status: "Pending Verification",
    });

    if (!sheetsResult.success) {
      console.error(
        `[PreRegistration API] Google Sheets save failed (${sheetsResult.code}): ${sheetsResult.error}`
      );
      return NextResponse.json(
        {
          success: false,
          error: sheetsResult.code === "timeout"
            ? "We could not confirm your registration. Please contact info@toolkit.in before submitting again."
            : "Your registration could not be saved. Please try again shortly or contact info@toolkit.in.",
        },
        { status: sheetsResult.code === "configuration" ? 503 : sheetsResult.code === "timeout" ? 504 : 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pre-registration received successfully! Welcome to ToolkitGO Hyderabad network.",
        registrationId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PreRegistration API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
