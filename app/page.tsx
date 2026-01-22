"use client";

import { AuthScreen } from "@/components/auth/auth-screen";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/quiz");
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">
      Loading Dashboard...
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Authenticated>
        <DashboardRedirect />
      </Authenticated>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>
    </main>
  );
}
