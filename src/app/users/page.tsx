import { CreateUserForm } from "./_components/create-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUsers } from "./actions";

const MAX_PAGE_SIZE = 50;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const requestedPageSize = Number(params.pageSize) || 10;
  const pageSize = Math.min(Math.max(1, requestedPageSize), MAX_PAGE_SIZE);
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
        pageSize={pageSize}
      />
    </div>
  );
}
