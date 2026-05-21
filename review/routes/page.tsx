"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log(data);

    alert("Upload success");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-5xl font-bold">
        PortalFlow AI
      </h1>

      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Connect Google Drive
        </button>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <p>{session.user?.email}</p>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <button
            onClick={uploadFile}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Upload File
          </button>

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-3 rounded-xl"
          >
            Sign Out
          </button>
        </div>
      )}
    </main>
  );
}
