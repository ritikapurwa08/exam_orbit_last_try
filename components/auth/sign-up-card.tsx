import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpForm } from "./sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "@/types/auth-types";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signIn } = useAuthActions();

  const handlePasswordSignUp = form.handleSubmit(
    ({ name, email, password }) => {
      setSigningUp(true);
      signIn("password", { name, email, password, flow: "signUp" })
        .then(() => {
          router.push("/quiz");
        })
        .catch(() => {
          setError("Something went wrong!");
        })
        .finally(() => {
          setSigningUp(false);
        });
    },
  );

  return (
    <Card className="glass-card w-full h-full p-8 border-white/10 bg-transparent text-white">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">
          Sign up to continue
        </CardTitle>
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
        <SignUpForm
          form={form}
          onSubmit={handlePasswordSignUp}
          isLoading={signingUp}
        />
        <Separator className="bg-white/10" />
        <p className="text-xs text-white/50">
          Already have an account?{" "}
          <span
            className="text-primary hover:underline cursor-pointer font-medium"
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
