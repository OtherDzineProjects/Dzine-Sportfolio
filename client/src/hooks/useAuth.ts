import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
    staleTime: Infinity,
  });

  return {
    user: userProfile?.user,
    isLoading,
    isAuthenticated: !!userProfile?.user,
  };
}