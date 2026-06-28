"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Surfaces middleware redirects (e.g. ?denied=verification) as a toast.
 * Mounted once on the dashboard overview.
 */
export function DashboardNotices() {
  const params = useSearchParams();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    if (params.get("denied") === "verification") {
      shown.current = true;
      toast.error("Verification required", {
        description:
          "Your practitioner account is pending admin verification before you can file cases.",
      });
    }
  }, [params]);

  return null;
}
