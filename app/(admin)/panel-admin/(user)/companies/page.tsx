import { cookies } from "next/headers";
import Companies from "./page-ui";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return <div className="w-full">{token && <Companies token={token} />}</div>;
}
