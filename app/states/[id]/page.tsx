import StatePage from "./state";

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
    title: `${id} NEET Cutoff Ranks (MBBS) – Category & College Wise (AIIMS, Govt & Private)`,
    description: `NEET UG MBBS cutoff ranks in ${id} by category (General, SC, ST, OBC, EWS) and college type (AIIMS, government, private). Plan your medical admission strategy in ${id} with precise data.`
  }
}

export default function Page() {
  return <StatePage />
}
