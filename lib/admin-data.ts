export type VerificationStatus = "Pending" | "Verified" | "Rejected";

export interface LawyerVerification {
  id: string;
  name: string;
  email: string;
  firm: string;
  barNumber: string;
  yearCalled: number;
  state: string;
  submittedOn: string;
  status: VerificationStatus;
}

export const VERIFICATIONS: LawyerVerification[] = [
  {
    id: "v1",
    name: "Barr. Funke Adebayo",
    email: "funke@adebayolaw.ng",
    firm: "Adebayo & Co.",
    barNumber: "SCN/045128",
    yearCalled: 2011,
    state: "Lagos",
    submittedOn: "2026-06-22",
    status: "Pending",
  },
  {
    id: "v2",
    name: "Barr. Emeka Nwosu",
    email: "emeka@nwosupartners.ng",
    firm: "Nwosu Partners",
    barNumber: "SCN/039847",
    yearCalled: 2008,
    state: "Anambra",
    submittedOn: "2026-06-21",
    status: "Pending",
  },
  {
    id: "v3",
    name: "Barr. Aisha Bello",
    email: "aisha.bello@chambers.ng",
    firm: "Bello Legal",
    barNumber: "SCN/061204",
    yearCalled: 2016,
    state: "FCT - Abuja",
    submittedOn: "2026-06-20",
    status: "Pending",
  },
  {
    id: "v4",
    name: "Barr. Ibinabo George",
    email: "ib@georgeassociates.ng",
    firm: "George & Associates",
    barNumber: "SCN/033019",
    yearCalled: 2006,
    state: "Rivers",
    submittedOn: "2026-06-12",
    status: "Verified",
  },
  {
    id: "v5",
    name: "Barr. Chidi Eze",
    email: "chidi@ezechambers.ng",
    firm: "Eze Chambers",
    barNumber: "SCN/051203",
    yearCalled: 2014,
    state: "Enugu",
    submittedOn: "2026-06-10",
    status: "Verified",
  },
  {
    id: "v6",
    name: "Tobechukwu Mba",
    email: "tobe.mba@gmail.com",
    firm: "—",
    barNumber: "SCN/000000",
    yearCalled: 2024,
    state: "Imo",
    submittedOn: "2026-06-08",
    status: "Rejected",
  },
];
