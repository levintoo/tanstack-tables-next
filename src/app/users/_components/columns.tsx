"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RoleBadge } from "./role-badge";
import { ActionsCell } from "./actions-cell";

export type User = {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => <RoleBadge roleName={row.original.roleName} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell userId={row.original.id} />,
  },
];
