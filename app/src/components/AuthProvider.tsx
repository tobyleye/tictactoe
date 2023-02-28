import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, createContext, useEffect, useState } from "react";

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

const remoteSignIn = async (user: any) => {
  const body = JSON.stringify({ user });
  const response = await fetch("http://localhost:5201/signin", {
    method: "post",
    body: body,
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fetchingUserError, setIsFetchingUserError] = useState(false);

  useEffect(() => {
    const loadUser = async (user: any) => {
      try {
        setIsFetchingUser(true);
        const data = await remoteSignIn(user);
        setUser(data.user);
      } catch (err) {
        setIsFetchingUserError(true);
      } finally {
        setIsFetchingUser(false);
      }
    };
    // load user
    if (session && session.user) {
      loadUser(session.user);
    }
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
