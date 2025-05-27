"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Map, MapPin, Globe } from "lucide-react"
import StateCard from "@/components/state-card"
import { useDebounce } from "@/hooks/use-debounce"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function StatesPage() {
  interface State {
    id: string;
    name: string;
    image: string;
  }
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [statesData, setStates] = useState<State[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const statesResponse = await fetch("/api/get_states")
        let data = await statesResponse.json()
        data = data["states"].map((state: { id: any, name: any }) => {
          return {
            "id": state.id,
            "name": state.name,
            "image": "/placeholder.svg?height=200&width=300"
          }
        })
        setStates(data)
      } catch (error) {
        console.error("Error fetching states:", error)
        setStates([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredStates = statesData.filter((state) =>
    state.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient - Subtle version of homepage gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10"></div>

      <main className="container py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="banner relative rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-[#1da1a3] to-[#2e7fe2] p-8 shadow-lg"
        >
          <div className="banner-content relative z-10">
            <h1 className="text-4xl font-bold mb-3 text-white">Explore States</h1>
            <p className="text-white/90 text-lg">Find colleges and NEET cutoffs by state</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                <Globe className="w-3 h-3 mr-1" /> All India Coverage
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1" /> {statesData.length} States
              </Badge>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="state-search" className="block text-sm font-medium text-gray-700 mb-1">Search States</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="state-search"
                  type="search"
                  placeholder="Search by state name..."
                  className="pl-9 bg-white/80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                    onClick={clearSearch}
                  >
                    <span className="sr-only">Clear search</span>
                    {/* <X className="h-4 w-4" /> */}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {filteredStates.length} states found
              {debouncedSearchQuery && (
                <> matching "{debouncedSearchQuery}"</>
              )}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-60 bg-white/50 rounded-xl shadow-sm p-8">
            <div className="loading-spinner"></div>
            <p className="text-muted-foreground mt-4">Loading states...</p>
          </div>
        ) : filteredStates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredStates.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + (index % 12) * 0.05,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <StateCard state={state} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col justify-center items-center h-60 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-8 text-center"
          >
            <Map className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-xl font-medium mb-2">No states found</p>
            <p className="text-muted-foreground">
              Try a different search term
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearSearch}
              >
                Clear search
              </Button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
