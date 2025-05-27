"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Star, Clock } from "lucide-react"

export default function UpdatesPage() {
    const [selectedType, setSelectedType] = useState<string>("all")

    interface Update {
        id: number;
        date: string;
        title: string;
        description: string;
        type: "feature" | "data" | "news";
        badge?: string;
        badgeVariant?: "default" | "outline" | "secondary" | "destructive";
    }

    const updates: Update[] = [
        {
            id: 1,
            date: "May 15, 2025",
            title: "2025 NEET Cutoffs Updated",
            description: "The latest cutoffs for all medical colleges have been added to our database. These include round-wise data for all categories and quotas, ensuring you have the most accurate information for your college selection process.",
            type: "data",
            badge: "New Data",
            badgeVariant: "default",
        },
        {
            id: 2,
            date: "May 10, 2025",
            title: "JEE Integration Coming Soon",
            description: "We're working on adding JEE rankings and college information to Edmit. This will include complete data for NITs, IITs, and other engineering colleges across India.",
            type: "news",
            badge: "Coming Soon",
            badgeVariant: "outline",
        },
        {
            id: 3,
            date: "May 5, 2025",
            title: "Website Redesign Launched",
            description: "We've completely revamped our website with a fresh new look and improved features. The new design offers better mobile responsiveness, faster loading times, and a more intuitive interface.",
            type: "feature",
        },
        {
            id: 4,
            date: "April 28, 2025",
            title: "Added College Comparison Tool",
            description: "Now you can compare multiple colleges side-by-side with our new comparison tool. Compare cutoffs, facilities, rankings, and more to make an informed decision.",
            type: "feature",
            badge: "New Feature",
            badgeVariant: "secondary",
        },
        {
            id: 5,
            date: "April 20, 2025",
            title: "Updated College Rankings",
            description: "We've updated our database with the latest NIRF rankings for medical and dental colleges across India.",
            type: "data",
        },
        {
            id: 6,
            date: "April 15, 2025",
            title: "NEET Exam Date Announced",
            description: "The National Testing Agency (NTA) has announced that NEET 2026 will be held on May 3, 2026. Stay tuned for more updates on the application process.",
            type: "news",
            badge: "Important",
            badgeVariant: "destructive",
        },
    ];

    const filteredUpdates = selectedType === "all"
        ? updates
        : updates.filter(update => update.type === selectedType);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "feature": return <Star className="h-4 w-4" />;
            case "data": return <ArrowRight className="h-4 w-4" />;
            case "news": return <Clock className="h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <div className="container py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center mb-12"
            >
                <Badge className="mb-4" variant="outline">Announcements</Badge>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Latest Updates</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Stay informed with the latest features, data updates, and news from Edmit.
                </p>
            </motion.div>

            <Tabs defaultValue="all" className="max-w-4xl mx-auto mb-12">
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="all" onClick={() => setSelectedType("all")}>All Updates</TabsTrigger>
                    <TabsTrigger value="feature" onClick={() => setSelectedType("feature")}>Features</TabsTrigger>
                    <TabsTrigger value="data" onClick={() => setSelectedType("data")}>Data Updates</TabsTrigger>
                    <TabsTrigger value="news" onClick={() => setSelectedType("news")}>News</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <div className="space-y-8">
                        {filteredUpdates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="overflow-hidden transition-all hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{update.title}</CardTitle>
                                                <CardDescription className="flex items-center gap-1 mt-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {update.date}
                                                    <span className="inline-flex items-center gap-1 ml-3 text-xs px-2 py-1 rounded-full bg-muted">
                                                        {getTypeIcon(update.type)}
                                                        {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                            {update.badge && (
                                                <Badge variant={update.badgeVariant || "default"}>
                                                    {update.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{update.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="ghost" className="hover:bg-transparent p-0 h-auto text-primary">
                                            Read more <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* The other tab contents will automatically show based on selectedType state */}
                <TabsContent value="feature" className="mt-0" />
                <TabsContent value="data" className="mt-0" />
                <TabsContent value="news" className="mt-0" />
            </Tabs>
        </div>
    )
}
