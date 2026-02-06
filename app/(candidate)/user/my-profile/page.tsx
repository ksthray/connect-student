import { cookies } from "next/headers";
import CandidateProfile from "./page-ui";
export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return (
    <div className="w-full  py-24">
      {token && <CandidateProfile token={token} />}
    </div>
  );
}
