import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

const EDIT_ROLES = ["CLERK", "ADMIN"];

export const ourFileRouter = {
  // Case document upload — any file type up to 16MB, max 10 per drop.
  caseDocument: f({ blob: { maxFileSize: "16MB", maxFileCount: 10 } })
    .input(z.object({ caseId: z.string().min(1), type: z.string().min(1) }))
    .middleware(async ({ input }) => {
      const session = await getServerSession(authOptions);
      const user = session?.user;
      if (!user) throw new UploadThingError("You must be signed in.");
      if (!EDIT_ROLES.includes(user.role)) {
        throw new UploadThingError("Your role cannot upload documents.");
      }
      const found = await prisma.case.findUnique({
        where: { id: input.caseId },
        select: { id: true },
      });
      if (!found) throw new UploadThingError("Case not found.");

      return { userId: user.id, userName: user.name, caseId: input.caseId, docType: input.type };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.document.create({
        data: {
          caseId: metadata.caseId,
          name: file.name,
          type: metadata.docType,
          url: file.url,
          key: file.key,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedById: metadata.userId,
        },
      });
      // Record the filing on the docket.
      await prisma.docketEntry.create({
        data: {
          caseId: metadata.caseId,
          docketType: "Filing",
          docketText: `Document uploaded: ${file.name} (${metadata.docType}).`,
          filingParty: metadata.userName ?? "Registry",
        },
      });
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
