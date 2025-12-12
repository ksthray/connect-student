import { cookies } from "next/headers";
import CandidateDashboard from "./page-ui";
export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student")?.value;

  return (
    <div className="w-full">
      {/* {token && (
        <Dashboard
        // token={token}
        />
      )} */}
      <CandidateDashboard
      // token={token}
      />
    </div>
  );
}
