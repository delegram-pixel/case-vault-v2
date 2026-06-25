import type { CourtType } from "@/lib/types";

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT - Abuja",
] as const;

export const COURT_TYPES: {
  type: CourtType;
  blurb: string;
  jurisdiction: string;
}[] = [
  {
    type: "Magistrate Court",
    blurb: "Summary trials, minor civil and criminal matters.",
    jurisdiction: "State",
  },
  {
    type: "High Court",
    blurb: "Unlimited civil and criminal jurisdiction at state level.",
    jurisdiction: "State",
  },
  {
    type: "Customary Court",
    blurb: "Matters governed by customary law and tradition.",
    jurisdiction: "State",
  },
  {
    type: "Sharia Court",
    blurb: "Islamic personal law in northern states.",
    jurisdiction: "State",
  },
  {
    type: "Federal High Court",
    blurb: "Federal revenue, admiralty and constitutional matters.",
    jurisdiction: "Federal",
  },
  {
    type: "Court of Appeal",
    blurb: "Appellate review of High Court decisions.",
    jurisdiction: "Federal",
  },
];
