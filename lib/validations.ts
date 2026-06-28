import { z } from "zod";

export const ROLES = ["CLERK", "JUDGE", "ATTORNEY", "ADMIN"] as const;
export const CASE_STATUSES = ["Open", "Pending", "Closed"] as const;
export const HEARING_STATUSES = [
  "Scheduled",
  "Completed",
  "Adjourned",
  "Cancelled",
] as const;
export const PARTY_ROLES = ["Plaintiff", "Defendant", "Witness", "Other"] as const;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(ROLES),
    barNumber: z.string().optional(),
  })
  .refine((d) => d.role !== "ATTORNEY" || (d.barNumber && d.barNumber.length >= 3), {
    message: "Bar number is required for attorneys",
    path: ["barNumber"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetSchema = z.object({
  token: z.string().min(10, "Invalid reset link"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type ResetInput = z.infer<typeof resetSchema>;

export const createUserSchema = z.object({
  name: z.string().min(2, "Enter a full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const partySchema = z.object({
  name: z.string().min(2, "Enter a name"),
  role: z.enum(PARTY_ROLES),
});

export const attorneySchema = z.object({
  name: z.string().min(2, "Enter a name"),
  firm: z.string().optional(),
  representing: z.string().min(1, "Required"),
});

export const caseSchema = z.object({
  caseNumber: z.string().min(3, "Case number is too short"),
  title: z.string().min(5, "Give the case a descriptive title"),
  description: z.string().min(10, "Add a short description (10+ characters)"),
  status: z.enum(CASE_STATUSES),
  courtType: z.string().min(1, "Select a court type"),
  courtState: z.string().min(1, "Select a state"),
  judge: z.string().min(3, "Assign a presiding judge"),
  parties: z.array(partySchema).min(1, "Add at least one party"),
  attorneys: z.array(attorneySchema),
});
export type CaseInput = z.infer<typeof caseSchema>;

export const DOCKET_TYPES = [
  "Filing",
  "Service",
  "Response",
  "Order",
  "Motion",
  "Hearing",
  "Judgment",
  "Note",
] as const;

export const docketEntrySchema = z.object({
  docketType: z.enum(DOCKET_TYPES),
  docketText: z.string().min(3, "Add a short description"),
  filingParty: z.string().min(1, "Who filed this?"),
});
export type DocketEntryInput = z.infer<typeof docketEntrySchema>;

export const hearingSchema = z.object({
  caseId: z.string().min(1, "Select a case"),
  eventType: z.string().min(1),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  room: z.string().min(1, "Choose a room"),
  judge: z.string().min(3, "Assign a judge"),
});
export type HearingInput = z.infer<typeof hearingSchema>;
