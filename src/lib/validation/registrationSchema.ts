import {
  RegistrationFormData,
  FormErrors,
  OptionItem,
  LocalityGroup,
  ServiceCategoryGroup,
} from "@/types/registration";

/**
 * 7 Main Trade Groups with all 17 Specific Service Categories
 * Extracted directly from Section 4 of the ToolkitGo Master Rate Card PDF (§4.1 to §4.17).
 */
export const SERVICE_CATEGORY_GROUPS: ServiceCategoryGroup[] = [
  {
    group: "1. Air Conditioning & Cooling",
    items: [
      {
        value: "air_conditioner_ac",
        label: "Air Conditioner (AC) Repair & Installation",
      },
      {
        value: "air_cooler_service",
        label: "Air Cooler & Ventilation Repair",
      },
    ],
  },
  {
    group: "2. Electrical & Power Systems",
    items: [
      {
        value: "electrician_services",
        label: "Electrician Services (Switches, Wiring & MCB)",
      },
      {
        value: "fan_lighting_setup",
        label: "Fan & Lighting Installation (Ceiling Fans & Lights)",
      },
    ],
  },
  {
    group: "3. Plumbing & Water Systems",
    items: [
      {
        value: "plumber_services",
        label: "Plumber Services (Taps, Pipes & Sanitary)",
      },
      {
        value: "water_tank_motor",
        label: "Water Tank, Motor Installation & Drainage",
      },
    ],
  },
  {
    group: "4. Major Home & Kitchen Appliances",
    items: [
      {
        value: "washing_machine_repair",
        label: "Washing Machine Repair & Service",
      },
      {
        value: "refrigerator_repair",
        label: "Refrigerator Repair & Gas Refill",
      },
      {
        value: "water_purifier_ro",
        label: "Water Purifier / RO Service & Spares",
      },
      {
        value: "geyser_water_heater",
        label: "Geyser & Water Heater Service & Repair",
      },
      {
        value: "microwave_oven_repair",
        label: "Microwave Oven Repair & Service",
      },
      {
        value: "chimney_gas_stove",
        label: "Chimney & Gas Stove / Hob Repair",
      },
    ],
  },
  {
    group: "5. Electronics, Computers & IT Devices",
    items: [
      {
        value: "television_repair_install",
        label: "Television Repair & Installation",
      },
      {
        value: "laptop_desktop_apple",
        label: "Laptop, Desktop & Apple Repairs",
      },
    ],
  },
  {
    group: "6. Carpentry & Woodwork",
    items: [
      {
        value: "carpenter_general",
        label: "Carpenter Services (Doors, Locks & Fitting)",
      },
      {
        value: "furniture_assembly_repair",
        label: "Furniture Assembly & Repair",
      },
    ],
  },
  {
    group: "7. Home Care, Facility & Logistics",
    items: [
      {
        value: "painting_waterproofing",
        label: "Painting & Waterproofing Services",
      },
      {
        value: "cleaning_pest_control",
        label: "Cleaning & Pest Control Services",
      },
      {
        value: "packers_movers",
        label: "Packers & Movers Service",
      },
      {
        value: "laundry_dry_cleaning",
        label: "Laundry & Dry Cleaning Service",
      },
    ],
  },
];

/**
 * Deduplicated flat list of all service categories for lookup and validation
 */
export const SERVICE_CATEGORIES: OptionItem[] = SERVICE_CATEGORY_GROUPS.flatMap(
  (g) => g.items
);

export const EXPERIENCE_RANGES: OptionItem[] = [
  { value: "1-2", label: "1 - 2 Years (Junior Technician)" },
  { value: "3-5", label: "3 - 5 Years (Experienced Professional)" },
  { value: "5-8", label: "5 - 8 Years (Senior Specialist)" },
  { value: "8+", label: "8+ Years (Master Technician / Team Lead)" },
];

/**
 * Comprehensive Hyderabad & Surrounding HMDA Localities
 * Categorized into 7 operational zones for seamless technician registration.
 */
