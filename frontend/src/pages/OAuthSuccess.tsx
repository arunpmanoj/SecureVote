import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserState } from "../App";
import { API_BASE_URL } from "../config";

interface Props {
  updateUserState: (updates: Partial<UserState>) => void;
}

export default function OAuthSuccess({ updateUserState }: Props) {
  const navigate = useNavigate();
  const hasRun = useRef(false); // 👈 STRICT MODE GUARD

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const loadUser = async () => {
      try {
        // Remove any lingering redirect toast
        toast.dismiss("oauth-redirect");

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const user = await res.json();

        updateUserState({
          isAuthenticated: true,
          userName: user.name,
          isVerified: user.isVerified,
          hasVoted: user.hasVoted,
          isDisqualified: user.isDisqualified,
        });

        toast.success(`Welcome, ${user.name}! 🎉`, {
          id: "auth-success",
        });

        navigate("/verify", { replace: true });
      } catch (err) {
        toast.dismiss("oauth-redirect");

        toast.error("Authentication failed. Please try again.", {
          id: "auth-error",
        });

        navigate("/", { replace: true });
      }
    };

    loadUser();
  }, [navigate, updateUserState]);

  return <p>Signing you in…</p>;
}
