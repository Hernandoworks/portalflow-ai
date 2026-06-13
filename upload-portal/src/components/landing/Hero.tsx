"use client";

import { signIn } from "next-auth/react";

export default function Hero() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-5xl text-center">

        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full mb-8 text-sm text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Google Drive Connected Upload Platform
        </div>

        <h1 className="text-7xl font-black tracking-tight">
          PortalFlow AI
        </h1>

        <p className="text-zinc-400 text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          Workflow-based document collection for suppliers,
          procurement, onboarding, compliance, and client submissions.
        </p>

        <button
          onClick={() => signIn("google")}
          className="mt-12 bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition-all duration-200"
        >
          Connect Google Drive
        </button>

      </div>
    </main>
  );
}
