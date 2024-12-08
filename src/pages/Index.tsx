import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { data: subscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmotionSelect = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else if (selectedEmotions.length < 2) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSubmitRecipe = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit recipes",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!subscription?.isSubscribed) {
      toast({
        title: "Premium feature",
        description: "Recipe submission is available for premium users only",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    setShowSubmissionForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-5xl mx-auto px-6 py-12 space-y-12">
        <AnimatePresence mode="wait">
          {showSubmissionForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowSubmissionForm(false)}
                className="mb-4 hover:bg-primary/10"
              >
                ← Back to Recipes
              </Button>
              <RecipeSubmissionForm />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Find Recipes for Your Mood
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Select your emotions and ingredients to discover perfectly matched recipes
                </p>
              </div>

              <EmotionSelector
                selectedEmotions={selectedEmotions}
                onEmotionSelect={handleEmotionSelect}
              />
              
              <IngredientInput
                ingredients={ingredients}
                onIngredientsChange={setIngredients}
              />

              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none"
                  disabled={selectedEmotions.length === 0}
                  onClick={() => setShowRecipes(true)}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find Perfect Recipes
                </Button>
              </motion.div>

              {showRecipes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <RecipeList
                    selectedEmotions={selectedEmotions}
                    ingredients={ingredients}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;