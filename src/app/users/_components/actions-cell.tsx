"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteUser } from "../actions";
import { useRouter } from "next/navigation";

interface ActionsCellProps {
  userId: number;
}

export function ActionsCell({ userId }: ActionsCellProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete user");
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
