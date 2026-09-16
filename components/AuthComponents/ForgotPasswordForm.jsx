"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import FloatingInput from "@/components/AuthComponents/FloatingInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/actions/users";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const { errorMessage, successMessage } =
        await requestPasswordReset(formData);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success(successMessage);
        setSubmitted(true);
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
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <p className="text-sm text-center text-emerald-600 font-medium py-4">
              Check your inbox for further instructions.
            </p>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <FloatingInput
                id="email"
                name="email"
                label="Email address"
                type="email"
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
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 pt-4 pb-6 text-xs text-gray-500">
          <Link
            href="/signin"
            className="font-bold text-blue-600 hover:underline"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
