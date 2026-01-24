import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShieldCheck, LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

export const DesktopNav = ({ navItems }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex md:flex-1">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
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
                className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
