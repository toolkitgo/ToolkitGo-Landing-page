"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RegistrationFormData,
  FormErrors,
  SubmissionStatus,
  RegistrationResponse,
} from "@/types/registration";
import {
  validateRegistrationForm,
  normalizeIndianMobileNumber,
  SERVICE_CATEGORY_GROUPS,
  EXPERIENCE_RANGES,
  HYDERABAD_LOCALITIES_BY_ZONE,
} from "@/lib/validation/registrationSchema";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

const INITIAL_FORM: RegistrationFormData = {
  fullName: "",
  phoneNumber: "",
  city: "",
  serviceCategory: "",
  yearsOfExperience: "",
};

export function TechnicianPreRegisterSection() {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationResponse | null>(null);

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstField = Object.keys(validation.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[id="${firstField}"]`)?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: RegistrationResponse = await response.json();

      if (!response.ok || !result.success) {
        setStatus("error");
        setServerError(result.error || result.message || "Submission failed. Please try again.");
        if (result.fields) {
          setErrors(result.fields);
        }
        return;
      }

      setStatus("success");
      setSuccessData(result);
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch {
      setStatus("error");
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="for-technicians" className="section-space bg-navy text-white">
      <div className="page-shell max-w-5xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="eyebrow eyebrow-dark mb-5">For technicians</p>
          <h2 className="section-title">Join our <span className="text-orange">network.</span></h2>
          <p className="mt-4 text-base leading-relaxed text-cream sm:text-lg">Find work opportunities across Hyderabad and nearby areas. Tell us a little about yourself to pre-register.</p>
        </div>
        <div className="rounded-2xl border border-cream-border bg-white p-5 text-navy sm:p-8 lg:p-10">
          <div className="mb-7 border-b border-cream-border pb-5">
            <h3 className="text-xl font-semibold tracking-tight">Partner pre-registration</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">All fields are required. You can search for your area and service trade.</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-7" aria-busy={status === "submitting"}>
            <fieldset disabled={status === "submitting"} className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
              <legend className="sr-only">Your contact and work details</legend>
              <div data-invalid={!!errors.fullName}>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">Full name<span aria-hidden="true" className="ml-0.5 text-error">*</span></label>
                <input id="fullName" name="fullName" type="text" autoComplete="name" maxLength={70}
                  value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Your full name"
                  aria-required="true" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={cn("registration-control min-h-14 w-full rounded-xl border bg-cream-light px-4 py-3 text-base placeholder:text-charcoal-muted", errors.fullName ? "border-error" : "border-cream-border")}
                />
                {errors.fullName && <p id="fullName-error" className="mt-2 text-sm text-error">{errors.fullName}</p>}
              </div>
              <div data-invalid={!!errors.phoneNumber}>
                <label htmlFor="phoneNumber" className="mb-2 block text-sm font-semibold">Mobile number<span aria-hidden="true" className="ml-0.5 text-error">*</span></label>
                <div className={cn("registration-control flex min-h-14 overflow-hidden rounded-xl border bg-cream-light", errors.phoneNumber ? "border-error" : "border-cream-border")}>
                  <span aria-hidden="true" className="flex shrink-0 items-center border-r border-cream-border px-3 text-sm font-semibold">+91</span>
                  <input id="phoneNumber" name="phoneNumber" type="tel" inputMode="numeric" autoComplete="tel-national"
                    value={formData.phoneNumber} onChange={(event) => updateField("phoneNumber", normalizeIndianMobileNumber(event.target.value).slice(0, 10))}
                    placeholder="10-digit mobile number" aria-required="true" aria-invalid={!!errors.phoneNumber}
                    aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base placeholder:text-charcoal-muted"
                  />
                </div>
                {errors.phoneNumber && <p id="phoneNumber-error" className="mt-2 text-sm text-error">{errors.phoneNumber}</p>}
              </div>
              <SearchableSelect id="city" name="city" label="Work area" required value={formData.city}
                onChange={(value) => updateField("city", value)} groups={HYDERABAD_LOCALITIES_BY_ZONE}
                fallbackOption="Other (Hyderabad & Surrounding Area)" error={errors.city} disabled={status === "submitting"}
                placeholder="Choose your Hyderabad area" searchPlaceholder="Search area, e.g. Kukatpally"
              />
              <SearchableSelect id="serviceCategory" name="serviceCategory" label="Service trade" required value={formData.serviceCategory}
                onChange={(value) => updateField("serviceCategory", value)} groups={SERVICE_CATEGORY_GROUPS}
                fallbackOption="Other Technical Trade / Specialized Service" error={errors.serviceCategory} disabled={status === "submitting"}
                placeholder="Choose your service trade" searchPlaceholder="Search AC, plumbing, appliances..."
              />
              <div className="sm:col-span-2">
                <SearchableSelect id="yearsOfExperience" name="yearsOfExperience" label="Experience" required value={formData.yearsOfExperience}
                  onChange={(value) => updateField("yearsOfExperience", value)} options={EXPERIENCE_RANGES}
                  error={errors.yearsOfExperience} disabled={status === "submitting"} placeholder="Choose your experience"
                  searchPlaceholder="Search experience"
                />
              </div>
            </fieldset>
            <div className="border-t border-cream-border pt-6">
              {serverError && <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-error bg-error-light p-4 text-sm text-error">
                <span>{serverError}</span>
                <button type="button" onClick={() => setServerError(null)} className="shrink-0 font-semibold underline">Dismiss</button>
              </div>}
              <button ref={submitButtonRef} type="submit" disabled={status === "submitting"}
                className="button-primary min-h-14 w-full cursor-pointer rounded-xl text-base disabled:cursor-not-allowed disabled:opacity-60">
                {status === "submitting" ? <><LoaderCircle aria-hidden="true" className="size-5 animate-spin" />Submitting...</>
                  : <>Pre-register now<ArrowRight aria-hidden="true" className="size-5" /></>}
              </button>
              <p className="mt-3 text-center text-xs leading-relaxed text-charcoal-muted">Our team will contact you about the next steps.</p>
            </div>
          </form>
        </div>
      </div>
      {status === "success" && successData && <SuccessModal returnFocusRef={submitButtonRef}
        registrationId={successData.registrationId || "TKGO-EARLY"}
        onClose={() => { setStatus("idle"); setSuccessData(null); }}
      />}
    </section>
  );
}
