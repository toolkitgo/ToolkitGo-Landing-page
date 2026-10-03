"use client";

import React, { useRef, useState } from "react";
import {
  RegistrationFormData,
  FormErrors,
  SubmissionStatus,
  RegistrationResponse,
} from "@/types/registration";
import {
  validateRegistrationForm,
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

  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationResponse | null>(null);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
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
    <section
      id="for-technicians"

      className="section-space bg-navy text-white"
    >

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="max-w-2xl mb-9">
          <div className="eyebrow eyebrow-dark mb-5">
            For Technicians
          </div>

          <h2 className="section-title">
            <span className="text-white">Join Our </span>
            <span className="text-orange">Network</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Be a part of ToolkitGo and get access to work opportunities across Hyderabad and surrounding regions. Pre-register now!
          </p>
        </div>

        {/* White Form Card */}
        <div

          className="bg-white rounded-xl p-5 sm:p-9 border border-cream-border text-navy"
        >
          {serverError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-error-light border border-error/30 text-error text-sm flex items-center justify-between"
            >
              <span>{serverError}</span>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-xs font-bold underline hover:opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-navy mb-2"
                >
                  Full Name<span className="text-error">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  aria-required="true"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  disabled={status === "submitting"}
                  className={`w-full px-4 py-3.5 rounded-lg border text-navy placeholder:text-charcoal-muted bg-cream-light focus:outline-none transition-all ${
                    errors.fullName
                      ? "border-error focus:border-error bg-error-light/20"
                      : "border-cream-border focus:border-orange"
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1.5 text-xs text-error font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-bold text-navy mb-2"
                >
                  Phone Number<span className="text-error">*</span>
                </label>
                <div
                  className={`flex rounded-lg border bg-cream-light transition-all ${
                    errors.phoneNumber
                      ? "border-error bg-error-light/20"
                      : "border-cream-border focus-within:border-orange"
                  }`}
                >
                  <span
                    className="inline-flex items-center px-3.5 border-r border-cream-border text-navy font-bold text-sm select-none bg-slate-100/70 shrink-0"
                    aria-hidden="true"
                  >
                    +91
                  </span>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const cleaned = (raw.startsWith("91") && raw.length > 10 ? raw.slice(2) : raw).slice(0, 10);
                      setFormData((prev) => ({ ...prev, phoneNumber: cleaned }));
                      if (errors.phoneNumber) {
                        setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                      }
                    }}
                    placeholder="Enter 10-digit mobile number"
                    aria-required="true"
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                    disabled={status === "submitting"}
                    className="w-full px-4 py-3.5 bg-transparent text-navy placeholder:text-charcoal-muted focus:outline-none rounded-r-lg"
                  />
                </div>
                {errors.phoneNumber && (
                  <p id="phoneNumber-error" className="mt-1.5 text-xs text-error font-medium">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Operating Location (Hyderabad & Surrounds) Searchable Combobox */}
              <SearchableSelect
                id="city"
                name="city"
                label="Operating Area (Hyderabad & Surrounds)"
                required
                value={formData.city}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, city: val }));
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: undefined }));
                  }
                }}
                groups={HYDERABAD_LOCALITIES_BY_ZONE}
                fallbackOption="Other (Hyderabad & Surrounding Area)"
                error={errors.city}
                disabled={status === "submitting"}
                placeholder="Select your Hyderabad area / locality"
                searchPlaceholder="Search Hyderabad area (e.g. Hitec, Kukatpally)..."
              />

              {/* Service Category Searchable Combobox */}
              <SearchableSelect
                id="serviceCategory"
                name="serviceCategory"
                label="Service Category"
                required
                value={formData.serviceCategory}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, serviceCategory: val }));
                  if (errors.serviceCategory) {
                    setErrors((prev) => ({ ...prev, serviceCategory: undefined }));
                  }
                }}
                groups={SERVICE_CATEGORY_GROUPS}
                fallbackOption="Other Technical Trade / Specialized Service"
                error={errors.serviceCategory}
                disabled={status === "submitting"}
                placeholder="Select service trade"
                searchPlaceholder="Search trade (e.g. AC, Electrical, Plumber, Washing Machine)..."
              />
            </div>

            {/* Years of Experience Searchable Combobox */}
            <SearchableSelect
              id="yearsOfExperience"
              name="yearsOfExperience"
              label="Years of Experience"
              required
              value={formData.yearsOfExperience}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, yearsOfExperience: val }));
                if (errors.yearsOfExperience) {
                  setErrors((prev) => ({ ...prev, yearsOfExperience: undefined }));
                }
              }}
              options={EXPERIENCE_RANGES}
              error={errors.yearsOfExperience}
              disabled={status === "submitting"}
              placeholder="Select experience"
              searchPlaceholder="Search experience..."
            />

            {/* Full-Width Orange Submit Button */}
            <div className="pt-2">
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 px-8 rounded-xl font-bold text-base text-navy bg-orange hover:bg-orange-hover active:bg-orange-active transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <svg aria-hidden="true" className="animate-spin h-5 w-5 text-navy" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Pre-Register Now</span>
                    <span aria-hidden="true" className="text-xl">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Celebratory Modal */}
      {status === "success" && successData && (
        <SuccessModal
          returnFocusRef={submitButtonRef}
          registrationId={successData.registrationId || "TKGO-EARLY"}
          onClose={() => {
            setStatus("idle");
            setSuccessData(null);
          }}
        />
      )}
    </section>
  );
}
