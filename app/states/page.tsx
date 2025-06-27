import StatesPage from "./states";

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  return {
    title: `NEET Cutoff Ranks (MBBS) – Statewise List of Medical Colleges and Cutoff Ranks`,
    description: `NEET UG MBBS cutoff ranks by state for AIIMS, government, and private medical colleges. Explore category-wise opening and closing ranks for each state and plan your admission effectively.`
  }
}

export default function Page() {
  return <StatesPage />
}
