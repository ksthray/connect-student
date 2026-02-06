import { cookies } from "next/headers";
import CandidateDashboard from "./page-ui";
export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return (
    <div className="w-full py-24">
      {token && <CandidateDashboard token={token} />}
    </div>
  );
}

// contact@airtel.com contact@kadea.com contact@orange-corners.com
// contact@rawbank.coom contact@silikinvillage.com contact@vodacom.com
