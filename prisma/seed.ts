import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CASES, COURTS } from "../lib/data";
import { VERIFICATIONS } from "../lib/admin-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Case Vault…");

  // Clean (order respects FKs; cascade handles children of Case)
  await prisma.notification.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.case.deleteMany();
  await prisma.court.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password", 10);

  // 4 demo users — one per role
  const demoUsers = [
    { name: "Funke Adebayo", email: "clerk@court.gov.ng", role: "CLERK", verified: true, verificationStatus: "Verified" },
    { name: "Hon. Justice O. Bello", email: "judge@court.gov.ng", role: "JUDGE", verified: true, verificationStatus: "Verified" },
    {
      name: "Barr. Funke Adebayo",
      email: "attorney@court.gov.ng",
      role: "ATTORNEY",
      verified: true,
      verificationStatus: "Verified",
      barNumber: "SCN/045128",
      firm: "Adebayo & Co.",
      state: "Lagos",
      yearCalled: 2011,
    },
    { name: "System Administrator", email: "admin@court.gov.ng", role: "ADMIN", verified: true, verificationStatus: "Verified" },
  ];

  for (const u of demoUsers) {
    await prisma.user.create({ data: { ...u, passwordHash } });
  }

  // Attorney applicants (verification queue) → ATTORNEY users
  for (const v of VERIFICATIONS) {
    if (v.email === "attorney@court.gov.ng") continue;
    await prisma.user.create({
      data: {
        name: v.name,
        email: v.email,
        passwordHash,
        role: "ATTORNEY",
        verified: v.status === "Verified",
        verificationStatus: v.status,
        barNumber: v.barNumber,
        firm: v.firm === "—" ? null : v.firm,
        state: v.state,
        yearCalled: v.yearCalled,
        createdAt: new Date(v.submittedOn),
      },
    });
  }

  // Courts
  for (const c of COURTS) {
    await prisma.court.create({
      data: {
        name: c.name,
        type: c.type,
        state: c.state,
        address: c.address,
        phone: c.phone,
        hours: c.hours,
        rating: c.rating,
      },
    });
  }

  // Cases with nested relations
  const clerk = await prisma.user.findUnique({
    where: { email: "clerk@court.gov.ng" },
  });

  for (const c of CASES) {
    await prisma.case.create({
      data: {
        caseNumber: c.caseNumber,
        title: c.title,
        description: c.description,
        status: c.status,
        filingDate: new Date(c.filingDate),
        judgeName: c.judge,
        courtType: c.courtType,
        courtState: c.courtState,
        createdById: clerk?.id ?? null,
        parties: {
          create: c.parties.map((p) => ({ name: p.name, role: p.role })),
        },
        attorneys: {
          create: c.attorneys.map((a) => ({
            name: a.name,
            firm: a.firm,
            representing: a.representing,
            barNumber: a.barNumber,
          })),
        },
        documents: {
          create: c.documents.map((d) => ({
            name: d.name,
            type: d.type,
            url: "#",
            size: d.size,
            uploadDate: new Date(d.uploadDate),
          })),
        },
        docket: {
          create: c.docket.map((d) => ({
            filingDate: new Date(d.filingDate),
            docketType: d.docketType,
            docketText: d.docketText,
            filingParty: d.filingParty,
          })),
        },
        hearings: {
          create: c.hearings.map((h) => ({
            eventType: h.eventType,
            dateTime: new Date(h.dateTime),
            roomNumber: h.roomNumber,
            judgeName: h.judge,
            status: h.status,
          })),
        },
        service: {
          create: c.service.map((s) => ({
            party: s.party,
            method: s.method,
            servedOn: new Date(s.servedOn),
            status: s.status,
          })),
        },
      },
    });
  }

  const counts = {
    users: await prisma.user.count(),
    courts: await prisma.court.count(),
    cases: await prisma.case.count(),
    hearings: await prisma.hearing.count(),
  };
  console.log("✅  Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
