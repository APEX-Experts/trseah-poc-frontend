import { useAuthControllerGetPermissions } from "@/lib/api/react-query/auth/auth";

export function useUserPermissions() {
  const { data, isLoading, error } = useAuthControllerGetPermissions({
    query: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  });

  const permissions = data?.permissions || [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  // ADMIN / SUPER_ADMIN / MANAGER roles map to having 'requests.review' or 'requests.invoice' permission
  const isAdmin = hasPermission("requests.review") || hasPermission("requests.invoice");

  return {
    permissions,
    hasPermission,
    isAdmin,
    isLoading,
    error,
  };
}
