"use client";

import React, { useState } from "react";
import Link from "next/link";
import FloatingInput from "@/components/AuthComponents/FloatingInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Register submitted:", formData);
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
          <CardTitle className="text-xl font-bold text-gray-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Join Revend to buy and sell locally
          </CardDescription>
        </CardHeader>

        {/* GOOGLE LOGIN BUTTON OPTION */}
        <div className="px-28">
          <Button
            variant="outline"
            type="button"
            className="w-full rounded-xl text-xs font-semibold border-gray-200 hover:bg-gray-50 py-5"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-gray-400 font-semibold">
              Or sign in with email
            </span>
          </div>
        </div>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <FloatingInput
              id="name"
              label="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FloatingInput
              id="email"
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FloatingInput
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-12 rounded-xl transition-all shadow-sm mt-2"
            >
              Create Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 border-t border-gray-100 text-xs text-gray-500">
          <p>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
