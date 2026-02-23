"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: "student",
        }
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        toast.error("User already exists. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-[calc(100vh-73px)] py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-6 text-center">
          <div className="mx-auto bg-primary text-white p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create an Account</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign up to start learning with expert-led courses.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11 font-bold text-md mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 border-slate-200" onClick={() => handleOAuth("github")}>
              Github
            </Button>
            <Button variant="outline" className="h-11 border-slate-200" onClick={() => handleOAuth("google")}>
              Google
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
