"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
  "Pleading",
  "Exhibit",
  "Motion",
  "Order",
  "Judgment",
  "Charge",
  "Evidence",
  "Other",
];

export function DocumentUploader({ caseId }: { caseId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState("Pleading");
  const [dragging, setDragging] = useState(false);

  const { startUpload, isUploading } = useUploadThing("caseDocument", {
    onClientUploadComplete: (res) => {
      toast.success(
        `${res?.length ?? 0} document${res?.length === 1 ? "" : "s"} uploaded`
      );
      router.refresh();
    },
    onUploadError: (e) => {
      toast.error("Upload failed", { description: e.message });
    },
  });

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    startUpload(Array.from(files), { caseId, type });
  }

  return (
    <div className="bg-card space-y-3 rounded-xl border p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label>Document type</Label>
          <Select value={type} onValueChange={setType} disabled={isUploading}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "border-input hover:bg-secondary/40 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors disabled:opacity-60",
          dragging && "border-foreground bg-secondary/40"
        )}
      >
        {isUploading ? (
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        ) : (
          <UploadCloud className="text-muted-foreground size-6" />
        )}
        <span className="text-sm font-medium">
          {isUploading ? "Uploading…" : "Click to upload or drag files here"}
        </span>
        <span className="text-muted-foreground text-xs">
          Any file up to 16 MB · stored securely off-site
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </button>
    </div>
  );
}
