"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    MapPin, Mail, AlertCircle, ArrowLeft, Calendar, Users, Tag, GraduationCap, Building,
    Globe, TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

// Default selectable values
const years = ["2024"]
const quotas = ["state_quota", "all_india_quota", "management_quota", "nri_quota"]

interface CutoffData {
    year: string;
    category: string;
    quota: string;
    opening_rank?: number;
    closing_rank?: number;
    openingRank?: number;
    closingRank?: number;
    id?: string | number;
    summary?: string;
    location?: string;
    website?: string;
}

export default function CollegePage() {
    const [year, setYear] = useState("all")
    const [category, setCategory] = useState("all")
    const [quota, setQuota] = useState("all")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<string[]>([])
    const [stateName, setStateName] = useState<string>("")
    const [stateColleges, setStateColleges] = useState<any>([])

    // College data state
    const [collegeData, setCollegeData] = useState<{
        cutoffs: CutoffData[];
        name: string;
        location?: string;
        email?: string;
        state?: string;
        established?: string;
        type?: string;
        summary?: string;
        website?: string;
    }>({
        cutoffs: [],
        name: ""
    })

    const params = useParams()
    let collegeId: string | undefined;

    if (params && typeof params.id === 'string') {
        collegeId = params.id.split("-")[0];
    }

    useEffect(() => {
        const fetchCollegeData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const [cutoffResponse, nameResponse] = await Promise.all([
                    fetch(`/api/get_cutoffs_by_college/${collegeId}`),
                    fetch(`/api/get_college_name_by_id/${collegeId}`),
                ]);

                if (!cutoffResponse.ok || !nameResponse.ok) {
                    throw new Error("Failed to fetch college data");
                }

                const cutoffData = await cutoffResponse.json();
                const nameData = await nameResponse.json();

                // Normalize the cutoff data to ensure consistent property names
                const normalizedCutoffs = cutoffData["cutoffs"].map((cutoff: any) => ({
                    id: cutoff.id || `${cutoff.year}-${cutoff.category}-${cutoff.quota}`,
                    year: cutoff.year || "2024",
                    category: cutoff.category || "General",
                    quota: cutoff.quota || "All India Quota",
                    openingRank: cutoff.opening_rank || cutoff.openingRank,
                    closingRank: cutoff.closing_rank || cutoff.closingRank
                }));

                // Only fetch categories if there are cutoffs
                if (cutoffData["cutoffs"].length > 0) {
                    const categoriesByState = await fetch(`/api/get_categories_by_state/${cutoffData["cutoffs"][0]["state_id"]}`);
                    const categoriesData = await categoriesByState.json();
                    setCategories(categoriesData["categories"]);
                }
                var stateNameResponse = fetch("/api/get_state_name_by_id/" + nameData.state_id);
                stateNameResponse.then(response => response.json()).then(data => {
                    console.log(data)
                    setStateName(data.state_name || "State unavailable");
                });
                var stateCollegesResponse = fetch(`/api/get_colleges_by_state/${nameData.state_id}`);
                stateCollegesResponse.then(response => response.json()).then(data => {
                    setStateColleges(data.colleges || []);
                });
                setCollegeData({
                    cutoffs: normalizedCutoffs,
                    name: nameData.formatted_name || nameData.name,
                    location: nameData.location,
                    summary: nameData.summary,
                    website: nameData.website, // Placeholder data
                    state: nameData.state_name || "State unavailable",
                    established: "2000", // Placeholder data
                    type: "Medical College" // Placeholder data
                });
            } catch (error) {
                console.error("Error fetching college data:", error);
                setError("Failed to load college data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollegeData();
    }, []);

    // Reset filters function
    const resetFilters = () => {
        setYear("all");
        setCategory("all");
        setQuota("all");
    };

    // Filtered cutoffs based on user selection
    const filteredCutoffs = collegeData.cutoffs.filter(cutoff => {
        const matchesYear = year === "all" || cutoff.year == year;
        const matchesCategory = category === "all" || cutoff.category == category;
        const matchesQuota = quota === "all" || cutoff.quota == quota;
        return matchesYear && matchesCategory && matchesQuota;
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Function to scroll the carousel
    const scrollCarousel = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const scrollAmount = container.clientWidth * 0.75

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

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
                    className="mb-4 md:mb-6 flex justify-between items-center"
                >
                    <Link href="/colleges" className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium group text-sm md:text-base">
                        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to colleges</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="banner relative rounded-xl overflow-hidden mb-6 md:mb-8 bg-gradient-to-r from-[#1da1a3] to-[#2e7fe2] p-4 md:p-8 lg:p-10 shadow-xl"
                >
                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 bg-spotlight opacity-20"></div>
                    <div className="banner-content relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/20 mr-2">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {stateName || "State unavailable"}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-white flex items-center">
                                    {isLoading ? "Loading..." : `${collegeData.name}– NEET MBBS Cutoff Ranks: Category-Wise Opening & Closing Ranks` || "College Details"}
                                </h1>
                                <h2 className="text-white/90 mb-2 md:mb-4 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                                    <span className="line-clamp-2">
                                        NEET UG MBBS Cutoff at {collegeData.name}: Opening & Closing Ranks by Category (General, SC, ST, OBC, EWS)
                                    </span>
                                </h2>
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
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
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
                                        {`NEET Cutoffs for ${isLoading ? "this college" : collegeData.name}`}
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
                                                {years.map((y) => (
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
                                                {categories.map((c) => (
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
                                                {quotas.map((q) => (
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
                                                                    <TableHead className="font-semibold text-center text-xs md:text-sm px-2 md:px-4">Year</TableHead>
                                                                    <TableHead className="font-semibold text-center text-xs md:text-sm px-2 md:px-4">Quota</TableHead>
                                                                    <TableHead className="font-semibold text-center text-xs md:text-sm px-2 md:px-4">Category</TableHead>
                                                                    <TableHead className="font-semibold text-center text-xs md:text-sm px-2 md:px-4">Opening</TableHead>
                                                                    <TableHead className="font-semibold text-center text-xs md:text-sm px-2 md:px-4">Closing</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {filteredCutoffs.map((row, index) => (
                                                                    <motion.tr
                                                                        key={row.id || index}
                                                                        className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-muted/10' : ''}`}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.03, duration: 0.2 }}
                                                                    >
                                                                        <TableCell className="font-medium text-center p-2 md:p-4 text-xs md:text-sm">{row.year}</TableCell>
                                                                        <TableCell className="text-center p-2 md:p-4 text-xs md:text-sm">
                                                                            {row.quota === "state_quota" ? "State" :
                                                                                row.quota === "all_india_quota" ? "All India" :
                                                                                    row.quota === "management_quota" ? "Management" :
                                                                                        row.quota === "nri_quota" ? "NRI" :
                                                                                            row.quota}
                                                                        </TableCell>
                                                                        <TableCell className="text-center p-2 md:p-4 text-xs md:text-sm">{row.category}</TableCell>
                                                                        <TableCell className="tabular-nums text-center font-medium p-2 md:p-4 text-xs md:text-sm">
                                                                            {row.openingRank || row.opening_rank || "N/A"}
                                                                        </TableCell>
                                                                        <TableCell className="tabular-nums text-center font-medium p-2 md:p-4 text-xs md:text-sm">
                                                                            {row.closingRank || row.closing_rank || "N/A"}
                                                                        </TableCell>
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
                                                    {collegeData.cutoffs.length === 0 ? (
                                                        "No cutoff data is available for this college yet"
                                                    ) : (
                                                        "Try changing your filters to see more results"
                                                    )}
                                                </p>
                                                {collegeData.cutoffs.length > 0 && (
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
                        className="mb-4"
                    >
                        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-md overflow-hidden lg:sticky lg:top-6">
                            <CardHeader className="bg-gradient-to-r from-[#1da1a3]/90 to-[#2e7fe2]/90 border-b py-3 md:pb-4">
                                <CardTitle className="text-white flex items-center gap-1 md:gap-2 text-base md:text-lg">
                                    <Building className="h-4 w-4 md:h-5 md:w-5" />
                                    <h2>College Details</h2>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                                <div className="mb-4 md:mb-6 rounded-lg overflow-hidden shadow-md relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 group-hover:from-black/70 transition-colors flex items-end">
                                        <div className="p-2 md:p-3 text-white">
                                            <div className="font-medium text-sm md:text-base">{collegeData.name}</div>
                                            <div className="text-xs md:text-sm text-white/80">{collegeData.location}</div>
                                        </div>
                                    </div>
                                    <Image
                                        src="/placeholder.svg?height=200&width=400"
                                        alt={collegeData.name}
                                        width={400}
                                        height={200}
                                        className="w-full h-32 md:h-48 object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                <div className="space-y-2 md:space-y-4">
                                    <div className="flex items-start gap-2 md:gap-3 group hover:bg-white/40 p-2 rounded-md transition-colors">
                                        <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-primary/80" />
                                        <div>
                                            <h3 className="font-medium text-sm md:text-base">Location</h3>
                                            <p className="text-muted-foreground text-xs md:text-sm">{collegeData.location || "Location details unavailable"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3 group hover:bg-white/40 p-2 rounded-md transition-colors">
                                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-primary/80" />
                                        <div>
                                            <h3 className="font-medium text-sm md:text-base">Website</h3>
                                            <a className="text-muted-foreground text-xs md:text-sm" href={collegeData.website} target="_blank">{collegeData.website || "No Website available"}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3 group hover:bg-white/40 p-2 rounded-md transition-colors">
                                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-primary/80" />
                                        <div>
                                            <h3 className="font-medium text-sm md:text-base">Information</h3>
                                            <p className="text-muted-foreground text-xs md:text-sm">{collegeData.summary || "No information available"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-6 pt-3 md:pt-6 border-t space-y-2 md:space-y-3">
                                    <Button className="w-full bg-primary hover:bg-primary/90 shadow-glow-sm h-9 md:h-10 text-xs md:text-sm" asChild>
                                        <Link href={`https://google.com/search?q=${encodeURIComponent(collegeData.name)}`} target="_blank">
                                            <Globe className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Visit College Website
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                {stateColleges && stateColleges.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 md:mt-16"
                    >
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">
                                More Medical Colleges in {stateName}
                            </h2>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 md:h-9 md:w-9 rounded-full border"
                                    onClick={() => scrollCarousel('left')}
                                >
                                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                    <span className="sr-only">Scroll left</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 md:h-9 md:w-9 rounded-full border"
                                    onClick={() => scrollCarousel('right')}
                                >
                                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                    <span className="sr-only">Scroll right</span>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-3 md:gap-4 pb-4 pt-1 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {stateColleges
                                    .filter((college: any) => college.id !== collegeId)
                                    .map((college: any) => (
                                        <Link
                                            href={`/colleges/${college.id}-${college.formatted_name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || college.name?.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`}
                                            key={college.id}
                                            className="w-[180px] md:w-[220px] bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow rounded-lg overflow-hidden border transition-all duration-200 flex-shrink-0 snap-start"
                                        >
                                            <div className="h-16 md:h-20 relative overflow-hidden bg-muted">
                                                <Image
                                                    src="/placeholder.svg?height=80&width=220"
                                                    alt={college.formatted_name || college.name}
                                                    width={220}
                                                    height={80}
                                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            </div>
                                            <div className="p-2 md:p-3">
                                                <h3 className="font-medium text-xs md:text-sm line-clamp-2">
                                                    {college.formatted_name || college.name}
                                                </h3>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
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

        .shadow-glow-sm {
          box-shadow: 0 0 10px rgba(29, 161, 163, 0.3);
        }
      `}</style>
        </div>
    )
}
