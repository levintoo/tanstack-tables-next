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
        <CreateUserForm />
      </div>

      <DataTable
        columns={columns}
        data={result.data}
        pageCount={result.pageCount}
        currentPage={currentPage}
      />
    </div>
  );
}
