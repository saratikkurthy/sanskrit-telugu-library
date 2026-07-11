import { getMostVisited } from "@/app/actions/library";

export default async function MostVisitedPage() {
  const docs = await getMostVisited();
  return (
    <div>
      <h1>Most Visited</h1>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id}>
            {doc.file_name} ({doc.view_count} views)
          </li>
        ))}
      </ul>
    </div>
  );
}