"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { UseGetCurrentUser } from "@/api/users/get-current-user";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  History,
  User,
  ShieldCheck,
} from "lucide-react";
// Assuming you have one, if not I'll just skip or add one later

const NAV_ITEMS = [
  { label: "Dashboard", href: "/quiz", icon: LayoutDashboard },
  { label: "History", href: "/quiz/history", icon: History },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = UseGetCurrentUser();

  // Hide Navbar on Auth pages
  // Hide Navbar on Auth pages
  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

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
        <div className="hidden md:flex md:flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent",
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {/* Admin Link (Ideally check role) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/admin"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent",
                    )}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-xl">
                    Exam<span className="text-primary">Orbit</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent text-muted-foreground"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  </SheetClose>
                </div>

                {user && (
                  <div className="absolute bottom-8 left-4 right-4">
                    <div className="flex items-center gap-3 mb-4 px-4 bg-white/5 p-3 rounded-lg">
                      <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
