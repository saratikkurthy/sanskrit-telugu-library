import { getRecentReads } from "@/app/actions/library";

export default async function RecentReadsPage() {
  const activity = await getRecentReads();
  return (
    <div>
      <h1>Recently Read</h1>
      <ul>
        {activity.map((item) => (
          <li key={item.file_activity.id}>
            {item.files?.file_name || "Unknown File"}
          </li>
        ))}
      </ul>
    </div>
  );
}