import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loadingsvg from "./Loadingsvg";

const PrivateRoute = ({ children }) => {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !session) {
      router.push("/signin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Loadingsvg />;
  }

  return session ? children : null;
};

export default PrivateRoute
