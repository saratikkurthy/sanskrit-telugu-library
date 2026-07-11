import { getRecentlyAdded } from "@/app/actions/library";

export default async function RecentlyAddedPage() {
  const docs = await getRecentlyAdded();
  return (
    <div>
      <h1>Recently Added</h1>
      <ul>
        {docs.map(d => <li key={d.id}>{d.file_name}</li>)}
      </ul>
    </div>
  );
}