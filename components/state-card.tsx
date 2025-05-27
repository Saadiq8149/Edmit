import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface StateCardProps {
  state: {
    id: string
    name: string
    image: string
  }
}

export default function StateCard({ state }: StateCardProps) {
  return (
    <Link href={`/states/${state.id}-${state.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`} className="w-full">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 duration-300 border-0 shadow-md">
        <div className="aspect-video relative">
          <Image src={state.image || "/placeholder.svg"} alt={state.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h3 className="font-semibold text-lg p-4 text-white">{state.name}</h3>
          </div>
        </div>
      </Card>
    </Link>
  )
}
