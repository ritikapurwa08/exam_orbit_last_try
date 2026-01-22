import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "react-hook-form";
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
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { SignInFlow } from "@/types/auth-types";
import { useRouter } from "next/navigation";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuthActions();

  const handlePasswordSignIn = form.handleSubmit(({ email, password }) => {
    setSigningIn(true);
    signIn("password", { email, password, flow: "signIn" })
      .then(() => {
        router.push("/quiz");
      })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setSigningIn(false);
      });
  });

  return (
    <Card className="glass-card w-full h-full p-8 border-white/10 bg-transparent text-white">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Login to continue</CardTitle>
        <CardDescription className="text-white/50">
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 border border-destructive/20">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handlePasswordSignIn}>
          <Input
            {...form.register("email", {
              required: true,
            })}
            disabled={signingIn}
            placeholder="Email"
            type="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
          />
          <Input
            {...form.register("password", {
              required: true,
            })}
            disabled={signingIn}
            placeholder="Password"
            type="password"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
            size="lg"
            disabled={signingIn}
          >
            Continue
          </Button>
        </form>
        <Separator className="bg-white/10" />

        <p className="text-xs text-white/50">
          Don&apos;t have an account?{" "}
          <span
            className="text-primary hover:underline cursor-pointer font-medium"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
