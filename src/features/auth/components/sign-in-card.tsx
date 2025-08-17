"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "@/features/auth/types";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Props = {
  setState: (state: SignInFlow) => void;
};

export function SignInCard({ setState }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const { signIn } = useAuthActions();

  const handleProviderSignIn = (provider: "google" | "github") => {
    setPending(true);
    signIn(provider).finally(() => setPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Use your email on another service to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            disabled={pending}
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            disabled={pending}
          />

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={pending}
            onClick={() => handleProviderSignIn("google")}
            variant="outline"
          >
            <FcGoogle className="!size-5" />
            Continue with Google
          </Button>
          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={pending}
            onClick={() => handleProviderSignIn("github")}
            variant="outline"
          >
            <FaGithub className="!size-5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
