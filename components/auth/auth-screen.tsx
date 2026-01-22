"use client";

import { useState } from "react";
import { SignInFlow } from "@/types/auth-types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-full min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="md:h-autop p-2  md:w-105">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
