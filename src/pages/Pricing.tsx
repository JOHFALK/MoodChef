import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MONTHLY_PRICE_ID = "price_1QTsOKHDqG3OwXYCGz5zoSAk";
const YEARLY_PRICE_ID = "price_1QTsTBHDqG3OwXYC2Bywnpnx";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to subscribe",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MoodChef</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground mt-2">
            Unlock premium features and take your cooking journey to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6">$0</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Basic mood-based recipes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Community access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Recipe voting</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => navigate("/")}>
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>For the passionate cook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">$4.99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>All Free Plan features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Submit and vote on recipes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Exclusive mood-based recipes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Advanced filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Personalized analytics</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(MONTHLY_PRICE_ID)}
                disabled={loading}
              >
                Subscribe Monthly
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleSubscribe(YEARLY_PRICE_ID)}
                disabled={loading}
              >
                Subscribe Yearly ($45.99)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}