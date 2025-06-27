"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useDebounce } from "@/hooks/use-debounce"
import { usePathname } from "next/navigation"

// Move interfaces outside the component
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

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Declare ALL hooks before any conditional returns
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [statesData, setStates] = useState<State[]>([])
  const [collegesData, setColleges] = useState<College[]>([])
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // Move ALL useEffect hooks here, before any conditionals
  useEffect(() => {
    // Don't fetch data if we're on the homepage
    // if (isHomePage) return;

    async function fetchData() {
      setIsLoading(true)
      try {
        const statesResponse = await fetch("/api/get_states")
        let data = await statesResponse.json()
        data = data["states"]?.map((state: { id: any, name: any }) => {
          return {
            "id": state.id,
            "name": state.name,
            "icon": "/placeholder.svg?height=24&width=24"
          }
        }) || []
        setStates(data)
      } catch (error) {
        console.error("Error fetching states:", error)
        setStates([])
      }
      try {
        const collegesResponse = await fetch("/api/get_colleges")
        let data = await collegesResponse.json()
        data = data["colleges"]?.map((college: { id: any, name: any, formatted_name: any }) => {
          return {
            "id": college.id,
            "name": college.formatted_name || college.name,
            "image": "/placeholder.svg?height=40&width=40"
          }
        }) || []
        setColleges(data)
      } catch (error) {
        console.error("Error fetching colleges:", error)
        setColleges([])
      }
      setIsLoading(false)
    }
    fetchData()
  }, [isHomePage])

  // Close search results when clicking outside
  useEffect(() => {
    // if (isHomePage) return;

    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    // Close on escape key
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowResults(false);
        setShowMobileSearch(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isHomePage])

  // Show results when typing
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [debouncedSearchQuery])

  // If this is the homepage, don't render the navbar
  // if (isHomePage) return null;

  // Filter results based on search query - these aren't hooks so they can be after the conditional return
  const filteredStates = statesData.filter((state) =>
    state.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  const filteredColleges = collegesData.filter((college) =>
    college.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  const hasResults = filteredStates.length > 0 || filteredColleges.length > 0

  const clearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
    inputRef.current?.focus()
  }

  // Handle navigation link click to close sheet
  const handleNavLinkClick = () => {
    setIsSheetOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/colleges"
                  className="text-lg font-medium hover:text-primary"
                  onClick={handleNavLinkClick}
                >
                  Colleges
                </Link>
                <Link
                  href="/states"
                  className="text-lg font-medium hover:text-primary"
                  onClick={handleNavLinkClick}
                >
                  States
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">Edmit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/colleges" className="font-medium transition-colors hover:text-primary">
              Colleges
            </Link>
            <Link href="/states" className="font-medium transition-colors hover:text-primary">
              States
            </Link>
          </nav>
        </div>

        {/* Desktop Search Bar */}
        <div className={`relative ${showMobileSearch ? 'w-full' : 'hidden md:block'} max-w-sm`} ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search for colleges or states..."
              className="w-full rounded-full pl-9 pr-10 clean-input"
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
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 md:p-3 bg-white rounded-lg shadow-lg border search-results max-h-[65vh] md:max-h-[400px] overflow-y-auto z-50">
              {isLoading ? (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">Loading results...</p>
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
                            href={`/states/${state.id}-${state.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                            onClick={() => {
                              setShowResults(false)
                              setShowMobileSearch(false)
                            }}
                          >
                            <div className="w-6 h-6 relative flex-shrink-0">
                              <Image
                                src={state.icon || "/placeholder.svg"}
                                alt={String(state.name)}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm truncate">{state.name}</span>
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
                            href={`/colleges/${college.id}-${college.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                            onClick={() => {
                              setShowResults(false)
                              setShowMobileSearch(false)
                            }}
                          >
                            <div className="w-8 h-8 md:w-10 md:h-10 relative flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={college.image || "/placeholder.svg"}
                                alt={String(college.name)}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm line-clamp-2">{college.name}</span>
                          </Link>
                        ))}

                        {filteredColleges.length > 8 && (
                          <div className="mt-2 text-center">
                            <Link
                              href={`/colleges?search=${encodeURIComponent(searchQuery)}`}
                              className="text-primary text-sm hover:underline inline-block px-4 py-2"
                              onClick={() => {
                                setShowResults(false)
                                setShowMobileSearch(false)
                              }}
                            >
                              See all {filteredColleges.length} colleges
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No results found, try a different search term.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        {!showMobileSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        {/* Mobile search back button */}
        {showMobileSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setShowMobileSearch(false)
              setShowResults(false)
              setSearchQuery("")
            }}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close search</span>
          </Button>
        )}
      </div>
    </header>
  )
}
