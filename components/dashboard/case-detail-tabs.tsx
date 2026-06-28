"use client";

import {
  CalendarClock,
  Download,
  FileText,
  Gavel,
  MailCheck,
  ListChecks,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AddAttorneyDialog,
  AddDocketDialog,
  AddPartyDialog,
  RemoveItemButton,
} from "@/components/dashboard/case-detail-editors";
import { DocumentUploader } from "@/components/dashboard/document-uploader";
import { DeleteDocumentButton } from "@/components/dashboard/case-detail-editors";
import type { CaseRecord } from "@/lib/types";
import { cn, formatDate, formatDateTime, initials } from "@/lib/utils";

const HEARING_STYLES: Record<string, string> = {
  Scheduled: "bg-status-open-bg text-status-open",
  Completed: "bg-secondary text-secondary-foreground",
  Adjourned: "bg-status-pending-bg text-status-pending",
  Cancelled: "bg-status-closed-bg text-status-closed",
};

const SERVICE_STYLES: Record<string, string> = {
  Served: "bg-status-open-bg text-status-open",
  Pending: "bg-status-pending-bg text-status-pending",
  Failed: "bg-status-closed-bg text-status-closed",
};

function EmptyState({ label }: { label: string }) {
  return (
    <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
      {label}
    </p>
  );
}

export function CaseDetailTabs({
  caseRecord: c,
  canEdit = false,
  canDocket = false,
  userName = "Registry",
}: {
  caseRecord: CaseRecord;
  canEdit?: boolean;
  canDocket?: boolean;
  userName?: string;
}) {
  const tabs = [
    { value: "parties", label: "Parties", icon: Users, count: c.parties.length },
    { value: "attorneys", label: "Attorneys", icon: UserCheck, count: c.attorneys.length },
    { value: "docket", label: "Docket", icon: ListChecks, count: c.docket.length },
    { value: "schedule", label: "Schedule", icon: CalendarClock, count: c.hearings.length },
    { value: "service", label: "Service", icon: MailCheck, count: c.service.length },
    { value: "documents", label: "Documents", icon: FileText, count: c.documents.length },
  ];

  return (
    <Tabs defaultValue="parties">
      <div className="overflow-x-auto">
        <TabsList className="h-auto flex-nowrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              <t.icon className="size-3.5" />
              {t.label}
              <span className="text-muted-foreground ml-0.5 text-xs">{t.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Parties */}
      <TabsContent value="parties" className="mt-4 space-y-3">
        {canEdit && (
          <div className="flex justify-end">
            <AddPartyDialog caseId={c.id} />
          </div>
        )}
        <div className="bg-card rounded-xl border shadow-sm">
          {c.parties.length ? (
            <ul className="divide-y">
              {c.parties.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <Avatar>
                    <AvatarFallback>{initials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-muted-foreground text-xs">Party to the case</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {p.role}
                  </Badge>
                  {canEdit && (
                    <RemoveItemButton caseId={c.id} id={p.id} kind="party" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState label="No parties recorded." />
            </div>
          )}
        </div>
      </TabsContent>

      {/* Attorneys */}
      <TabsContent value="attorneys" className="mt-4 space-y-3">
        {canEdit && (
          <div className="flex justify-end">
            <AddAttorneyDialog caseId={c.id} />
          </div>
        )}
        <div className="bg-card rounded-xl border shadow-sm">
          {c.attorneys.length ? (
            <ul className="divide-y">
              {c.attorneys.map((a) => (
                <li key={a.id} className="flex items-center gap-3 p-4">
                  <Avatar>
                    <AvatarFallback>{initials(a.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {a.name}
                      <UserCheck className="text-status-open size-3.5" />
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {a.firm}
                      {a.barNumber ? ` · ${a.barNumber}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    for {a.representing}
                  </Badge>
                  {canEdit && (
                    <RemoveItemButton caseId={c.id} id={a.id} kind="attorney" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState label="No attorneys on record. Litigants appear in person." />
            </div>
          )}
        </div>
      </TabsContent>

      {/* Docket */}
      <TabsContent value="docket" className="mt-4 space-y-3">
        {canDocket && (
          <div className="flex justify-end">
            <AddDocketDialog caseId={c.id} filingParty={userName} />
          </div>
        )}
        <div className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
          {c.docket.length ? (
            <ol className="relative space-y-6">
              <span className="bg-border absolute top-1 bottom-1 left-[7px] w-px" />
              {[...c.docket].reverse().map((e) => (
                <li key={e.id} className="relative pl-7">
                  <span className="bg-background ring-border absolute top-1 left-0 size-3.5 rounded-full ring-2">
                    <span className="bg-foreground absolute inset-1 rounded-full" />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {e.docketType}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(e.filingDate)} · filed by {e.filingParty}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm">{e.docketText}</p>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState label="No docket entries yet." />
          )}
        </div>
      </TabsContent>

      {/* Schedule */}
      <TabsContent value="schedule" className="mt-4">
        <div className="bg-card rounded-xl border shadow-sm">
          {c.hearings.length ? (
            <ul className="divide-y">
              {c.hearings.map((h) => (
                <li key={h.id} className="flex items-start gap-4 p-4">
                  <div className="bg-secondary text-secondary-foreground grid size-10 shrink-0 place-items-center rounded-lg">
                    <Gavel className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.eventType}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDateTime(h.dateTime)} · {h.roomNumber} · {h.judge}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      HEARING_STYLES[h.status]
                    )}
                  >
                    {h.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState label="No hearings scheduled." />
            </div>
          )}
        </div>
      </TabsContent>

      {/* Service */}
      <TabsContent value="service" className="mt-4">
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          {c.service.length ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead>Party</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.service.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.party}</TableCell>
                    <TableCell>{s.method}</TableCell>
                    <TableCell>{formatDate(s.servedOn)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          SERVICE_STYLES[s.status]
                        )}
                      >
                        {s.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4">
              <EmptyState label="No service records." />
            </div>
          )}
        </div>
      </TabsContent>

      {/* Documents */}
      <TabsContent value="documents" className="mt-4 space-y-3">
        {canEdit && <DocumentUploader caseId={c.id} />}
        <div className="bg-card rounded-xl border shadow-sm">
          {c.documents.length ? (
            <ul className="divide-y">
              {c.documents.map((d) => {
                const hasFile = !!d.url && d.url !== "#";
                return (
                  <li key={d.id} className="flex items-center gap-3 p-4">
                    <div className="bg-secondary grid size-10 shrink-0 place-items-center rounded-lg">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {d.type} · {d.size} · {formatDate(d.uploadDate)}
                      </p>
                    </div>
                    {hasFile ? (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary grid size-8 place-items-center rounded-md transition-colors"
                        aria-label="Open document"
                      >
                        <Download className="size-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() =>
                          toast.info("Sample record — no file attached.")
                        }
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary grid size-8 place-items-center rounded-md transition-colors"
                        aria-label="Download"
                      >
                        <Download className="size-4" />
                      </button>
                    )}
                    {canEdit && (
                      <DeleteDocumentButton caseId={c.id} documentId={d.id} />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState label="No documents uploaded yet." />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
