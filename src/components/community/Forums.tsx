import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingMoods } from "./forum/TrendingMoods";
import { ForumSearch } from "./forum/ForumSearch";
import { ForumActions } from "./forum/ForumActions";
import { ForumFilters } from "./forum/ForumFilters";
import { ForumCategories } from "./forum/ForumCategories";
import { TrendingUp, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

export function Forums() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "trending" | "popular">("trending");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useSubscription();

  if (isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TrendingMoods />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <ForumSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ForumActions sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <ForumFilters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px] mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="emotion">Emotions</TabsTrigger>
          <TabsTrigger value="interest">Interests</TabsTrigger>
          <TabsTrigger value="premium" className="relative">
            Premium
            <Crown className="h-4 w-4 ml-1 text-yellow-500" />
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ForumCategories 
            filter="all"
            sortBy={sortBy}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            isPremium={subscriptionData?.isSubscribed}
          />
        </TabsContent>

        <TabsContent value="emotion" className="mt-6">
          <ForumCategories 
            filter="emotion"
            sortBy={sortBy}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            isPremium={subscriptionData?.isSubscribed}
          />
        </TabsContent>

        <TabsContent value="interest" className="mt-6">
          <ForumCategories 
            filter="interest"
            sortBy={sortBy}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            isPremium={subscriptionData?.isSubscribed}
          />
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <ForumCategories 
            filter="premium"
            sortBy={sortBy}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            isPremium={subscriptionData?.isSubscribed}
          />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <ForumCategories 
            filter="all"
            sortBy="trending"
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            isPremium={subscriptionData?.isSubscribed}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}