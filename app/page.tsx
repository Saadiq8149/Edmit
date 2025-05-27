"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, CheckCircle, Clock, ArrowRight, Star, TrendingUp, Bell } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"

export default function Home() {
  interface State {
    id: string;
    name: string;
    icon: string;
  }

  interface College {
    id: string;
    name: string;
    image: string;
  }

  interface Update {
    id: number;
    date: string;
    title: string;
    description: string;
    badge?: string;
    badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  }

  const updates: Update[] = [
    {
      id: 1,
      date: "May 15, 2025",
      title: "2025 NEET Cutoffs Updated",
      description: "The latest cutoffs for all medical colleges have been added to our database.",
      badge: "New",
      badgeVariant: "default",
    },
    {
      id: 2,
      date: "May 10, 2025",
      title: "JEE Integration Coming Soon",
      description: "We're working on adding JEE rankings and college information to Edmit.",
      badge: "Coming Soon",
      badgeVariant: "outline",
    },
    {
      id: 3,
      date: "May 5, 2025",
      title: "Website Redesign Launched",
      description: "We've completely revamped our website with a fresh new look and improved features.",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const popupInputRef = useRef<HTMLInputElement>(null)
  const [statesData, setStates] = useState<State[]>([])
  const [collegesData, setColleges] = useState<College[]>([])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const statesResponse = await fetch("/api/get_states")
        let data = await statesResponse.json()
        data = data["states"]?.map((state: { id: any, name: any }) => ({
          "id": state.id,
          "name": state.name,
          "icon": "/placeholder.svg?height=24&width=24"
        })) || []
        setStates(data)
      } catch (error) {
        console.error("Error fetching states:", error)
        setStates([])
      }

      try {
        const collegesResponse = await fetch("/api/get_colleges")
        let data = await collegesResponse.json()
        data = data["colleges"]?.map((college: { id: any, name: any }) => ({
          "id": college.id,
          "name": college.name,
          "image": "/placeholder.svg?height=40&width=40"
        })) || []
        setColleges(data)
      } catch (error) {
        console.error("Error fetching colleges:", error)
        setColleges([])
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // Filter results based on search query
  const filteredStates = statesData.filter((state: { name: string }) =>
    state.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  const filteredColleges = collegesData.filter((college: { name: string }) =>
    college.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  const hasResults = filteredStates.length > 0 || filteredColleges.length > 0

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    // Close on escape key
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [])

  // Show results when typing
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [debouncedSearchQuery])

  // Focus the popup search input when the popup opens
  useEffect(() => {
    if (showResults && popupInputRef.current) {
      setTimeout(() => {
        popupInputRef.current?.focus()
      }, 100)
    }
  }, [showResults])

  const clearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
    inputRef.current?.focus()
  }

  const clearPopupSearch = () => {
    setSearchQuery("")
    popupInputRef.current?.focus()
  }

  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [showResults])

  return (
    <main className="flex h-[100dvh] overflow-hidden flex-col relative">
      <meta title="All India NEET Cutoff Ranks (MBBS) – State, Category & College Wise" />
      <meta name="description" content="NEET UG MBBS cutoff ranks across India by state, category (General, SC, ST, OBC, EWS), and college—AIIMS, government, and private. Compare and plan your admission strategy!" />
      {/* Full Page Gradient Background */}
      <div className="fixed inset-0 animated-gradient">
        <div className="absolute inset-0 w-full h-full">
          <div className="animated-circles"></div>
          <div className="animated-glow"></div>
        </div>
      </div>

      {/* Hero Section Content */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-8 md:py-12 lg:py-16 text-white relative z-10 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center px-4 z-10"
        >
          <div className="glow-text-container">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tighter mb-2 shimmer-text">
              NEET MBBS Cutoff Ranks – State, Category & College Wise - AIIMS, Government Colleges and Private Colleges
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="max-w-[750px] text-sm sm:text-base md:text-lg opacity-90"
          >
            Statwise, College wise (AIMS, Government Medical Colleges, and Private Medical Colleges), Category wise (General, SC, ST, OBC, EWS etc) NEET UG MBBS Cutoff Ranks
          </motion.p>
        </motion.div>

        {/* Search Container with Fixed Position Search Results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-2xl px-4 relative z-[60]"
          ref={searchRef}
        >
          <div className="search-container glow-on-hover">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search for colleges, exams, or states..."
              className="w-full h-12 md:h-14 rounded-full pl-10 pr-10 text-gray-800 bg-white/95 backdrop-blur-sm border-0 shadow-custom transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.length > 0) {
                  setShowResults(true)
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-500 hover:text-gray-700"
                onClick={clearSearch}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Portal for Search Results to avoid z-index issues */}
          {showResults && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center" onClick={() => setShowResults(false)}>
              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl mx-4 my-auto max-h-[90dvh]">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg border search-results flex flex-col max-h-[90dvh]"
                >
                  {/* Embedded Search Bar in Popup */}
                  <div className="p-3 border-b sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        ref={popupInputRef}
                        type="search"
                        placeholder="Search for colleges, exams, or states..."
                        className="text-black w-full pl-9 pr-9 border-gray-200 focus:border-primary bg-white/80"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                          onClick={clearPopupSearch}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Clear search</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Results Content */}
                  <div className="p-3 overflow-y-auto" style={{ maxHeight: "calc(70dvh - 115px)" }}>
                    {isLoading ? (
                      <div className="py-8 text-center">
                        <div className="loading-spinner mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Searching for results...</p>
                      </div>
                    ) : hasResults ? (
                      <>
                        {filteredStates.length > 0 && (
                          <div className="mb-4">
                            <h3 className="font-bold text-sm mb-2 text-muted-foreground px-2">States</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2">
                              {filteredStates.map((state) => (
                                <Link
                                  key={state.id}
                                  href={`/states/${state.id}`}
                                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
                                  onClick={() => setShowResults(false)}
                                >
                                  <div className="w-6 h-6 relative flex-shrink-0">
                                    <Image
                                      src={state.icon || "/placeholder.svg"}
                                      alt={state.name}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="text-black text-sm truncate">{state.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {filteredColleges.length > 0 && (
                          <div>
                            <h3 className="font-bold text-sm mb-2 text-muted-foreground px-2">Colleges</h3>
                            <div className="space-y-1 md:space-y-2">
                              {filteredColleges.slice(0, 8).map((college) => (
                                <Link
                                  key={college.id}
                                  href={`/colleges/${college.id}`}
                                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-all"
                                  onClick={() => setShowResults(false)}
                                >
                                  <div className="w-8 h-8 md:w-10 md:h-10 relative flex-shrink-0 rounded-md overflow-hidden">
                                    <Image
                                      src={college.image || "/placeholder.svg"}
                                      alt={college.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-black text-sm line-clamp-2">{college.name}</span>
                                </Link>
                              ))}
                            </div>

                            {filteredColleges.length > 8 && (
                              <div className="mt-2 text-center">
                                <Link
                                  href={`/colleges?search=${encodeURIComponent(searchQuery)}`}
                                  className="text-primary text-sm hover:underline inline-flex items-center gap-1 px-4 py-2 transition-transform hover:translate-x-1"
                                  onClick={() => setShowResults(false)}
                                >
                                  See all {filteredColleges.length} colleges
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No results found, try a different search term.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer with close button */}
                  <div className="p-2 border-t bg-white/80 text-right sticky bottom-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-gray-900"
                      onClick={() => setShowResults(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-2 z-[50]"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm border border-white/30 hover:bg-white/30 transition-colors">
            <CheckCircle className="h-4 w-4" />
            <span>NEET Supported</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm border border-white/30 hover:bg-white/30 transition-colors">
            <Clock className="h-4 w-4" />
            <span>JEE Coming Soon</span>
          </div>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-4 z-[50]"
        >
          <Button asChild size="lg" className="px-8 bg-white text-primary hover:bg-white/90 shadow-glow-blue transition-all hover:scale-105">
            <Link href="/colleges">
              <span className="flex items-center gap-2">
                Explore Colleges
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent px-8 border-white text-white hover:bg-white/20 hover:border-white transition-all hover:scale-105 shadow-glow-white"
          >
            <Link href="/states">Explore States</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  )
}

function StatsCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-4 text-center"
    >
      <div className="mb-4 rounded-full bg-background p-3 shadow-md">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
}
