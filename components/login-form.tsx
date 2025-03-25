"use client";

import type React from "react";
import { login, signup } from "@/app/login/actions";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (isLogin) {
        const result = await login(formData);
      } else {
        await signup(formData);
      }
    } catch (error) {
      console.error(isLogin ? "Login failed:" : "Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {isLogin ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your credentials to access your account"
            : "Create an account to get started"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </Button>
          <div className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary underline hover:text-primary/90"
              onClick={toggleMode}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
