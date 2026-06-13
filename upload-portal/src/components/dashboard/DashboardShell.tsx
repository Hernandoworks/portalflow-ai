"use client";

import { signOut } from "next-auth/react";
import UploadCard from "@/components/upload/UploadCard";

interface Props {
  email: string;
}

export default function DashboardShell({
  email,
}: Props) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <header className="border-b border-zinc-800 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            PortalFlow AI
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            Upload Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="text-sm font-medium">
              {email}
            </p>

            <p className="text-zinc-500 text-xs">
              Connected via Google
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-5 py-3 rounded-xl"
          >
            Sign Out
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <UploadCard />
      </div>

    </main>
  );
}
