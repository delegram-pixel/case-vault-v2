import type { CaseRecord, CourtBranch } from "@/lib/types";

export const COURTS: CourtBranch[] = [
  {
    id: "ct-1",
    name: "Lagos State High Court — Ikeja Division",
    type: "High Court",
    state: "Lagos",
    address: "High Court Complex, Oba Akinjobi Way, Ikeja, Lagos",
    phone: "+234 1 271 4500",
    hours: "Mon–Fri, 8:00 AM – 4:00 PM",
    rating: 4.6,
  },
  {
    id: "ct-2",
    name: "Lagos Magistrate Court — Yaba",
    type: "Magistrate Court",
    state: "Lagos",
    address: "Murtala Mohammed Way, Yaba, Lagos",
    phone: "+234 1 277 8810",
    hours: "Mon–Fri, 8:30 AM – 4:00 PM",
    rating: 4.1,
  },
  {
    id: "ct-3",
    name: "FCT High Court — Maitama",
    type: "High Court",
    state: "FCT - Abuja",
    address: "Plot 1234, Mohammed Bello Cl, Maitama, Abuja",
    phone: "+234 9 461 2200",
    hours: "Mon–Fri, 8:00 AM – 4:00 PM",
    rating: 4.7,
  },
  {
    id: "ct-4",
    name: "Federal High Court — Abuja Division",
    type: "Federal High Court",
    state: "FCT - Abuja",
    address: "Shehu Shagari Way, Central Business District, Abuja",
    phone: "+234 9 461 9000",
    hours: "Mon–Fri, 8:00 AM – 4:00 PM",
    rating: 4.4,
  },
  {
    id: "ct-5",
    name: "Kano State Sharia Court of Appeal",
    type: "Sharia Court",
    state: "Kano",
    address: "Court Road, Kano Municipal, Kano",
    phone: "+234 64 631 200",
    hours: "Mon–Fri, 8:00 AM – 3:30 PM",
    rating: 4.2,
  },
  {
    id: "ct-6",
    name: "Rivers State High Court — Port Harcourt",
    type: "High Court",
    state: "Rivers",
    address: "Moscow Road, Port Harcourt, Rivers",
    phone: "+234 84 230 110",
    hours: "Mon–Fri, 8:30 AM – 4:00 PM",
    rating: 4.3,
  },
  {
    id: "ct-7",
    name: "Oyo State Customary Court — Ibadan",
    type: "Customary Court",
    state: "Oyo",
    address: "Mapo Hall Road, Ibadan, Oyo",
    phone: "+234 2 810 4422",
    hours: "Mon–Fri, 9:00 AM – 3:30 PM",
    rating: 3.9,
  },
  {
    id: "ct-8",
    name: "Court of Appeal — Lagos Division",
    type: "Court of Appeal",
    state: "Lagos",
    address: "Tinubu Square, Lagos Island, Lagos",
    phone: "+234 1 263 0044",
    hours: "Mon–Fri, 8:00 AM – 4:00 PM",
    rating: 4.5,
  },
];

