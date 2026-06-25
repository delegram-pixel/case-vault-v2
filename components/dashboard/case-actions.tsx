"use client";

import { Printer, Pencil, MoreHorizontal, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CaseActions({ caseNumber }: { caseNumber: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          toast.success("Preparing record", {
            description: `${caseNumber} sent to the print queue.`,
          });
          setTimeout(() => window.print(), 400);
        }}
      >
        <Printer /> Print record
      </Button>
      <Button
        size="sm"
        onClick={() => toast.info("Editing is part of the next milestone.")}
      >
        <Pencil /> Update
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toast.success("Link copied")}>
            <Share2 /> Share case
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
