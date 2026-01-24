import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ShieldCheck, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  navItems: NavItem[];
  pathname: string;
  user?: Doc<"users"> | null;
}

export const MobileNav = ({ navItems, pathname, user }: MobileNavProps) => {
  return (
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
            {navItems.map((item) => (
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
                  <p className="text-sm font-medium truncate">{user.name}</p>
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
  );
};
