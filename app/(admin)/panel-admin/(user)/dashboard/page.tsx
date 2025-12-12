import Dashboard from "./page-ui";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return <div className="w-full">{token && <Dashboard token={token} />}</div>;
}
