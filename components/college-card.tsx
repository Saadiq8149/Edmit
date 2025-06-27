import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface CollegeCardProps {
  college: {
    id: string
    name: string
    image: string
    state?: string
  }
}

export default function CollegeCard({ college }: CollegeCardProps) {
  let collegeSlug = college.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")

  return (
    <Link href={`/colleges/${college.id}-${collegeSlug}`} className="w-full">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 duration-300 border-0 shadow-md">
        <div className="aspect-video relative">
          <Image src={college.image || "/placeholder.svg"} alt={college.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h3 className="font-semibold text-lg p-4 text-white">{college.name}</h3>
          </div>
        </div>
      </Card>
    </Link>
  )
}
