"use client";
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";

export type LoginState = {
  error?: string;
  success?: boolean;
};

const LoginPage = () => {
  const router = useRouter();
  const [state, LoginAction, isPending] = useActionState(
    async (
      prevState: LoginState,
      formData: FormData,
    ): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      try {
        await apiClient.login( email, password );
        router.push("/dashboard");
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : ":Login failed",
        };
      }
    },
    { error: undefined, success: undefined },
  );
  return (
    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md mx-auto">
      <form action={LoginAction}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{" "}
            <Link
              className="font-medium text-blue-400 hover:text-blue-300"
              href={"/login"}
            >
              Register account
            </Link>
          </p>
        </div>
        {state?.error && (
          <div className="bg-red-950 border-red-700 text-red-300 px-3 py-3 rounded mb-4">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your Email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="password"
              required
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your Password"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
