"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, AlertCircle, MapPin, ArrowLeft, Globe, Building, TrendingUp, School } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDebounce } from "@/hooks/use-debounce"
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface College {
    id: string;
    name: string;
    image: string;
}

interface CutoffRow {
    id: string | number;
    college: string;
    college_id?: string;
    openingRank: number;
    closingRank: number;
    opening_rank?: number;
    closing_rank?: number;
    year?: string;
    category?: string;
    quota?: string;
}

interface StateData {
    name: string;
    colleges: College[];
    cutoffs: CutoffRow[];
}

const defaultYears = ["2024"]
const defaultCategories = ["General", "OBC", "SC", "ST", "EWS"]
const defaultQuotas = ["state_quota", "all_india_quota", "management_quota", "nri_quota"]

export default function StatePage() {
    const [year, setYear] = useState("all")
    const [category, setCategory] = useState("all")
    const [quota, setQuota] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const params = useParams()

    let stateId: string | undefined;

    if (params && typeof params.id === 'string') {
        stateId = params.id.split("-")[0];
    }


    // Filter options
    const [availableYears, setAvailableYears] = useState<string[]>(defaultYears)
    const [availableCategories, setAvailableCategories] = useState<string[]>(defaultCategories)
    const [availableQuotas, setAvailableQuotas] = useState<string[]>(defaultQuotas)

    // State data
    const [stateData, setStateData] = useState<StateData>({
        name: "Loading...",
        colleges: [],
        cutoffs: []
    })

    const resetFilters = () => {
        setYear("all")
        setCategory("all")
        setQuota("all")
    }

    useEffect(() => {
        const fetchStateData = async () => {
            setIsLoading(true)
            setError(null)
            try {

                // Make parallel API calls to get all required data
                const [stateInfoResponse, collegesResponse, cutoffsResponse, categoriesResponse] = await Promise.all([
                    fetch(`/api/get_state_name_by_id/${stateId}`),
                    fetch(`/api/get_colleges_by_state/${stateId}`),
                    fetch(`/api/get_cutoffs_by_state/${stateId}`),
                    fetch(`/api/get_categories_by_state/${stateId}`)
                ])

                // Check if any of the main responses failed
                if (!stateInfoResponse.ok || !collegesResponse.ok) {
                    setError("Failed to load colleges data. Please try again later.")
                    throw new Error("Failed to fetch state data")
                }

                // Parse the responses
                const stateInfo = await stateInfoResponse.json()
                const collegesData = await collegesResponse.json()

                // Parse cutoff data if available
                let cutoffs: CutoffRow[] = []
                if (cutoffsResponse.ok) {
                    const cutoffsData = await cutoffsResponse.json()
                    cutoffs = cutoffsData.cutoffs.map((cutoff: any) => ({
                        id: cutoff.id || `${cutoff.college}-${cutoff.year}-${cutoff.category}-${cutoff.quota}`,
                        college: cutoff.college_name || cutoff.college,
                        college_id: cutoff.college_id,
                        openingRank: cutoff.opening_rank || cutoff.openingRank,
                        closingRank: cutoff.closing_rank || cutoff.closingRank,
                        year: cutoff.year,
                        category: cutoff.category,
                        quota: cutoff.quota
                    }))
                }

                // Format colleges data
                const colleges = collegesData.colleges.map((college: any) => ({
                    id: college.id,
                    name: college.formatted_name || college.name,
                    image: college.image || "/placeholder.svg?height=200&width=300"
                }))

                // Set filter options if available
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json()
                    setAvailableCategories(categoriesData["categories"])
                }

                // Set all the state data
                setStateData({
                    name: stateInfo.state_name,
                    colleges: colleges,
                    cutoffs: cutoffs
                })
            } catch (error) {
                console.error("Error fetching state data:", error)
                setError("Failed to load state data. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchStateData()
    }, [])

    // Filter colleges based on search query
    const filteredColleges = stateData.colleges.filter(college =>
        college.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )

    // Filter cutoffs based on user selection
    const filteredCutoffs = stateData.cutoffs.filter(cutoff => {
        const matchesYear = year === "all" || cutoff.year == year
        const matchesCategory = category === "all" || cutoff.category == category
        const matchesQuota = quota === "all" || cutoff.quota == quota
        return matchesYear && matchesCategory && matchesQuota
    })
    return (
        <div className="relative min-h-screen">
            {/* Background Gradient with animated pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10"></div>
            <div className="fixed inset-0 opacity-30 -z-10 bg-grid-pattern"></div>

            <main className="container py-4 md:py-8 px-3 md:px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 sm:items-center"
                >
                    <Link href="/states" className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium group text-sm md:text-base">
                        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to all states</span>
                    </Link>

                    {/* <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-xs md:text-sm h-7">
              <School className="w-3 h-3 mr-1" /> Medical Colleges
            </Badge>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-xs md:text-sm h-7">
              <Globe className="w-3 h-3 mr-1" /> {filteredColleges.length} Institutions
            </Badge>
          </div> */}
                </motion.div>

                {/* Improved Banner for Mobile */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="banner relative rounded-xl overflow-hidden mb-5 md:mb-8 bg-gradient-to-r from-[#1da1a3] to-[#2e7fe2] shadow-xl"
                >
                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 bg-spotlight opacity-20"></div>

                    <div className="banner-content relative z-10 p-4 md:p-8 lg:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            <div className="max-w-full">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white line-clamp-2 break-words hyphens-auto">
                                    {isLoading ? "Loading..." : `${stateData.name}, NEET MBBS Cutoff Ranks – AIIMS, State Government & Private Medical Colleges, Category-Wise`}
                                </h1>
                                <h2 className="text-white/90 mb-2 md:mb-4 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                                    <span className="line-clamp-2">
                                        Detailed {stateData.name} NEET UG MBBS Cutoff Analysis: Opening & Closing Ranks for AIIMS, Government Medical Colleges & Private Institutions by Category (General, SC, ST, OBC, EWS)
                                    </span>
                                </h2>

                                <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm text-xs md:text-sm h-6 md:h-7">
                                        <Building className="w-3 h-3 mr-1" /> {stateData.colleges.length} Colleges
                                    </Badge>
                                    {/* <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm animate-pulse-slow text-xs md:text-sm h-6 md:h-7">
                    <TrendingUp className="w-3 h-3 mr-1" /> NEET Cutoffs
                  </Badge> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 blur-xl"></div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Alert variant="destructive" className="mb-4 md:mb-6">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="mb-6 md:mb-8 border-0 bg-white/70 backdrop-blur-sm shadow-md overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-[#1da1a3]/90 to-[#2e7fe2]/90 border-b py-3 md:pb-4">
                                <CardTitle className="text-white flex items-center gap-1 md:gap-2 text-base md:text-lg">
                                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                                    <h2>
                                        {`NEET Cutoffs in ${isLoading ? "this state" : stateData.name}`}
                                    </h2>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                                <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-4 md:mb-6">
                                    <div className="w-full md:w-1/3">
                                        <label className="text-xs md:text-sm font-medium mb-1 block">Year</label>
                                        <Select
                                            value={year}
                                            onValueChange={setYear}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="bg-white/80 hover:bg-white transition-colors h-9 md:h-10 text-sm">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Years</SelectItem>
                                                {availableYears.map((y) => (
                                                    <SelectItem key={y} value={y}>
                                                        {y}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="w-full md:w-1/3">
                                        <label className="text-xs md:text-sm font-medium mb-1 block">Category</label>
                                        <Select
                                            value={category}
                                            onValueChange={setCategory}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="bg-white/80 hover:bg-white transition-colors h-9 md:h-10 text-sm">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {availableCategories.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="w-full md:w-1/3">
                                        <label className="text-xs md:text-sm font-medium mb-1 block">Quota</label>
                                        <Select
                                            value={quota}
                                            onValueChange={setQuota}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="bg-white/80 hover:bg-white transition-colors h-9 md:h-10 text-sm">
                                                <SelectValue placeholder="Select quota" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Quotas</SelectItem>
                                                {availableQuotas.map((q) => (
                                                    <SelectItem key={q} value={q}>
                                                        {q === "state_quota" ? "State Quota" :
                                                            q === "management_quota" ? "Management Quota" :
                                                                q === "nri_quota" ? "NRI Quota" :
                                                                    q === "all_india_quota" ? "All India Quota" :
                                                                        q.charAt(0).toUpperCase() + q.slice(1).replace('_', ' ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {(year !== "all" || category !== "all" || quota !== "all") && (
                                    <div className="mb-3 md:mb-4 flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={resetFilters}
                                            className="text-primary hover:text-primary/80 group text-xs md:text-sm py-1 h-auto"
                                        >
                                            <span>Reset filters</span>
                                            <ArrowLeft className="ml-1 h-3 w-3 rotate-[-45deg] group-hover:rotate-0 transition-transform" />
                                        </Button>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="flex flex-col justify-center items-center h-40 md:h-60">
                                        {/* Animated loading spinner */}
                                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-3 md:border-4 border-primary/30 border-t-primary animate-spin"></div>
                                        <p className="text-muted-foreground mt-3 md:mt-4 text-sm">Loading cutoff data...</p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {filteredCutoffs.length > 0 ? (
                                            <motion.div
                                                key="table"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="rounded-lg border bg-white shadow-sm overflow-hidden"
                                            >
                                                <div className="overflow-x-auto">
                                                    <div className="max-h-[350px] md:max-h-[500px] overflow-auto">
                                                        <Table>
                                                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                                                <TableRow>
                                                                    <TableHead className="font-semibold text-xs md:text-sm px-2 md:px-4">College</TableHead>
                                                                    {year === "all" && <TableHead className="font-semibold text-xs md:text-sm px-2 md:px-4">Year</TableHead>}
                                                                    {category === "all" && <TableHead className="font-semibold text-xs md:text-sm px-2 md:px-4">Category</TableHead>}
                                                                    {quota === "all" && <TableHead className="font-semibold text-xs md:text-sm px-2 md:px-4">Quota</TableHead>}
                                                                    <TableHead className="font-semibold text-right text-xs md:text-sm px-2 md:px-4">Opening</TableHead>
                                                                    <TableHead className="font-semibold text-right text-xs md:text-sm px-2 md:px-4">Closing</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {filteredCutoffs.map((row, index) => (
                                                                    <motion.tr
                                                                        key={row.id}
                                                                        className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-muted/10' : ''}`}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.02, duration: 0.3 }}
                                                                    >
                                                                        <TableCell className="font-medium p-2 md:p-4 text-xs md:text-sm">
                                                                            {row.college_id ? (
                                                                                <Link href={`/colleges/${row.college_id}-${row.college.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`} className="hover:text-primary hover:underline">
                                                                                    {row.college}
                                                                                </Link>
                                                                            ) : row.college}
                                                                        </TableCell>
                                                                        {year === "all" && <TableCell className="p-2 md:p-4 text-xs md:text-sm">{row.year}</TableCell>}
                                                                        {category === "all" && <TableCell className="p-2 md:p-4 text-xs md:text-sm">{row.category}</TableCell>}
                                                                        {quota === "all" && <TableCell className="p-2 md:p-4 text-xs md:text-sm">
                                                                            {row.quota === "state_quota" ? "State" :
                                                                                row.quota === "management_quota" ? "Mgmt" :
                                                                                    row.quota === "nri_quota" ? "NRI" :
                                                                                        row.quota === "all_india_quota" ? "All India" :
                                                                                            row.quota}
                                                                        </TableCell>}
                                                                        <TableCell className="tabular-nums text-right font-medium p-2 md:p-4 text-xs md:text-sm">{row.openingRank || row.opening_rank}</TableCell>
                                                                        <TableCell className="tabular-nums text-right font-medium p-2 md:p-4 text-xs md:text-sm">{row.closingRank || row.closing_rank}</TableCell>
                                                                    </motion.tr>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col justify-center items-center h-40 md:h-60 border rounded-lg bg-white/50 backdrop-blur-sm"
                                            >
                                                <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/50 mb-3 md:mb-4" />
                                                <p className="font-medium mb-1 text-sm md:text-base">No matching cutoff data</p>
                                                <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 text-center max-w-md px-2 md:px-4">
                                                    {stateData.cutoffs.length === 0 ? (
                                                        "No cutoff data is available for this state yet"
                                                    ) : (
                                                        "Try changing your filters to see more results"
                                                    )}
                                                </p>
                                                {stateData.cutoffs.length > 0 && (
                                                    <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs h-8">
                                                        Show all cutoffs
                                                    </Button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}

                                {filteredCutoffs.length > 0 && (
                                    <div className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4 text-center">
                                        * Cutoff data shown is for reference only. Please verify from official sources.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-md overflow-hidden lg:sticky lg:top-6">
                            <CardHeader className="bg-gradient-to-r from-[#1da1a3]/90 to-[#2e7fe2]/90 border-b py-3 md:pb-4">
                                <CardTitle className="text-white flex items-center gap-1 md:gap-2 text-base md:text-lg">
                                    <Building className="h-4 w-4 md:h-5 md:w-5" />
                                    <h2>
                                        Colleges in {isLoading ? "this state" : stateData.name}
                                    </h2>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                                <div className="relative mb-4 md:mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search colleges..."
                                        className="pl-9 h-9 md:h-10 bg-white/80 hover:bg-white focus:bg-white transition-colors text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                {isLoading ? (
                                    <div className="flex flex-col justify-center items-center h-40 md:h-60">
                                        {/* Animated loading spinner */}
                                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-3 md:border-4 border-primary/30 border-t-primary animate-spin"></div>
                                        <p className="text-muted-foreground mt-3 md:mt-4 text-sm">Loading colleges...</p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {filteredColleges.length > 0 ? (
                                            <motion.div
                                                key="colleges-list"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-2 md:space-y-3 max-h-[350px] md:max-h-[500px] overflow-auto pr-1"
                                            >
                                                {filteredColleges.map((college, index) => (
                                                    <motion.div
                                                        key={college.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.03, duration: 0.3 }}
                                                    >
                                                        <Link
                                                            href={`/colleges/${college.id}-${college.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`}
                                                            className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-white transition-colors border bg-white/80 shadow-sm group"
                                                        >
                                                            <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={college.image}
                                                                    alt={college.name}
                                                                    fill
                                                                    className="object-cover transition-transform group-hover:scale-105"
                                                                />
                                                            </div>
                                                            <span className="font-medium text-sm md:text-base group-hover:text-primary transition-colors line-clamp-2">{college.name}</span>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty-colleges"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col justify-center items-center h-40 md:h-60 border rounded-lg bg-white/50 backdrop-blur-sm"
                                            >
                                                <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/50 mb-3 md:mb-4" />
                                                <p className="font-medium mb-1 text-sm md:text-base">No colleges found</p>
                                                <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 text-center max-w-md px-2 md:px-4">
                                                    {stateData.colleges.length === 0 ? (
                                                        "No colleges are available for this state yet"
                                                    ) : (
                                                        "No colleges match your search query"
                                                    )}
                                                </p>
                                                {searchQuery && (
                                                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-xs h-8">
                                                        Clear search
                                                    </Button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
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

        .shadow-glow-sm {
          box-shadow: 0 0 10px rgba(29, 161, 163, 0.3);
        }
      `}</style>
        </div>

    )
}
