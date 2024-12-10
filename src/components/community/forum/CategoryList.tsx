import { motion } from "framer-motion";
import { CategoryCard } from "./CategoryCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface CategoryListProps {
  categories: any[];
  onNewTopic: (categoryId: string, isPremium: boolean) => void;
  filter?: "all" | "emotion" | "interest" | "premium";
  sortBy?: "trending" | "latest" | "popular";
  isPremium?: boolean;
}

export function CategoryList({ categories, onNewTopic, filter = "all", sortBy, isPremium }: CategoryListProps) {
  if (!categories.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No categories found
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={item}>
          <CategoryCard 
            category={category} 
            onNewTopic={() => onNewTopic(category.id, category.is_premium)} 
            isPremium={isPremium} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}