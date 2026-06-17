import { useRouter } from "@/i18n/navigation";
import {
  useAuthControllerGetProfile,
  useAuthControllerLogout,
} from "@/lib/api/react-query/auth/auth";
import { AuthControllerGetProfile200 } from "@/types/api";

export {
  useAuthControllerLogin,
  useAuthControllerRegister,
  useMagicLinkControllerRequest,
  useMagicLinkControllerVerify,
  useAuthControllerVerify,
  useAuthControllerResendVerification,
  useAuthControllerLogout,
  useAuthControllerGetProfile,
  useAuthControllerGoogleAuth,
  useAuthControllerGoogleAuthRedirect,
  useAuthControllerForgotPassword,
  useAuthControllerResetPassword,
  useAuthControllerVerifyResetToken,
} from "@/lib/api/react-query/auth/auth";

export const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/google`;

export const useAuthAndLogout = (initialProfileData?: AuthControllerGetProfile200) => {
  const { data, isLoading, error } = useAuthControllerGetProfile({
    query: {
      initialData: initialProfileData,
      staleTime: 1000 * 60 * 5,
    },
  });
  const router = useRouter();
  const { mutate: logout, isPending } = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        // Redirect to login page after successful logout
        router.push("/auth/login");
        // Force a refresh to clear any cached states if necessary
        router.refresh();
      },
    },
  });

  const handleLogout = () => {
    logout();
  };
  const user = data?.data;

  return {
    user,
    isLoading,
    error,
    handleLogout,
    isPending,
    statusCode: data?.statusCode,
  };
};
