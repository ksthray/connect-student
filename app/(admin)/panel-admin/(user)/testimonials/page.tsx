import { cookies } from "next/headers";
import Testimonials from "./page-ui";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("connect-student-token")?.value;

  return (
    <div className="w-full">{token && <Testimonials token={token} />}</div>
  );
}
