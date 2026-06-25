"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Gavel,
  Mail,
  MessageSquare,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ALL_HEARINGS, type HearingWithCase } from "@/lib/aggregates";
import { CASES } from "@/lib/data";
import { cn, formatDateTime } from "@/lib/utils";

const ROOMS = ["Court 1", "Court 2", "Court 3", "Court 5", "Hall A"];
const EVENT_TYPES = [
  "Case Management Conference",
  "Mention",
  "Hearing",
  "Trial",
  "Mediation",
  "Judgment",
];

const STATUS_STYLES: Record<string, string> = {
  Scheduled: "bg-status-open-bg text-status-open",
  Completed: "bg-secondary text-secondary-foreground",
  Adjourned: "bg-status-pending-bg text-status-pending",
  Cancelled: "bg-status-closed-bg text-status-closed",
};

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HearingScheduler() {
  const [open, setOpen] = useState(false);
  const [hearings, setHearings] = useState<HearingWithCase[]>(ALL_HEARINGS);

  // form state
  const [caseId, setCaseId] = useState("");
  const [eventType, setEventType] = useState("Hearing");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [judge, setJudge] = useState("");

  // live conflict detection: same room OR same judge at the same date+time
  const conflict = useMemo(() => {
    if (!date || !time || (!room && !judge)) return null;
    const slot = `${date}T${time}`;
    return (
      hearings.find((h) => {
        if (h.status !== "Scheduled") return false;
        const sameSlot = h.dateTime.slice(0, 16) === slot;
        if (!sameSlot) return false;
        return (room && h.roomNumber === room) || (judge && h.judge === judge);
      }) ?? null
    );
  }, [date, time, room, judge, hearings]);

  const grouped = useMemo(() => {
    const map = new Map<string, HearingWithCase[]>();
    for (const h of [...hearings].sort((a, b) =>
      a.dateTime.localeCompare(b.dateTime)
    )) {
      const k = dayKey(h.dateTime);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(h);
    }
    return Array.from(map.entries());
  }, [hearings]);

  function reset() {
    setCaseId("");
    setEventType("Hearing");
    setDate("");
    setTime("");
    setRoom("");
    setJudge("");
  }

  function schedule() {
    if (!caseId || !date || !time || !room || !judge) {
      toast.error("Complete all fields to schedule a hearing.");
      return;
    }
    if (conflict) {
      toast.error("Scheduling conflict", {
        description: `${room} / ${judge} is already booked at that time.`,
      });
      return;
    }
    const c = CASES.find((x) => x.id === caseId)!;
    const newHearing: HearingWithCase = {
      id: `new-${Date.now()}`,
      eventType,
      dateTime: `${date}T${time}:00`,
      roomNumber: room,
      judge,
      status: "Scheduled",
      caseId: c.id,
      caseNumber: c.caseNumber,
      caseTitle: c.title,
      courtState: c.courtState,
    };
    setHearings((prev) => [...prev, newHearing]);
    toast.success("Hearing scheduled", {
      description: `${eventType} for ${c.caseNumber} · reminders queued.`,
    });
    setOpen(false);
    reset();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Calendar</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus /> Schedule hearing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a hearing</DialogTitle>
              <DialogDescription>
                We check the room and judge for clashes as you type.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              <div className="space-y-1.5">
                <Label>Case</Label>
                <Select value={caseId} onValueChange={setCaseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {CASES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.caseNumber} — {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Event type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Courtroom</Label>
                  <Select value={room} onValueChange={setRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Room" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOMS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="judge">Presiding judge</Label>
                <Input
                  id="judge"
                  placeholder="Hon. Justice O. Bello"
                  value={judge}
                  onChange={(e) => setJudge(e.target.value)}
                />
              </div>

              {conflict ? (
                <div className="bg-status-pending-bg text-status-pending flex items-start gap-2 rounded-lg p-3 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong>Conflict detected.</strong> {conflict.roomNumber} /{" "}
                    {conflict.judge} already has{" "}
                    <em>{conflict.eventType}</em> ({conflict.caseNumber}) at this
                    time.
                  </span>
                </div>
              ) : date && time && room && judge ? (
                <div className="bg-status-open-bg text-status-open flex items-center gap-2 rounded-lg p-3 text-sm">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Slot is free — no conflicts.
                </div>
              ) : null}

              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> Email reminder
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-3.5" /> SMS reminder
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={schedule} disabled={!!conflict}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <div className="mb-2 flex items-center gap-2">
              <CalendarClock className="text-muted-foreground size-4" />
              <h3 className="text-sm font-semibold">{day}</h3>
              <span className="text-muted-foreground text-xs">
                {items.length} sitting{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="bg-card divide-y rounded-xl border shadow-sm">
              {items.map((h) => (
                <div key={h.id} className="flex items-start gap-4 p-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold">
                      {new Date(h.dateTime).toLocaleTimeString("en-NG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs">{h.roomNumber}</p>
                  </div>
                  <div className="bg-secondary text-secondary-foreground grid size-9 shrink-0 place-items-center rounded-lg">
                    <Gavel className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{h.eventType}</p>
                    <Link
                      href={`/dashboard/cases/${h.caseId}`}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      {h.caseNumber} — {h.caseTitle}
                    </Link>
                    <p className="text-muted-foreground text-xs">{h.judge}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      STATUS_STYLES[h.status]
                    )}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
