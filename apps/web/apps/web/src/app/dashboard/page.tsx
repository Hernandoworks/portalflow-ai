"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [portals, setPortals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/portals/list")
      .then((res) => res.json())
      .then((data) => {
        setPortals(data.portals || []);
      });
  }, []);

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

          <a
            href="/create-portal"
            className="bg-white text-black px-6 py-4 rounded-2xl font-bold"
          >
            Create Portal
          </a>

        </div>

        {portals.length ==" 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

            <h2 className="text-3xl font-bold">
              No Portals Yet
            </h2>

            <p className="text-zinc-500 mt-4">
              Create your first workflow upload portal.
            </p>

          </div>
        ) : (
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

                  <div className="break-all">
                    Portal:
                    {" "}
                    <a
                      className="text-blue-400"
                      href={`/upload/${portal.slug}`}
                      target="_blank"
                    >
                      /upload/{portal.slug}
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

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}