export const CASES: CaseRecord[] = [
  {
    id: "1",
    caseNumber: "LD/2451/2026",
    title: "Adeyemi v. Crestwood Properties Ltd",
    description:
      "Breach of contract claim arising from a disputed land sale agreement in Lekki Phase 1. Plaintiff seeks specific performance and damages.",
    status: "Open",
    filingDate: "2026-02-12",
    judge: "Hon. Justice O. Bello",
    courtType: "High Court",
    courtState: "Lagos",
    parties: [
      { id: "p1", name: "Tunde Adeyemi", role: "Plaintiff" },
      { id: "p2", name: "Crestwood Properties Ltd", role: "Defendant" },
      { id: "p3", name: "Ngozi Okafor", role: "Witness" },
    ],
    attorneys: [
      {
        id: "a1",
        name: "Barr. Funke Adebayo",
        firm: "Adebayo & Co.",
        representing: "Plaintiff",
        barNumber: "SCN/045128",
      },
      {
        id: "a2",
        name: "Barr. Emeka Nwosu",
        firm: "Nwosu Partners",
        representing: "Defendant",
        barNumber: "SCN/039847",
      },
    ],
    documents: [
      { id: "d1", name: "Statement of Claim.pdf", type: "Pleading", size: "248 KB", uploadDate: "2026-02-12" },
      { id: "d2", name: "Sale Agreement (Exhibit A).pdf", type: "Exhibit", size: "1.2 MB", uploadDate: "2026-02-12" },
      { id: "d3", name: "Survey Plan.pdf", type: "Exhibit", size: "880 KB", uploadDate: "2026-02-20" },
    ],
    docket: [
      { id: "e1", filingDate: "2026-02-12", docketType: "Filing", docketText: "Originating summons and statement of claim filed.", filingParty: "Plaintiff" },
      { id: "e2", filingDate: "2026-02-19", docketType: "Service", docketText: "Defendant served via registered courier.", filingParty: "Court" },
      { id: "e3", filingDate: "2026-03-04", docketType: "Response", docketText: "Statement of defence filed by Defendant.", filingParty: "Defendant" },
      { id: "e4", filingDate: "2026-03-18", docketType: "Order", docketText: "Matter adjourned for case management conference.", filingParty: "Court" },
    ],
    hearings: [
      { id: "h1", eventType: "Case Management Conference", dateTime: "2026-04-09T10:00:00", roomNumber: "Court 3", judge: "Hon. Justice O. Bello", status: "Completed" },
      { id: "h2", eventType: "Hearing — Plaintiff Witnesses", dateTime: "2026-07-02T09:30:00", roomNumber: "Court 3", judge: "Hon. Justice O. Bello", status: "Scheduled" },
    ],
    service: [
      { id: "s1", party: "Crestwood Properties Ltd", method: "Registered Courier", servedOn: "2026-02-19", status: "Served" },
      { id: "s2", party: "Ngozi Okafor", method: "Personal Service", servedOn: "2026-03-30", status: "Pending" },
    ],
  },
  {
    id: "2",
    caseNumber: "ABJ/0912/2026",
    title: "Federal Republic v. Danladi",
    description:
      "Criminal prosecution for alleged fraud and misappropriation of public funds. Accused arraigned on a seven-count charge.",
    status: "Pending",
    filingDate: "2026-01-28",
    judge: "Hon. Justice A. Mohammed",
    courtType: "Federal High Court",
    courtState: "FCT - Abuja",
    parties: [
      { id: "p4", name: "Federal Republic of Nigeria", role: "Plaintiff" },
      { id: "p5", name: "Sani Danladi", role: "Defendant" },
    ],
    attorneys: [
      { id: "a3", name: "Barr. Hauwa Yusuf", firm: "Federal Ministry of Justice", representing: "Plaintiff", barNumber: "SCN/028394" },
      { id: "a4", name: "Barr. Chidi Eze", firm: "Eze Chambers", representing: "Defendant", barNumber: "SCN/051203" },
    ],
    documents: [
      { id: "d4", name: "Charge Sheet.pdf", type: "Charge", size: "320 KB", uploadDate: "2026-01-28" },
      { id: "d5", name: "Proof of Evidence.pdf", type: "Evidence", size: "4.1 MB", uploadDate: "2026-02-02" },
    ],
    docket: [
      { id: "e5", filingDate: "2026-01-28", docketType: "Filing", docketText: "Seven-count charge filed by prosecution.", filingParty: "Plaintiff" },
      { id: "e6", filingDate: "2026-02-10", docketType: "Arraignment", docketText: "Accused arraigned; pleaded not guilty on all counts.", filingParty: "Court" },
      { id: "e7", filingDate: "2026-02-10", docketType: "Order", docketText: "Bail granted in the sum of ₦50m with two sureties.", filingParty: "Court" },
    ],
    hearings: [
      { id: "h3", eventType: "Arraignment", dateTime: "2026-02-10T09:00:00", roomNumber: "Court 1", judge: "Hon. Justice A. Mohammed", status: "Completed" },
      { id: "h4", eventType: "Trial — Prosecution Opens", dateTime: "2026-06-30T10:00:00", roomNumber: "Court 1", judge: "Hon. Justice A. Mohammed", status: "Scheduled" },
    ],
    service: [
      { id: "s3", party: "Sani Danladi", method: "Personal Service", servedOn: "2026-02-03", status: "Served" },
    ],
  },
  {
    id: "3",
    caseNumber: "PH/1187/2025",
    title: "Okoro v. Niger Delta Bank Plc",
    description:
      "Wrongful dismissal and unpaid entitlements claim brought by a former branch manager.",
    status: "Closed",
    filingDate: "2025-09-15",
    judge: "Hon. Justice E. Wike",
    courtType: "High Court",
    courtState: "Rivers",
    parties: [
      { id: "p6", name: "Chinedu Okoro", role: "Plaintiff" },
      { id: "p7", name: "Niger Delta Bank Plc", role: "Defendant" },
    ],
    attorneys: [
      { id: "a5", name: "Barr. Ibinabo George", firm: "George & Associates", representing: "Plaintiff", barNumber: "SCN/033019" },
    ],
    documents: [
      { id: "d6", name: "Employment Contract.pdf", type: "Exhibit", size: "540 KB", uploadDate: "2025-09-15" },
      { id: "d7", name: "Final Judgment.pdf", type: "Judgment", size: "210 KB", uploadDate: "2026-01-20" },
    ],
    docket: [
      { id: "e8", filingDate: "2025-09-15", docketType: "Filing", docketText: "Claim filed for wrongful dismissal.", filingParty: "Plaintiff" },
      { id: "e9", filingDate: "2026-01-20", docketType: "Judgment", docketText: "Judgment entered for the Plaintiff; ₦12m awarded.", filingParty: "Court" },
    ],
    hearings: [
      { id: "h5", eventType: "Judgment", dateTime: "2026-01-20T11:00:00", roomNumber: "Court 5", judge: "Hon. Justice E. Wike", status: "Completed" },
    ],
    service: [
      { id: "s4", party: "Niger Delta Bank Plc", method: "Corporate Service", servedOn: "2025-09-22", status: "Served" },
    ],
  },
  {
    id: "4",
    caseNumber: "LD/3380/2026",
    title: "Bright Future Schools v. Lagos State Govt",
    description:
      "Judicial review challenging the revocation of an operating licence. Applicant seeks an order of certiorari.",
    status: "Open",
    filingDate: "2026-03-30",
    judge: "Hon. Justice O. Bello",
    courtType: "High Court",
    courtState: "Lagos",
    parties: [
      { id: "p8", name: "Bright Future Schools Ltd", role: "Plaintiff" },
      { id: "p9", name: "Lagos State Government", role: "Defendant" },
    ],
    attorneys: [
      { id: "a6", name: "Barr. Funke Adebayo", firm: "Adebayo & Co.", representing: "Plaintiff", barNumber: "SCN/045128" },
    ],
    documents: [
      { id: "d8", name: "Motion on Notice.pdf", type: "Motion", size: "190 KB", uploadDate: "2026-03-30" },
    ],
    docket: [
      { id: "e10", filingDate: "2026-03-30", docketType: "Filing", docketText: "Application for judicial review filed.", filingParty: "Plaintiff" },
    ],
    hearings: [
      { id: "h6", eventType: "Leave Hearing", dateTime: "2026-07-15T10:00:00", roomNumber: "Court 3", judge: "Hon. Justice O. Bello", status: "Scheduled" },
    ],
    service: [
      { id: "s5", party: "Lagos State Government", method: "Service on AG", servedOn: "2026-04-05", status: "Pending" },
    ],
  },
  {
    id: "5",
    caseNumber: "KN/0455/2026",
    title: "Aliyu v. Garba",
    description:
      "Inheritance dispute under Islamic personal law regarding the distribution of a deceased estate.",
    status: "Pending",
    filingDate: "2026-02-25",
    judge: "Hon. Khadi I. Sani",
    courtType: "Sharia Court",
    courtState: "Kano",
    parties: [
      { id: "p10", name: "Musa Aliyu", role: "Plaintiff" },
      { id: "p11", name: "Bashir Garba", role: "Defendant" },
    ],
    attorneys: [],
    documents: [
      { id: "d9", name: "Estate Inventory.pdf", type: "Exhibit", size: "300 KB", uploadDate: "2026-02-25" },
    ],
    docket: [
      { id: "e11", filingDate: "2026-02-25", docketType: "Filing", docketText: "Petition for estate distribution filed.", filingParty: "Plaintiff" },
    ],
    hearings: [
      { id: "h7", eventType: "Mediation", dateTime: "2026-07-01T09:00:00", roomNumber: "Hall A", judge: "Hon. Khadi I. Sani", status: "Scheduled" },
    ],
    service: [
      { id: "s6", party: "Bashir Garba", method: "Personal Service", servedOn: "2026-03-01", status: "Served" },
    ],
  },
  {
    id: "6",
    caseNumber: "IB/0771/2026",
    title: "Ogunyemi Family v. Adewale",
    description:
      "Customary land boundary dispute between two families in Ibadan North.",
    status: "Open",
    filingDate: "2026-04-02",
    judge: "Hon. President M. Ojo",
    courtType: "Customary Court",
    courtState: "Oyo",
    parties: [
      { id: "p12", name: "Ogunyemi Family", role: "Plaintiff" },
      { id: "p13", name: "Rasheed Adewale", role: "Defendant" },
    ],
    attorneys: [],
    documents: [],
    docket: [
      { id: "e12", filingDate: "2026-04-02", docketType: "Filing", docketText: "Boundary dispute petition filed.", filingParty: "Plaintiff" },
    ],
    hearings: [
      { id: "h8", eventType: "First Hearing", dateTime: "2026-07-08T09:30:00", roomNumber: "Court 2", judge: "Hon. President M. Ojo", status: "Scheduled" },
    ],
    service: [
      { id: "s7", party: "Rasheed Adewale", method: "Personal Service", servedOn: "2026-04-10", status: "Pending" },
    ],
  },
];

export function getCase(id: string) {
  return CASES.find((c) => c.id === id || c.caseNumber === id);
}
