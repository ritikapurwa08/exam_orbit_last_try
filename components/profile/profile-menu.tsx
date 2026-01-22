import {
  User,
  BarChart3,
  History,
  Bell,
  Moon,
  Lock,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Doc } from "@/convex/_generated/dataModel";

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
        {/* Account */}
        <div className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">Account</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div>

        {/* Vocabulary */}
        {/* <div
          onClick={() => router.push("/learn/words")}
          className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">Vocabulary</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div> */}

        {/* Statistics */}
        <div
          onClick={() => router.push("/stats")}
          className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">Statistics</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div>

        {/* History */}
        <div
          onClick={() => router.push("/quiz/history")}
          className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div>

        {/* Notifications */}
        <div className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">Notifications</span>
          </div>
          <Switch checked={true} />
        </div>

        {/* Dark Mode */}
        <div className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Dark Mode</div>
              <div className="text-[10px] font-bold text-indigo-400">
                Premium OLED Active
              </div>
            </div>
          </div>
          <Lock className="w-4 h-4 text-slate-600" />
        </div>

        {/* Admin Console */}
        {isAdmin && (
          <div
            onClick={() => router.push("/admin/add-question")}
            className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer hover:bg-white/5 border-t border-white/5 group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-white">
                Admin Console
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </div>
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
