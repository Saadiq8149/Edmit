"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Map, MapPin, Globe, X } from "lucide-react"
import StateCard from "@/components/state-card"
import { useDebounce } from "@/hooks/use-debounce"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
            {/* Background Gradient with animated pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10"></div>
            <div className="fixed inset-0 opacity-30 -z-10 bg-grid-pattern"></div>

            <main className="container py-4 md:py-8 px-3 md:px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="banner relative rounded-xl overflow-hidden mb-5 md:mb-8 bg-gradient-to-r from-[#1da1a3] to-[#2e7fe2] shadow-xl"
                >
                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 bg-spotlight opacity-20"></div>

                    <div className="banner-content relative z-10 p-4 md:p-8 lg:p-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-white">NEET MBBS Cutoff Ranks – Statewise List of Government, AIIMS & Private Medical Colleges</h1>
                        <h2 className="text-white/90 mb-2 text-sm md:text-lg">Select a State to View NEET UG MBBS Cutoff Ranks by Category (General, SC, ST, OBC, EWS) and College Type (AIIMS, Government, Private)</h2>

                        <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm h-6 md:h-7">
                                <Globe className="w-3 h-3 mr-1" /> All India Coverage
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm h-6 md:h-7">
                                <MapPin className="w-3 h-3 mr-1" /> {statesData.length} States
                            </Badge>
                        </div>
                    </div>

                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-6 shadow-sm mb-5 md:mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex-1">
                            <label htmlFor="state-search" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Search States</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
                                <Input
                                    id="state-search"
                                    type="search"
                                    placeholder="Search by state name..."
                                    className="pl-9 bg-white/80 h-9 md:h-10 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 text-gray-500 hover:text-gray-700"
                                        onClick={clearSearch}
                                    >
                                        <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="sr-only">Clear search</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 md:mt-4">
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {filteredStates.length} states found
                            {debouncedSearchQuery && (
                                <> matching "{debouncedSearchQuery}"</>
                            )}
                        </p>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-40 md:h-60 bg-white/50 rounded-xl shadow-sm p-4 md:p-8">
                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-3 md:border-4 border-primary/30 border-t-primary animate-spin"></div>
                        <p className="text-muted-foreground mt-3 md:mt-4 text-sm">Loading states...</p>
                    </div>
                ) : filteredStates.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
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
                        className="flex flex-col justify-center items-center h-40 md:h-60 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-8 text-center"
                    >
                        <Map className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4 opacity-50" />
                        <p className="text-base md:text-xl font-medium mb-1 md:mb-2">No states found</p>
                        <p className="text-muted-foreground text-xs md:text-sm mb-3">
                            Try a different search term
                        </p>
                        {searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs md:text-sm h-8 md:h-9"
                                onClick={clearSearch}
                            >
                                Clear search
                            </Button>
                        )}
                    </motion.div>
                )}
            </main>

            {/* Add custom styles for animated elements */}
            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }

        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231da1a3' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .bg-spotlight {
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 25%, transparent 50%);
        }
      `}</style>
        </div>
    )
}
