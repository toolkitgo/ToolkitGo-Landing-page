export interface RegistrationFormData {
  fullName: string;
  phoneNumber: string;
  city: string; // Hyderabad area / locality
  serviceCategory: string;
  yearsOfExperience: string;
}

export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

export type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId?: string;
  error?: string;
  fields?: FormErrors;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface LocalityGroup {
  zone: string;
  areas: string[];
}

export interface ServiceCategoryGroup {
  group: string;
  items: OptionItem[];
}
