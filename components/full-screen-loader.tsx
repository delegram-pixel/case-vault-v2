import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export function FullScreenLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="bg-background/85 fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
      <Logo showText={false} className="[&_span]:size-10 [&_svg]:size-5" />
      <div className="flex items-center gap-2">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}
