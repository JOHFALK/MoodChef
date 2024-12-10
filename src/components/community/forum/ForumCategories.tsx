import { CategoryList } from "./CategoryList";
import { useNavigate } from "react-router-dom";

interface ForumCategoriesProps {
  categories: Array<{
    id: string;
    name: string;
    description: string | null;
    category_type: string;
    created_at: string;
    forum_topics?: Array<any>;
    is_premium?: boolean;
  }>;
  filter: "all" | "emotion" | "interest" | "premium";
  sortBy: "trending" | "latest" | "popular";
  searchQuery: string;
  selectedFilter: string | null;
  isPremium?: boolean;
}

export function ForumCategories({ 
  categories = [], 
  filter, 
  sortBy, 
  searchQuery, 
  selectedFilter,
  isPremium 
}: ForumCategoriesProps) {

  const navigate = useNavigate();

  const handleNewTopic = (categoryId: string, isPremiumCategory: boolean) => {
    if (!isPremium && isPremiumCategory) {
      navigate("/pricing");
      return;
    }
    navigate(`/community/new-topic/${categoryId}`);
  };

  const filteredCategories = categories.filter(category => {
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
        return category.category_type === "emotion" && (!category.is_premium || isPremium);
      case "interest":
        return category.category_type === "interest" && (!category.is_premium || isPremium);
      case "premium":
        return category.is_premium && isPremium;
      default:
        return !category.is_premium || isPremium;
    }
  });

  const getSortedCategories = () => {
    if (!filteredCategories.length) return [];
    
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