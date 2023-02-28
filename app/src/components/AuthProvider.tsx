import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, createContext, useEffect, useState } from "react";
import { signIn as loadUser } from "@/api";

import { Spinner } from "./Spinner";

export const AuthContext = createContext<{
  user: "guest" | { [x: string]: any } | null;
  guestSignIn: () => void;
  signIn: () => void;
  isLoading: boolean;
  signOut: () => void;
}>({
  user: null,
  guestSignIn: () => {},
  signIn: () => {},
  isLoading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fetchingUserError, setIsFetchingUserError] = useState(false);

  useEffect(() => {
    (async () => {
      if (session && session.user) {
        try {
          setIsFetchingUser(true);
          const data = await loadUser(session.user);
          setUser(data.user);
        } catch (err) {
          setIsFetchingUserError(true);
        } finally {
          setIsFetchingUser(false);
        }
      }
    })();
  }, [session]);

  const isLoading = status === "loading" || isFetchingUser;

  const guestSignIn = () => {
    setUser("guest");
  };

  const value = {
    user,
    guestSignIn,
    signIn: () => signIn("google"),
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="py-10 grid place-items-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
