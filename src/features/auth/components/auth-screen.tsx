"use client";

import { SignInCard, SignUpCard } from "@/features/auth/components";
import { SignInFlow } from "@/features/auth/types";
import { useState } from "react";

export function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
}
