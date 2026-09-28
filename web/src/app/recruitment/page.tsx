import JoinForm from "./JoinForm";
import { getJoinFormConfig } from "@/lib/joinForm";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const config = await getJoinFormConfig();
  return <JoinForm config={config} />;
}
