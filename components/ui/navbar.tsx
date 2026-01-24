"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { UseGetCurrentUser } from "@/api/users/get-current-user";

// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, History, User } from "lucide-react";
// Assuming you have one, if not I'll just skip or add one later

const NAV_ITEMS = [
  { label: "Dashboard", href: "/quiz", icon: LayoutDashboard },
  { label: "History", href: "/quiz/history", icon: History },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  // const { signOut } = useAuthActions();
  const user = UseGetCurrentUser();

  // Hide Navbar on Auth pages
  // Hide Navbar on Auth pages
  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-8">
        {/* LOGO */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
            Exam<span className="text-primary">Orbit</span>
          </span>
          <span className="sm:hidden font-bold text-xl">EO</span>
        </Link>

        {/* DESKTOP NAV */}
        <DesktopNav navItems={NAV_ITEMS} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* USER MENU */}
          {user ? (
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
              onClick={() => router.push("/profile")}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <Button size="sm" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
          )}

          {/* MOBILE NAV (SHEET) */}
          <MobileNav navItems={NAV_ITEMS} pathname={pathname} user={user} />
        </div>
      </div>
    </header>
  );
}