export const HYDERABAD_LOCALITIES_BY_ZONE: LocalityGroup[] = [
  {
    zone: "1. IT Corridor & West Hyderabad (Cyberabad)",
    areas: [
      "Alkapur Township",
      "Allwyn Colony",
      "Banjara Hills",
      "Botanical Garden Road",
      "Chandanagar",
      "Deepthisri Nagar",
      "Film Nagar",
      "Financial District",
      "Gachibowli",
      "Gandipet",
      "Gopanpally",
      "Gowlidoddy",
      "Hafeezpet",
      "Hitec City",
      "Hydernagar",
      "Jubilee Hills",
      "Kavuri Hills",
      "Khajaguda",
      "Kokapet",
      "Kollur",
      "Kondapur",
      "Kothaguda",
      "Lingampally",
      "Madeenaguda",
      "Madhapur",
      "Madhura Nagar",
      "Manchirevula",
      "Manikonda",
      "Miyapur",
      "Nallagandla",
      "Nanakramguda",
      "Narsingi",
      "Neopolis Kokapet",
      "Osman Nagar",
      "Prashasan Nagar",
      "Puppalaguda",
      "Raidurg",
      "Serilingampally",
      "Shaikpet",
      "Shilparamam",
      "Srinagar Colony",
      "Tellapur",
      "Tolichowki",
      "Vattinagulapally",
      "Velimala",
      "Whitefields Kondapur",
      "Yousufguda",
    ],
  },
  {
    zone: "2. Central Hyderabad & Heritage",
    areas: [
      "Abids",
      "AC Guards",
      "Ameerpet",
      "Anand Nagar",
      "Ashok Nagar",
      "Balkampet",
      "Barkatpura",
      "Basheerbagh",
      "Begumpet",
      "Borabanda",
      "Chikkadpally",
      "Domalguda",
      "Erragadda",
      "Erramanzil",
      "Gandhinagar",
      "Himayatnagar",
      "Hussain Sagar Area",
      "Kachiguda",
      "Kavadiguda",
      "Khairatabad",
      "Koti",
      "Lakdikapul",
      "Lower Tank Bund",
      "Masab Tank",
      "Moosapet",
      "Musheerabad",
      "Nallakunta",
      "Nampally",
      "Narayanaguda",
      "Punjagutta",
      "Red Hills",
      "RTC X Roads",
      "Saifabad",
      "Sanathnagar",
      "Shantinagar",
      "Somajiguda",
      "SR Nagar",
      "Vengal Rao Nagar",
      "Vidyanagar",
    ],
  },
  {
    zone: "3. Secunderabad & Cantonment",
    areas: [
      "Alwal",
      "Ammuguda",
      "Anandbagh",
      "AS Rao Nagar",
      "Bolarum",
      "Bowenpally",
      "Cherlapally",
      "Chilkalguda",
      "Defence Colony Sainikpuri",
      "ECIL",
      "General Bazaar",
      "Gunrock Enclave",
      "Kakaguda",
      "Kalasiguda",
      "Kapra",
      "Karkhana",
      "Kowkoor",
      "Kushaiguda",
      "Lalaguda",
      "Lothkunta",
      "Macha Bolarum",
      "Malkajgiri",
      "Marredpally (East)",
      "Marredpally (West)",
      "Monda Market",
      "Moula Ali",
      "Namalagundu",
      "Neredmet",
      "Padmarao Nagar",
      "Paradise",
      "Parsigutta",
      "Rani Gunj",
      "Regimental Bazaar",
      "Safilguda",
      "Sainikpuri",
      "Secunderabad",
      "Sindhi Colony Secunderabad",
      "Sitaphalmandi",
      "Trimulgherry",
      "Vayupuri",
      "Warasiguda",
      "Yapral",
    ],
  },
  {
    zone: "4. North Hyderabad & Medchal Corridor",
    areas: [
      "Athvelly",
      "Bachupally",
      "Bahadurpally",
      "Balanagar",
      "Bolarum Industrial Area",
      "Bowrampet",
      "Chintal",
      "Dulapally",
      "Dundigal",
      "Fathenagar",
      "Ferozguda",
      "Gajularamaram",
      "Gandimaisamma",
      "Gundlapochampally",
      "IDPL Colony",
      "Jagathgirigutta",
      "Jeedimetla",
      "Kandlakoya",
      "Kompally",
      "KPHB Colony",
      "Kukatpally",
      "Mallampet",
      "Medchal",
      "Nizampet",
      "Petbasheerabad",
      "Pragathi Nagar",
      "Quthbullapur",
      "Shapurnagar",
      "Suchitra Circle",
      "Suraram",
    ],
  },
  {
    zone: "5. East Hyderabad & Uppal / Ghatkesar Corridor",
    areas: [
      "Anojiguda",
      "Auto Nagar",
      "Badangpet",
      "Bairamalguda",
      "Balapur",
      "BN Reddy Nagar",
      "Boduppal",
      "Chaitanyapuri",
      "Champapet",
      "Chengicherla",
      "Dilsukhnagar",
      "Gaddiannaram",
      "Ghatkesar",
      "Habsiguda",
      "Hasthinapuram",
      "Hayathnagar",
      "Injapur",
      "Karmanghat",
      "Korremula",
      "Kothapet",
      "LB Nagar",
      "Mallapur",
      "Mansoorabad",
      "Medipally",
      "Meerpet",
      "Nacharam",
      "Nagole",
      "Narapally",
      "Pedda Amberpet",
      "Peerzadiguda",
      "Pocharam",
      "Ramanthapur",
      "Sagar Ring Road",
      "Saroornagar",
      "Singapore Township",
      "Tarnaka",
      "Turkayamjal",
      "Uppal",
      "Uppal Bhagayath",
      "Vanasthalipuram",
    ],
  },
  {
    zone: "6. South Hyderabad & Old City",
    areas: [
      "Afzalgunj",
      "Aramghar",
      "Attapur",
      "Bahadurpura",
      "Bandlaguda Jagir",
      "Barkas",
      "Budvel",
      "Chandrayangutta",
      "Charminar",
      "Chatta Bazaar",
      "Dabeerpura",
      "Darulshifa",
      "Edi Bazaar",
      "Falaknuma",
      "Ghansi Bazaar",
      "Golconda",
      "Hussaini Alam",
      "Hydershakote",
      "Jalpally",
      "Kattedan",
      "Kismatpur",
      "Lad Bazaar",
      "Langer Houz",
      "Madannapet",
      "Mailardevpally",
      "Malakpet",
      "Mamidipally",
      "Mehdipatnam",
      "Mir Alam Mandi",
      "Moghalpura",
      "Noorkhan Bazaar",
      "Pahadi Shareef",
      "Pathergatti",
      "Purani Haveli",
      "Rajendranagar",
      "Rein Bazaar",
      "Riyasat Nagar",
      "Saidabad",
      "Santoshnagar",
      "Shah Ali Banda",
      "Shamshabad",
      "Shivrampally",
      "Sun City",
      "Umdanagar",
      "Yakutpura",
    ],
  },
  {
    zone: "7. Surrounding & HMDA Satellite Corridors",
    areas: [
      "Adibatla",
      "Aliabad",
      "Ameenpur",
      "Beeramguda",
      "Bibinagar",
      "Bongloor",
      "Chevella",
      "Fab City Raviryala",
      "Genome Valley",
      "Ibrahimpatnam",
      "Isnapur",
      "Kandi",
      "Kongara Kalan",
      "Kothur",
      "Maheshwaram",
      "Mokila",
      "Mucherla (Pharma City)",
      "Muthangi",
      "Patancheru",
      "Ramachandrapuram (RC Puram)",
      "Rudraram",
      "Sangareddy",
      "Shabad",
      "Shadnagar",
      "Shamirpet",
      "Shankarpally",
      "Sultanpur",
      "Thumkunta",
      "Tukkuguda",
    ],
  },
];

