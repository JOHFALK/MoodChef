import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingMoodsProps {
  categories: Array<{
    id: string;
    name: string;
    category_type: string;
    forum_topics?: Array<any>;
  }>;
}

export function TrendingMoods({ categories }: TrendingMoodsProps) {
  const getTrendingMoods = () => {
    return categories
      .filter(cat => cat.category_type === 'emotion')
      .sort((a, b) => (b.forum_topics?.length || 0) - (a.forum_topics?.length || 0))
      .slice(0, 3);
  };

  const trendingMoods = getTrendingMoods();

  if (!trendingMoods.length) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Trending Moods</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendingMoods.map((mood) => (
          <Card key={mood.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <span className="font-medium">{mood.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {mood.forum_topics?.length || 0} active discussions
            </p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}