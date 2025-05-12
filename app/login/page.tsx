"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.href = "/";
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="space-y-6 bg-black/20 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-white/10 w-full max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-500 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Sign in to continue to BichigAI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Sign in
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#021634] text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 border border-gray-600 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-white/5 transition-colors text-white text-sm sm:text-base"
        >
          <Image
            src="/google-icon.svg"
            width={18}
            height={18}
            alt="Google logo"
            className="sm:w-5 sm:h-5"
          />
          Sign in with Google
        </button>
      </form>

      <p className="text-center text-gray-400 text-sm sm:text-base">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}