"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Search, AlertCircle, SlidersHorizontal, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface PredictionResult {
  id: string | number;
  college: string;
  college_id: string;
  image: string;
  chance: "High" | "Medium" | "Low";
  closing_rank?: number;
  opening_rank?: number;
  state?: string;
  city?: string;
}

const categories = ["General", "OBC", "SC", "ST", "EWS"]
const quotas = ["All India Quota", "State Quota"]
const defaultStates = ["Delhi", "Karnataka", "Tamil Nadu", "Maharashtra", "Uttar Pradesh"]

export default function RankPredictorPage() {
  // Form inputs
  const [rank, setRank] = useState("")
  const [category, setCategory] = useState("General")
  const [quota, setQuota] = useState("State Quota")
  const [domicileState, setDomicileState] = useState("none")

  // Filters for results
  const [showFilters, setShowFilters] = useState(false)
  const [stateFilter, setStateFilter] = useState("all")
  const [chanceFilter, setChanceFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // API data
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>(defaultStates)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Fetch states for domicile selection on initial load
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/get_states')
        if (response.ok) {
          const data = await response.json()
          if (data.states && data.states.length > 0) {
            // Handle both string arrays and object arrays
            const stateNames = data.states.map((state: any) =>
              typeof state === 'string' ? state : state.name
            );
            setAvailableStates(stateNames)
          }
        }
      } catch (error) {
        console.error("Error fetching states:", error)
        // Keep using default states if API call fails
      }
    }

    fetchStates()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResults(false)

    if (!rank || parseInt(rank) <= 0) {
      setError("Please enter a valid NEET rank")
      setIsLoading(false)
      return
    }

    try {
      // Call the prediction API
      const response = await fetch('/api/predict_colleges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        // And update the API call in handleSubmit:
        body: JSON.stringify({
          rank: parseInt(rank),
          category,
          quota,
          domicile_state: domicileState === "none" ? undefined : domicileState
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch predictions")
      }

      const data = await response.json()

      // Transform API response to match our interface
      const formattedPredictions: PredictionResult[] = data.predictions.map((pred: any) => ({
        id: pred.id || pred.college_id,
        college: pred.college_name || pred.college,
        college_id: pred.college_id || pred.id,
        image: pred.image || "/placeholder.svg?height=100&width=100",
        chance: pred.chance || "Low",
        closing_rank: pred.closing_rank,
        opening_rank: pred.opening_rank,
        state: pred.state,
        city: pred.city
      }))

      setPredictions(formattedPredictions)
      setShowResults(true)

      // Extract unique states from results for filtering
      const resultStates = [...new Set(formattedPredictions.map(p => p.state).filter(Boolean))]
      if (resultStates.length > 0) {
        setAvailableStates(resultStates as string[])
      }

    } catch (error) {
      console.error("Error fetching predictions:", error)
      setError("Failed to get college predictions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter the prediction results
  const filteredPredictions = predictions.filter((prediction) => {
    const matchesState = stateFilter === "all" || prediction.state === stateFilter
    const matchesChance = chanceFilter === "all" || prediction.chance === chanceFilter
    const matchesSearch =
      prediction.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prediction.state && prediction.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prediction.city && prediction.city.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesState && matchesChance && matchesSearch
  })

  // Reset result filters
  const resetFilters = () => {
    setStateFilter("all")
    setChanceFilter("all")
    setSearchQuery("")
  }

  return (
    <main className="container py-8">
      <div className="banner mb-8">
        <div className="banner-content">
          <h1 className="text-3xl font-bold mb-2 text-white">Rank Predictor</h1>
          <p className="text-white/90">Find colleges where you have a chance to get admission</p>
        </div>
      </div>

      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader className="card-header-gradient">
          <CardTitle>Enter Your Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Step 1: Enter NEET Rank</label>
              <Input
                type="number"
                placeholder="Enter your NEET rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
                className="clean-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Step 2: Select Category</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="clean-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Step 3: Select Quota</label>
              <Select value={quota} onValueChange={setQuota} required>
                <SelectTrigger className="clean-select">
                  <SelectValue placeholder="Select quota" />
                </SelectTrigger>
                <SelectContent>
                  {quotas.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Step 4: Select Domicile State (Optional)</label>
              <Select value={domicileState} onValueChange={setDomicileState}>
                <SelectTrigger className="clean-select">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any State</SelectItem>
                  {availableStates.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full gradient-primary text-white" disabled={isLoading}>
              {isLoading ? "Loading..." : "Predict My Colleges"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold gradient-text">Prediction Results</h2>
              <p className="text-muted-foreground">
                Based on your NEET rank {rank}, {category} category, and {quota}, here are your college predictions:
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-2 md:mt-0 flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4 border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search colleges, states..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-full clean-input"
                    />
                  </div>

                  <div className="w-full md:w-1/3">
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="clean-select">
                        <SelectValue placeholder="Filter by state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {availableStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-1/3">
                    <Select value={chanceFilter} onValueChange={setChanceFilter}>
                      <SelectTrigger className="clean-select">
                        <SelectValue placeholder="Filter by chance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Chances</SelectItem>
                        <SelectItem value="High">High Chance</SelectItem>
                        <SelectItem value="Medium">Medium Chance</SelectItem>
                        <SelectItem value="Low">Low Chance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(searchQuery || stateFilter !== "all" || chanceFilter !== "all") && (
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      className="text-sm text-primary hover:text-primary flex items-center gap-1"
                      onClick={resetFilters}
                    >
                      <X size={14} />
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {filteredPredictions.length > 0 ? (
            <div className="rounded-lg border-0 shadow-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <TableRow>
                    <TableHead>College</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Opening Rank</TableHead>
                    <TableHead>Closing Rank</TableHead>
                    <TableHead>Chance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPredictions.map((prediction) => (
                    <TableRow key={prediction.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/colleges/${prediction.college_id}`} className="hover:text-primary">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 relative rounded-md overflow-hidden">
                              <Image
                                src={prediction.image || "/placeholder.svg"}
                                alt={prediction.college}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium hover:underline">{prediction.college}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {prediction.city && prediction.state
                          ? `${prediction.city}, ${prediction.state}`
                          : prediction.state || prediction.city || "N/A"}
                      </TableCell>
                      <TableCell className="tabular-nums">{prediction.opening_rank || "N/A"}</TableCell>
                      <TableCell className="tabular-nums">{prediction.closing_rank || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            prediction.chance === "High"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              : prediction.chance === "Medium"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                          }
                        >
                          {prediction.chance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              {predictions.length === 0
                ? "No prediction results available"
                : "No colleges match your filters"}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
