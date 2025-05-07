import { CreateUserForm } from "./_components/create-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUsers } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const result = await getUsers(page, pageSize);

  if ("error" in result) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <CreateUserForm />
      </div>
      <DataTable
        columns={columns}
        data={result.data}
        pageCount={result.pageCount}
        currentPage={page}
        total={result.total}
      />
    </div>
  );
}
