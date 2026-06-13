"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [portals, setPortals] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadPortals = async () => {
    const res = await fetch(
      "/api/portals/list"
    );

    const data = await res.json();

    setPortals(data.portals || []);

    setLoading(false);
  };

  useEffect(() => {
    loadPortals();
  }, []);

  const togglePortal = async (
    id: string
  ) => {
    await fetch(
      "/api/portals/toggle",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      }
    );

    loadPortals();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (portals.length === 0) {
    window.location.href =
      "/create-portal";

    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-12">

          <div>
            <h1 className="text-5xl font-black">
              Portal Dashboard
            </h1>

            <p className="text-zinc-500 mt-4 text-lg">
              Manage upload workflows
            </p>
          </div>

          <div className="flex gap-4">

            <a
              href="/dashboard/uploads"
              className="bg-zinc-800 px-6 py-4 rounded-2xl font-bold"
            >
              Upload History
            </a>

            <a
              href="/create-portal"
              className="bg-white text-black px-6 py-4 rounded-2xl font-bold"
            >
              Create Portal
            </a>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {portals.map((portal) => (
            <div
              key={portal.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    {portal.name}
                  </h2>

                  <p className="text-zinc-500 mt-3">
                    {portal.description}
                  </p>
                </div>

                <div
                  className={
                    portal.allowUploads
                      ? "bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs"
                      : "bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs"
                  }
                >
                  {portal.allowUploads
                    ? "OPEN"
                    : "CLOSED"}
                </div>

              </div>

              <div className="mt-8 space-y-3 text-sm">

                <div>
                  Upload Count:
                  {" "}
                  {portal.uploadCount}
                </div>

                <div>

                  <a
                    className="text-blue-400"
                    href={`/upload/${portal.slug}`}
                    target="_blank"
                  >
                    Open Public Portal
                  </a>

                </div>

                <div>

                  <a
                    href={portal.folderLink}
                    target="_blank"
                    className="text-emerald-400"
                  >
                    Open Drive Folder
                  </a>

                </div>

              </div>

              <button
                onClick={() =>
                  togglePortal(
                    portal.id
                  )
                }
                className="mt-8 w-full bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl font-bold"
              >
                {portal.allowUploads
                  ? "Disable Uploads"
                  : "Enable Uploads"}
              </button>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}
