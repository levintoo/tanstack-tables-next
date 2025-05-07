import { db } from "@/database/db";
import { users } from "@/database/schema";
import { CreateUserForm } from "./create-form";

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Users</h1>
      <div className="w-full max-w-4xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Id
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
              </tr>
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <CreateUserForm />
      </div>
    </div>
  );
}
