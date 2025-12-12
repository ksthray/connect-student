import { cookies } from "next/headers";
import Analytics from "./page-ui";

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
      <Analytics
      // token={token}
      />
    </div>
  );
}
