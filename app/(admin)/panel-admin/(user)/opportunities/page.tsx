import { cookies } from "next/headers";
import Opportunities from "./page-ui";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return (
    <div className="w-full">{token && <Opportunities token={token} />}</div>
  );
}