/**
 * Deduplicated, alphabetical flat list of all Hyderabad localities
 */
export const HYDERABAD_AREAS: string[] = Array.from(
  new Set(HYDERABAD_LOCALITIES_BY_ZONE.flatMap((z) => z.areas))
).sort((a, b) => a.localeCompare(b));

/** Normalize pasted country prefixes without changing a ten-digit mobile number. */
export function normalizeIndianMobileNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits;
}

export function validateRegistrationForm(data: RegistrationFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // 1. Full Name
  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  } else if (trimmedName.length > 70) {
    errors.fullName = "Name must not exceed 70 characters.";
  } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    errors.fullName = "Please enter a valid name (letters only).";
  }

  // 2. Phone Number (10-digit mobile number)
  const cleanedPhone = normalizeIndianMobileNumber(data.phoneNumber);
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
    errors.phoneNumber = "Please enter a valid 10-digit Indian mobile number.";
  }

  // 3. Hyderabad Area / Locality
  if (!data.city.trim()) {
    errors.city = "Please select your Hyderabad locality or surrounding area.";
  }

  // 4. Service Category
  if (!data.serviceCategory) {
    errors.serviceCategory = "Please select your service trade.";
  }

  // 5. Years of Experience
  if (!data.yearsOfExperience) {
    errors.yearsOfExperience = "Please select years of experience.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
