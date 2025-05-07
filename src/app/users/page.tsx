import { CreateUserForm } from "./_components/create-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUsers } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const result = await getUsers(currentPage);

  if ("error" in result) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>

      <DataTable
        columns={columns}
        data={result.data}
        pageCount={result.pageCount}
        currentPage={currentPage}
      />

      <div className="mt-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
