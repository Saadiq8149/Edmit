import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    let routes = ["/", "/colleges", "/contact", "/privacy", "/states", "/terms"]

    try {
        const statesResponse = await fetch(new URL("/api/get_states", process.env.NEXT_PUBLIC_BASE_URL || "https://edmit.in"))
        const statesData = await statesResponse.json()
        const collegesResponse = await fetch(new URL("/api/get_colleges", process.env.NEXT_PUBLIC_BASE_URL || "https://edmit.in"))
        const collegesData = await collegesResponse.json()
        for (const state of statesData.states) {
            const stateSlug = state.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
            routes.push("/states/" + state.id + "-" + stateSlug)
        }
        for (const college of collegesData.colleges) {
            const collegeSlug = college.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")     // trim leading/trailing hyphens
            routes.push("/colleges/" + college.id + "-" + collegeSlug)
        }
    } catch (error) {
        console.error("Error generating sitemap:", error)
    }

    let sitemap = routes.map((route) => {
        return {
            url: `https://edmit.in${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
        }
    })

    return sitemap
}
