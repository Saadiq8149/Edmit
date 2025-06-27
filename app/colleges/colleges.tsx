"use client"

import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, Filter, Sparkles, SortAsc, SortDesc } from "lucide-react"
import CollegeCard from "@/components/college-card"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function CollegesPage() {
    interface State {
        id: string;
        name: string;
        icon: string;
    }

    interface College {
        id: string;
        name: string;
        image: string;
        state: string;
    }

    const [statesData, setStates] = useState<State[]>([])
    const [collegesData, setColleges] = useState<College[]>([])
    const [selectedState, setSelectedState] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const collegesPerPage = 12

    // New sorting state
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                // Fetch states data
                const statesResponse = await fetch("/api/get_states")
                const statesJson = await statesResponse.json()

                // Add "All States" option
                const allStatesOption = {
                    "id": "all",
                    "name": "All States",
                    "icon": "/placeholder.svg?height=24&width=24"
                }

                const formattedStates = statesJson.states.map((state: { id: string, name: string }) => ({
                    "id": state.id,
                    "name": state.name,
                    "icon": "/placeholder.svg?height=24&width=24"
                }))

                setStates([allStatesOption, ...formattedStates])
            } catch (error) {
                console.error("Error fetching states:", error)
                setStates([{ id: "all", name: "All States", icon: "/placeholder.svg?height=24&width=24" }])
            }

            try {
                // Fetch colleges data
                const collegesResponse = await fetch("/api/get_colleges")
                const collegesJson = await collegesResponse.json()

                const formattedColleges = collegesJson.colleges.map((college: {
                    id: string,
                    state_id: string, name: string,
                    formatted_name: string
                }) => ({
                    "id": college.id,
                    "name": college.formatted_name || college.name,
                    "image": "/placeholder.svg?height=200&width=300",
                    "state": college.state_id
                }))

                setColleges(formattedColleges)
            } catch (error) {
                console.error("Error fetching colleges:", error)
                setColleges([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedState, debouncedSearchQuery])

    // Filter and sort colleges based on search query, selected state, and sorting order
    const filteredColleges = useMemo(() => {
        const filtered = collegesData.filter((college) => {
            const matchesState = selectedState === "all" || college.state === selectedState
            const matchesSearch = college.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            return matchesState && matchesSearch
        })

        // Sort by name
        return [...filtered].sort((a, b) => {
            const compareResult = a.name.localeCompare(b.name)
            return sortOrder === "asc" ? compareResult : -compareResult
        })
    }, [collegesData, selectedState, debouncedSearchQuery, sortOrder])

    // Get current colleges for pagination
    const currentColleges = useMemo(() => {
        const indexOfLastCollege = currentPage * collegesPerPage
        const indexOfFirstCollege = indexOfLastCollege - collegesPerPage
        return filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege)
    }, [filteredColleges, currentPage, collegesPerPage])

    // Calculate page numbers
    const totalPages = Math.ceil(filteredColleges.length / collegesPerPage)

    // Navigate between pages
    const goToPage = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always include first page
            pageNumbers.push(1)

            // Calculate start and end of page range
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)

            // Adjust range if at edges
            if (currentPage <= 2) {
                endPage = 3
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2
            }

            // Add ellipsis if needed before middle pages
            if (startPage > 2) {
                pageNumbers.push('...')
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }

            // Add ellipsis if needed after middle pages
            if (endPage < totalPages - 1) {
                pageNumbers.push('...')
            }

            // Always include last page
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
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
                    className="banner relative rounded-xl overflow-hidden mb-5 md:mb-8 bg-gradient-to-r from-[#1da1a3] to-[#2e7fe2] p-4 md:p-8 lg:p-10 shadow-xl"
                >
                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 bg-spotlight opacity-20"></div>

                    <div className="banner-content relative z-10">
                        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-white">NEET MBBS Cutoff Ranks by College - Complete A–Z List of Medical Colleges in India</h1>
                        <h2 className="text-white/90 mb-2 md:mb-3 text-sm md:text-lg">All Medical Colleges in India and NEET Cutoff Ranks for each College by Category (AIIMS, Government & Private)</h2>

                        <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm h-6 md:h-7">
                                {filteredColleges.length} Colleges
                            </Badge>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 blur-xl"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-6 shadow-sm mb-5 md:mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="w-full md:w-64">
                            <label htmlFor="state-select" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Filter by State</label>
                            <Select
                                value={selectedState}
                                onValueChange={(value) => {
                                    setSelectedState(value);
                                }}
                            >
                                <SelectTrigger id="state-select" className="bg-white/80 h-9 md:h-10 text-sm">
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statesData.map((state) => (
                                        <SelectItem key={state.id} value={state.id}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="college-search" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Search Colleges</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
                                <Input
                                    id="college-search"
                                    type="search"
                                    placeholder="Search by college name..."
                                    className="pl-9 bg-white/80 h-9 md:h-10 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="bg-white/80 h-9 md:h-10"
                                size="icon"
                                onClick={toggleSortOrder}
                                title={sortOrder === "asc" ? "Sort Z to A" : "Sort A to Z"}
                            >
                                {sortOrder === "asc" ? (
                                    <SortAsc className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                ) : (
                                    <SortDesc className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-3 md:mt-4 flex justify-between items-center">
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {filteredColleges.length} colleges found
                            {selectedState !== "all" && (
                                <> in {statesData.find(state => state.id === selectedState)?.name || ''}</>
                            )}
                            {debouncedSearchQuery && (
                                <> matching "{debouncedSearchQuery}"</>
                            )}
                        </p>

                        {(selectedState !== "all" || debouncedSearchQuery) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedState("all")
                                    setSearchQuery("")
                                }}
                                className="text-primary hover:text-primary/80 text-xs md:text-sm h-8"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-40 md:h-60 bg-white/50 rounded-xl shadow-sm p-4 md:p-8">
                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-3 md:border-4 border-primary/30 border-t-primary animate-spin"></div>
                        <p className="text-muted-foreground mt-3 md:mt-4 text-sm">Discovering colleges for you...</p>
                    </div>
                ) : filteredColleges.length > 0 ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
                        >
                            {currentColleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4 + (index % collegesPerPage) * 0.05,
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="college-card-container"
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <CollegeCard college={college} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="flex justify-center items-center gap-1 md:gap-2 mt-6 md:mt-10 mb-2"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                    className="bg-white/80 h-7 md:h-8 w-7 md:w-8 p-0"
                                >
                                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>

                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <Button
                                            key={index}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => goToPage(page)}
                                            aria-label={`Page ${page}`}
                                            aria-current={currentPage === page ? "page" : undefined}
                                            className={`${currentPage === page ? "" : "bg-white/80"} text-xs h-7 md:h-8 w-7 md:w-8 p-0`}
                                        >
                                            {page}
                                        </Button>
                                    ) : (
                                        <span key={index} className="px-1 md:px-2 text-xs md:text-sm">...</span>
                                    )
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                    className="bg-white/80 h-7 md:h-8 w-7 md:w-8 p-0"
                                >
                                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="text-center text-xs md:text-sm text-muted-foreground mt-3 md:mt-4"
                        >
                            Showing {Math.min((currentPage - 1) * collegesPerPage + 1, filteredColleges.length)} to {Math.min(currentPage * collegesPerPage, filteredColleges.length)} of {filteredColleges.length} colleges
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col justify-center items-center h-40 md:h-60 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-8 text-center"
                    >
                        <Search className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4 opacity-50" />
                        <p className="text-base md:text-xl font-medium mb-1 md:mb-2">No colleges found</p>
                        <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 max-w-md px-2">
                            {selectedState !== "all" && searchQuery
                                ? "Try changing your state filter or search query."
                                : selectedState !== "all"
                                    ? "Try selecting a different state."
                                    : "Try a different search term."}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs md:text-sm h-8 md:h-9"
                            onClick={() => {
                                setSelectedState("all")
                                setSearchQuery("")
                            }}
                        >
                            Reset filters
                        </Button>
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
