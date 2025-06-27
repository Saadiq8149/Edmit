import CollegesPage from "./colleges";

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  return {
    title: `NEET MBBS Colleges Cutoffs in India – A to Z List  with Cutoff Ranks`,
    description: `NEET UG MBBS colleges in India - All medical colleges including AIIMS, government, and private colleges. View NEET UG  cutoff ranks by college and category to make informed admission choices.`
  }
}

export default function Page() {
  return <CollegesPage />
}
