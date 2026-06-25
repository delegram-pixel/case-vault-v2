import { CASES } from "@/lib/data";
import type {
  Attorney,
  CaseDocument,
  DocketEntry,
  Hearing,
  Party,
} from "@/lib/types";

export interface CaseRef {
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  courtState: string;
}

export type HearingWithCase = Hearing & CaseRef;
export type DocumentWithCase = CaseDocument & CaseRef;
export type DocketWithCase = DocketEntry & CaseRef;
export type PartyWithCase = Party & CaseRef;
export type AttorneyWithCase = Attorney & CaseRef;

function ref(c: (typeof CASES)[number]): CaseRef {
  return {
    caseId: c.id,
    caseNumber: c.caseNumber,
    caseTitle: c.title,
    courtState: c.courtState,
  };
}

export const ALL_HEARINGS: HearingWithCase[] = CASES.flatMap((c) =>
  c.hearings.map((h) => ({ ...h, ...ref(c) }))
).sort((a, b) => a.dateTime.localeCompare(b.dateTime));

export const ALL_DOCUMENTS: DocumentWithCase[] = CASES.flatMap((c) =>
  c.documents.map((d) => ({ ...d, ...ref(c) }))
).sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));

export const ALL_DOCKET: DocketWithCase[] = CASES.flatMap((c) =>
  c.docket.map((d) => ({ ...d, ...ref(c) }))
).sort((a, b) => b.filingDate.localeCompare(a.filingDate));

export const ALL_PARTIES: PartyWithCase[] = CASES.flatMap((c) =>
  c.parties.map((p) => ({ ...p, ...ref(c) }))
);

export const ALL_ATTORNEYS: AttorneyWithCase[] = CASES.flatMap((c) =>
  c.attorneys.map((a) => ({ ...a, ...ref(c) }))
);
