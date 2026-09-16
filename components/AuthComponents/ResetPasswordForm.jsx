"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import FloatingInput from "@/components/AuthComponents/FloatingInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/lib/actions/users";

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const { errorMessage } = await updatePassword(formData);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Password updated successfully!");
        router.push("/login");
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-gray-200/80 shadow-sm bg-white">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mb-2">
            <Link
              href="/"
              className="text-3xl font-black tracking-tight inline-block"
            >
              <span className="text-blue-500">Re</span>
              <span className="text-gray-600">vend</span>
            </Link>
          </div>
          <CardDescription className="text-xs text-gray-500">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <FloatingInput
              id="password"
              name="password"
              label="New Password"
              type="password"
              minLength={8}
              required
              disabled={isPending}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-sm"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
