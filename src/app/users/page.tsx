import { db } from "@/database/db";
import { users } from "@/database/schema";
import { CreateUserForm } from "./create-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Users</h1>
      <div className="w-full max-w-4xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
            {allUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CreateUserForm />
      </div>
    </div>
  );
}
