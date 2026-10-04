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

/** Searchable picker values remain compatible with API validation and Sheets exports. */
export interface SearchableSelectProps {
  id: string;
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  groups?: Array<LocalityGroup | ServiceCategoryGroup>;
  options?: OptionItem[];
  fallbackOption?: string;
}

export interface PickerOption extends OptionItem {
  keywords: string;
}

/** Positions the picker inside the visible screen, including the mobile keyboard. */
export interface PickerPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}
