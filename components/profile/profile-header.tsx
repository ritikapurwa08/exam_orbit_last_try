import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doc } from "@/convex/_generated/dataModel";

interface ProfileHeaderProps {
  user: Doc<"users"> | null | undefined; // Adjust type based on your actual user type
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
}

export function ProfileHeader({
  user,
  isEditOpen, // eslint-disable-line @typescript-eslint/no-unused-vars
  setIsEditOpen, // eslint-disable-line @typescript-eslint/no-unused-vars
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Profile Section */}
      <section className="flex flex-col items-center mt-4">
        <div className="relative mb-4">
          {/* Avatar Ring */}
          <div className="size-32 rounded-full p-1 bg-linear-to-b from-[#bfa268] to-[#1a1a1a] shadow-xl">
            <Avatar className="size-full border-4 border-black">
              <AvatarImage src={user?.image} className="object-cover" />
              <AvatarFallback className="bg-[#222] text-2xl text-slate-400">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Edit Button */}
          {/* <button
            onClick={() => setIsEditOpen(true)}
            className="absolute bottom-0 right-1 size-9 rounded-full bg-indigo-600 border-4 border-black flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform hover:bg-indigo-500"
          >
            <Edit className="w-4 h-4" />
          </button> */}
        </div>

        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
          {user?.name || "Student Name"}
        </h1>
        <p className="text-sm text-slate-400 mb-2">{user?.email}</p>

        {/* Bio (Static for now as per schema) */}
        {/*
        {user?.bio && (
          <p className="text-sm text-slate-300 max-w-xs text-center mb-3 line-clamp-3">
            {user.bio}
          </p>
        )}
        */}

        <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Scholar
        </span>
      </section>
    </>
  );
}
