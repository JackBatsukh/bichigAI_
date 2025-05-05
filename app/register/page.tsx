"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

interface FormData {
  fullName: string;
  // birthDate: string;
  email: string;
  password: string;
}


export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
  });

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-8 bg-black/20 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-500 mb-2">
          Create Account
        </h1>
        <p className="text-gray-400">Sign up to get started with BichigAI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-500"
              required
            />
          </div>

          {/* <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-300 mb-1">
              Birth Date
            </label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white"
              required
            />
          </div> */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-black/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Sign up
        </button>

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#021634] text-gray-400">
              Or continue with
            </span>
          </div>
        </div> */}

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-600 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors text-white">
          <Image
            src="/google-icon.svg"
            width={20}
            height={20}
            alt="Google logo"
          />
          Sign up with Google
        </button>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
