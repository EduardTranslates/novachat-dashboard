import rawData from "@/data/novachat_data.json";
import { DashboardClient } from "@/components/DashboardClient";
import type { NovaChatData } from "@/types/novachat";

export default function HomePage() {
  const data = rawData as unknown as NovaChatData;
  return <DashboardClient data={data} />;
}
