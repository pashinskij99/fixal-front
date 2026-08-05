import useInitSession from "@/entities/session/api/useInitSession";
import { useSessionStore } from "@/entities/session/model/session.store";
import { Spinner } from "@/shared/ui/spinner";
import { type ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  useInitSession();
  const isInitializing = useSessionStore((state) => state.isInitializing);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />;
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
