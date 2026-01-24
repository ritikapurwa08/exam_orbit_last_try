import {
  User,
  BarChart3,
  History,
  Bell,
  Moon,
  Lock,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Doc } from "@/convex/_generated/dataModel";
import { ProfileMenuItem } from "./profile-menu-item";

interface ProfileMenuProps {
  user: Doc<"users"> | null | undefined;
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/auth");
  };

  const isAdmin = false; // logic to check admin

  return (
    <section className="mt-8">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">
        Settings
      </h3>
      <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
        <ProfileMenuItem
          icon={<User className="w-5 h-5" />}
          label="Account"
          bgClass="bg-blue-500/20"
          colorClass="text-blue-500"
        />

        {/* Statistics */}
        <ProfileMenuItem
          icon={<BarChart3 className="w-5 h-5" />}
          label="Statistics"
          bgClass="bg-violet-500/20"
          colorClass="text-violet-500"
          onClick={() => router.push("/stats")}
        />

        {/* History */}
        <ProfileMenuItem
          icon={<History className="w-5 h-5" />}
          label="History"
          bgClass="bg-orange-500/20"
          colorClass="text-orange-500"
          onClick={() => router.push("/quiz/history")}
        />

        {/* Notifications */}
        <ProfileMenuItem
          icon={<Bell className="w-5 h-5" />}
          label="Notifications"
          bgClass="bg-emerald-500/20"
          colorClass="text-emerald-500"
          rightElement={<Switch checked={true} />}
        />

        {/* Dark Mode */}
        <ProfileMenuItem
          icon={<Moon className="w-5 h-5" />}
          label="Dark Mode"
          bgClass="bg-slate-700/50"
          colorClass="text-slate-300"
          rightElement={<Lock className="w-4 h-4 text-slate-600" />}
          subLabel={
            <div className="text-[10px] font-bold text-indigo-400">
              Premium OLED Active
            </div>
          }
        />

        {/* Admin Console */}
        {isAdmin && (
          <ProfileMenuItem
            icon={<ShieldCheck className="w-5 h-5" />}
            label="Admin Console"
            bgClass="bg-red-500/20"
            colorClass="text-red-500"
            onClick={() => router.push("/admin/add-question")}
          />
        )}
      </div>
      {/* Log Out */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full h-14 mt-8 bg-[#111111] border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-500/10 transition-colors active:scale-[0.98]"
      >
        <div className="size-6 rounded-md border border-red-500/30 flex items-center justify-center">
          {loggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
        </div>
        Log Out
      </button>
    </section>
  );
}
