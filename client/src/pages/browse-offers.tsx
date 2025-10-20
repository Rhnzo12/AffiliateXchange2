import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferCard } from "@/components/offer-card";

export default function BrowseOffers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["/api/offers", { niche: selectedNiche, sort: sortBy, search: searchQuery }],
  });

  const niches = [
    "All Categories",
    "Apps & Software",
    "Beauty & Wellness",
    "Tech & Gadgets",
    "Finance",
    "Education",
    "Gaming",
    "Fashion",
    "Food & Beverage",
    "Travel",
    "Fitness",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Browse Offers</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Discover affiliate opportunities perfect for your audience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger data-testid="select-niche">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {niches.slice(1).map((niche) => (
                      <SelectItem key={niche} value={niche.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="commission-high">Highest Commission</SelectItem>
                    <SelectItem value="commission-low">Lowest Commission</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Best Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Commission Type</h3>
                <div className="space-y-2">
                  {["Per Sale", "Per Lead", "Per Click", "Monthly Retainer", "Hybrid"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Priority Offers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">New This Week</span>
                  </label>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search and Filter Toggle */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* Trending Section */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chart-3" />
              <h2 className="text-lg font-semibold">Trending This Week</h2>
            </div>

            {/* Offers Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {offers && Array.isArray(offers) && offers.length > 0 ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {offers.map((offer: any) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onFavorite={(id) => console.log("Favorite:", id)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">
                      No offers found. Try adjusting your filters.
                    </p>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
