import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryList } from "./CategoryList";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ForumCategoriesProps {
  filter: "all" | "emotion" | "interest" | "premium";
  sortBy: "trending" | "latest" | "popular";
  searchQuery: string;
  selectedFilter: string | null;
  isPremium?: boolean;
}

export function ForumCategories({ filter, sortBy, searchQuery, selectedFilter, isPremium }: ForumCategoriesProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSession();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["forumCategories", filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select(`
          *,
          forum_topics (
            id,
            title,
            created_at,
            user_id,
            views,
            emotions,
            has_recipe,
            forum_replies(count)
          )
        `);

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      return data || [];
    },
  });

  const handleNewTopic = async (categoryId: string, isPremiumCategory: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create topics",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (isPremiumCategory && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Creating topics in premium categories requires a premium subscription",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }
    
    navigate(`/community/new-topic/${categoryId}`);
  };

  const filteredCategories = categories?.filter(category => {
    // Apply search filter
    if (searchQuery) {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    // Apply category filter
    if (selectedFilter) {
      return category.name === selectedFilter;
    }

    // Filter based on category type and premium status
    switch (filter) {
      case "emotion":
        return category.category_type === "emotion";
      case "interest":
        return category.category_type === "interest" && (!category.is_premium || isPremium);
      case "premium":
        return category.is_premium;
      default:
        return !category.is_premium || isPremium;
    }
  });

  const getSortedCategories = () => {
    if (!filteredCategories) return [];
    
    switch (sortBy) {
      case "trending":
        return [...filteredCategories].sort((a, b) => 
          (b.forum_topics?.length || 0) - (a.forum_topics?.length || 0)
        );
      case "latest":
        return [...filteredCategories].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "popular":
        return [...filteredCategories].sort((a, b) => {
          const aViews = a.forum_topics?.reduce((sum, topic) => sum + (topic.views || 0), 0) || 0;
          const bViews = b.forum_topics?.reduce((sum, topic) => sum + (topic.views || 0), 0) || 0;
          return bViews - aViews;
        });
      default:
        return filteredCategories;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <CategoryList 
      categories={getSortedCategories()} 
      onNewTopic={handleNewTopic}
      filter={filter}
      sortBy={sortBy}
      isPremium={isPremium}
    />
  );
}