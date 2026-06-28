"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Gavel,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createCase } from "@/app/dashboard/cases/actions";
import { NIGERIAN_STATES, COURT_TYPES } from "@/lib/nigeria";

const partySchema = z.object({
  name: z.string().min(2, "Enter a name"),
  role: z.enum(["Plaintiff", "Defendant", "Witness", "Other"]),
});

const attorneySchema = z.object({
  name: z.string().min(2, "Enter a name"),
  firm: z.string().optional(),
  representing: z.string().min(1, "Required"),
});

const schema = z.object({
  caseNumber: z.string().min(3, "Case number is too short"),
  title: z.string().min(5, "Give the case a descriptive title"),
  description: z.string().min(10, "Add a short description (10+ characters)"),
  status: z.enum(["Open", "Pending", "Closed"]),
  courtType: z.string().min(1, "Select a court type"),
  courtState: z.string().min(1, "Select a state"),
  judge: z.string().min(3, "Assign a presiding judge"),
  parties: z.array(partySchema).min(1, "Add at least one party"),
  attorneys: z.array(attorneySchema),
});

type FormValues = z.infer<typeof schema>;

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-destructive text-xs">{msg}</p> : null;

function SectionHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-secondary grid size-9 shrink-0 place-items-center rounded-lg">
        <Icon className="size-4" />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}

export function CaseFilingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      caseNumber: "",
      title: "",
      description: "",
      status: "Open",
      courtType: "",
      courtState: "",
      judge: "",
      parties: [{ name: "", role: "Plaintiff" }],
      attorneys: [],
    },
  });

  const parties = useFieldArray({ control, name: "parties" });
  const attorneys = useFieldArray({ control, name: "attorneys" });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const res = await createCase(values);
    if (!res.ok) {
      setSubmitting(false);
      toast.error("Could not file case", { description: res.error });
      return;
    }
    toast.success("Case filed", {
      description: `${values.caseNumber} — ${values.title} added to the registry.`,
    });
    router.push(`/dashboard/cases/${res.id}`);
    router.refresh();
  }

  function onError() {
    toast.error("Please fix the highlighted fields");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      {/* Case details */}
      <section className="bg-card space-y-5 rounded-xl border p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={FileText}
          title="Case details"
          desc="The core identifiers for this matter."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="caseNumber">Case number *</Label>
            <Input
              id="caseNumber"
              placeholder="LD/0001/2026"
              className="font-mono"
              aria-invalid={!!errors.caseNumber}
              {...register("caseNumber")}
            />
            <FieldError msg={errors.caseNumber?.message} />
          </div>
          <div className="space-y-1.5">
            <Label>Status *</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Case title *</Label>
            <Input
              id="title"
              placeholder="Adeyemi v. Crestwood Properties Ltd"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            <FieldError msg={errors.title?.message} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Brief summary of the matter, relief sought, and key facts."
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            <FieldError msg={errors.description?.message} />
          </div>
        </div>
      </section>

      {/* Court & bench */}
      <section className="bg-card space-y-5 rounded-xl border p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={Gavel}
          title="Court & bench"
          desc="Where the case is filed and who presides."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Court type *</Label>
            <Controller
              control={control}
              name="courtType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.courtType}>
                    <SelectValue placeholder="Select court type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURT_TYPES.map((c) => (
                      <SelectItem key={c.type} value={c.type}>
                        {c.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError msg={errors.courtType?.message} />
          </div>
          <div className="space-y-1.5">
            <Label>State *</Label>
            <Controller
              control={control}
              name="courtState"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={!!errors.courtState}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError msg={errors.courtState?.message} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="judge">Presiding judge *</Label>
            <Input
              id="judge"
              placeholder="Hon. Justice O. Bello"
              aria-invalid={!!errors.judge}
              {...register("judge")}
            />
            <FieldError msg={errors.judge?.message} />
          </div>
        </div>
      </section>

      {/* Parties */}
      <section className="bg-card space-y-5 rounded-xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            icon={Users}
            title="Parties"
            desc="Plaintiffs, defendants, witnesses and others."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => parties.append({ name: "", role: "Defendant" })}
          >
            <Plus /> Add party
          </Button>
        </div>
        <FieldError msg={errors.parties?.message as string | undefined} />
        <div className="space-y-3">
          {parties.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-start"
            >
              <div className="space-y-1.5">
                <Input
                  placeholder="Party name"
                  aria-invalid={!!errors.parties?.[i]?.name}
                  {...register(`parties.${i}.name`)}
                />
                <FieldError msg={errors.parties?.[i]?.name?.message} />
              </div>
              <Controller
                control={control}
                name={`parties.${i}.role`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plaintiff">Plaintiff</SelectItem>
                      <SelectItem value="Defendant">Defendant</SelectItem>
                      <SelectItem value="Witness">Witness</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => parties.remove(i)}
                disabled={parties.fields.length === 1}
                aria-label="Remove party"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Attorneys */}
      <section className="bg-card space-y-5 rounded-xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            icon={UserPlus}
            title="Attorneys"
            desc="Representation on record (optional)."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              attorneys.append({ name: "", firm: "", representing: "" })
            }
          >
            <Plus /> Add attorney
          </Button>
        </div>
        {attorneys.fields.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
            No attorneys added. Litigants may appear in person.
          </p>
        ) : (
          <div className="space-y-3">
            {attorneys.fields.map((field, i) => (
              <div
                key={field.id}
                className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start"
              >
                <div className="space-y-1.5">
                  <Input
                    placeholder="Attorney name"
                    {...register(`attorneys.${i}.name`)}
                  />
                  <FieldError msg={errors.attorneys?.[i]?.name?.message} />
                </div>
                <Input placeholder="Firm" {...register(`attorneys.${i}.firm`)} />
                <div className="space-y-1.5">
                  <Input
                    placeholder="Representing (e.g. Plaintiff)"
                    {...register(`attorneys.${i}.representing`)}
                  />
                  <FieldError msg={errors.attorneys?.[i]?.representing?.message} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => attorneys.remove(i)}
                  aria-label="Remove attorney"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Documents */}
      <section className="bg-card space-y-5 rounded-xl border p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={UploadCloud}
          title="Documents"
          desc="Attach pleadings and exhibits (demo upload)."
        />
        <label className="border-input hover:bg-secondary/40 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors">
          <UploadCloud className="text-muted-foreground size-6" />
          <span className="text-sm font-medium">Click to upload or drag files</span>
          <span className="text-muted-foreground text-xs">
            PDF, DOCX or images up to 25 MB
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              setFiles((prev) => [...prev, ...names]);
              if (names.length) toast.success(`${names.length} file(s) attached`);
            }}
          />
        </label>
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f}-${i}`}
                className="bg-secondary/40 flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2 truncate">
                  <FileText className="text-muted-foreground size-4 shrink-0" />
                  <span className="truncate">{f}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove file"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Filing case…" : "File case"}
        </Button>
      </div>
    </form>
  );
}
