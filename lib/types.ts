export type Role = "CLERK" | "JUDGE" | "ATTORNEY" | "ADMIN" | "PUBLIC";

export type CaseStatus = "Open" | "Pending" | "Closed";

export type PartyRole = "Plaintiff" | "Defendant" | "Witness" | "Other";

export type CourtType =
  | "Magistrate Court"
  | "High Court"
  | "Customary Court"
  | "Sharia Court"
  | "Court of Appeal"
  | "Federal High Court";

export interface Party {
  id: string;
  name: string;
  role: PartyRole;
}

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  representing: string;
  barNumber: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

export interface DocketEntry {
  id: string;
  filingDate: string;
  docketType: string;
  docketText: string;
  filingParty: string;
}

export interface Hearing {
  id: string;
  eventType: string;
  dateTime: string;
  roomNumber: string;
  judge: string;
  status: "Scheduled" | "Completed" | "Adjourned" | "Cancelled";
}

export interface ServiceRecord {
  id: string;
  party: string;
  method: string;
  servedOn: string;
  status: "Served" | "Pending" | "Failed";
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  filingDate: string;
  judge: string;
  courtType: CourtType;
  courtState: string;
  parties: Party[];
  attorneys: Attorney[];
  documents: CaseDocument[];
  docket: DocketEntry[];
  hearings: Hearing[];
  service: ServiceRecord[];
}

export interface CourtBranch {
  id: string;
  name: string;
  type: CourtType;
  state: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
}
