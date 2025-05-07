"use client";

import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  roleName: string;
}

export function RoleBadge({ roleName }: RoleBadgeProps) {
  const variant =
    roleName.toLowerCase() === "admin"
      ? "destructive"
      : roleName.toLowerCase() === "moderator"
        ? "secondary"
        : "default";

  return <Badge variant={variant}>{roleName}</Badge>;
}
