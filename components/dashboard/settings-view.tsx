"use client";

import { useState } from "react";
import { Bell, Building2, Loader2, Lock, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURT_TYPES, NIGERIAN_STATES } from "@/lib/nigeria";

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-xl border shadow-sm">
      <div className="flex items-start gap-3 border-b p-5 sm:p-6">
        <div className="bg-secondary grid size-9 shrink-0 place-items-center rounded-lg">
          <Icon className="size-4" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export function SettingsView() {
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved");
    }, 800);
  }

  return (
    <div className="space-y-5">
      <SettingsCard
        icon={UserCog}
        title="Profile"
        description="How you appear across the registry."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Funke Adebayo" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="clerk@court.gov.ng" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue="+234 801 234 5678" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input value="Court Clerk" disabled />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Building2}
        title="Court assignment"
        description="The division you are filing for."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Court type</Label>
            <Select defaultValue="High Court">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURT_TYPES.map((c) => (
                  <SelectItem key={c.type} value={c.type}>
                    {c.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>State</Label>
            <Select defaultValue="Lagos">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="division">Division</Label>
            <Input id="division" defaultValue="Ikeja Division" />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Bell}
        title="Notifications"
        description="Choose how the registry reaches you."
      >
        <div className="divide-y">
          <ToggleRow
            id="n-email"
            label="Email notifications"
            description="Filings, orders and hearing changes."
            defaultChecked
          />
          <ToggleRow
            id="n-sms"
            label="SMS reminders"
            description="Hearing reminders 24 hours before a sitting."
            defaultChecked
          />
          <ToggleRow
            id="n-conflict"
            label="Conflict alerts"
            description="Warn me when a scheduling clash is detected."
            defaultChecked
          />
          <ToggleRow
            id="n-digest"
            label="Weekly digest"
            description="A Monday summary of the week's docket."
          />
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Lock}
        title="Security"
        description="Protect access to the registry."
      >
        <div className="divide-y">
          <ToggleRow
            id="s-2fa"
            label="Two-factor authentication"
            description="Require a one-time code at sign in."
            defaultChecked
          />
          <ToggleRow
            id="s-audit"
            label="Audit logging"
            description="Record every record access for review."
            defaultChecked
          />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw2">Confirm password</Label>
            <Input id="pw2" type="password" placeholder="••••••••" />
          </div>
        </div>
      </SettingsCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => toast.info("Changes discarded")}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="animate-spin" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
