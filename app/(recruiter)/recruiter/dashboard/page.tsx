import { cookies } from "next/headers";
import RecruiterDashboard from "./page-ui";
export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return (
    <div className="w-full  py-24">
      {token && <RecruiterDashboard token={token} />}
    </div>
  );
}
