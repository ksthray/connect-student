import { cookies } from "next/headers";
import CandidateRecommendations from "./page-ui";
export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student")?.value;

  return (
    <div className="w-full py-24">
      {/* {token && (
        <Dashboard
        // token={token}
        />
      )} */}
      <CandidateRecommendations
      // token={token}
      />
    </div>
  );
}
