"use client";

import { UseGetCurrentUser } from "@/api/users/get-current-user";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileMenu } from "@/components/profile/profile-menu";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const user = UseGetCurrentUser();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-full bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans pb-24">
      <main className="px-5 pb-8 space-y-4 max-w-lg mx-auto w-full">
        <ProfileHeader
          user={user}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
        <ProfileStats user={user} />
        <ProfileMenu user={user} />
      </main>
    </div>
  );
}
