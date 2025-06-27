import CollegePage from "./college";

function deslugify(slug: string): string {
  return slug.replace("-", " ") // replace hyphens with spaces
    .split("_")             // split on underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
    .join(" ")
    .replace(/^\d+\s?/, ""); // remove leading number and optional space
}

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  var id = deslugify(params.id);
  id = id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `${id}, NEET Cutoff Rank (MBBS) – Opening & Closing Ranks by Category`,
    description: `NEET UG MBBS cutoff for ${id}, with opening & closing ranks across categories (General, SC, ST, OBC, EWS). Plan your medical admission with precise data.`
  }
}

export default function Page() {
  return <CollegePage />
}
