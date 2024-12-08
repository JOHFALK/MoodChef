import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { isSubscribed: false };

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
  });
}