import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SignUpFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignUpForm = ({ form, onSubmit, isLoading }: SignUpFormProps) => {
  return (
    <form className="space-y-2.5" onSubmit={onSubmit}>
      <Input
        {...form.register("name", {
          required: true,
        })}
        disabled={isLoading}
        placeholder="Full name"
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
      />
      <Input
        {...form.register("email", {
          required: true,
        })}
        disabled={isLoading}
        placeholder="Email"
        type="email"
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
      />
      <Input
        {...form.register("password", {
          required: true,
        })}
        disabled={isLoading}
        placeholder="Password"
        type="password"
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
      />
      <Input
        {...form.register("confirmPassword", {
          required: true,
        })}
        disabled={isLoading}
        placeholder="Confirm password"
        type="password"
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
      />
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
        size="lg"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </form>
  );
};
