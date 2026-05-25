"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { geistSans } from "@/utils/fonts";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/");
      } else {
        alert("Wrong password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className={`${geistSans.className} text-4xl font-bold mb-2`}>
              Automator
            </h1>
            <p className="text-black/60 dark:text-white/60">
              Sign in to your account
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-medium text-black dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="text-sm focus:outline-0 border-black/40 dark:border-white/40 border-[1.5px] rounded-lg p-3 bg-white dark:bg-neutral-900 text-black dark:text-white [&:hover,&:focus]:border-black/80 dark:[&:hover,&:focus]:border-white/80 transition-all placeholder:text-black/40 dark:placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex gap-2 items-center justify-center bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg py-2.5 px-4 hover:ring-4 ring-black/10 dark:ring-white/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <LogIn size={18} />
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
